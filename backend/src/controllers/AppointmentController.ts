import { Request, Response } from 'express';
import { prisma } from '../lib/prisma';
import { appointmentSchema } from '../validators/schemas';

export class AppointmentController {
  async index(req: Request, res: Response): Promise<void> {
    try {
      const { date, userId, status, page = '1', limit = '50' } = req.query;
      const skip = (Number(page) - 1) * Number(limit);
      const where: any = {};

      if (date) {
        const startOfDay = new Date(String(date) + 'T00:00:00-03:00');
        const endOfDay = new Date(String(date) + 'T23:59:59-03:00');
        where.date = { gte: startOfDay, lte: endOfDay };
      }

      if (userId) where.userId = String(userId);
      if (status) where.status = String(status);

      const [appointments, total] = await Promise.all([
        prisma.appointment.findMany({
          where, skip, take: Number(limit), orderBy: { date: 'asc' },
          include: {
            client: { select: { id: true, name: true, phone: true, avatar: true } },
            service: { select: { id: true, name: true, price: true, duration: true } },
            user: { select: { id: true, name: true, avatar: true } },
          },
        }),
        prisma.appointment.count({ where }),
      ]);

      res.json({ appointments, total, page: Number(page), totalPages: Math.ceil(total / Number(limit)) });
    } catch (error) {
      console.error('Erro ao buscar agendamentos:', error);
      res.status(500).json({ error: 'Erro ao buscar agendamentos' });
    }
  }

  async store(req: Request, res: Response): Promise<void> {
    try {
      const validatedData = appointmentSchema.parse(req.body);
      const appointmentDate = new Date(validatedData.date);

      const service = await prisma.service.findUnique({ where: { id: validatedData.serviceId } });
      if (!service) {
        res.status(400).json({ error: 'Serviço não encontrado' });
        return;
      }

      const durationMinutes = service.duration;
      const newStart = new Date(appointmentDate);
      const newEnd = new Date(appointmentDate.getTime() + durationMinutes * 60000);

      const startOfDay = new Date(appointmentDate);
      startOfDay.setHours(0, 0, 0, 0);
      const endOfDay = new Date(appointmentDate);
      endOfDay.setHours(23, 59, 59, 999);

      const existingAppointments = await prisma.appointment.findMany({
        where: {
          userId: validatedData.userId,
          date: { gte: startOfDay, lte: endOfDay },
          status: { notIn: ['CANCELLED', 'NO_SHOW'] },
        },
        include: { 
          service: true,
          client: { select: { name: true } },
        },
      });

      for (const existing of existingAppointments) {
        const existStart = new Date(existing.date);
        const existEnd = new Date(existing.date.getTime() + existing.service.duration * 60000);

        if (newStart < existEnd && newEnd > existStart) {
          const nextAvailable = new Date(existEnd.getTime() + 5 * 60000);
          const nextTime = nextAvailable.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
          const clientName = existing.client?.name || 'Cliente';
          
          res.status(409).json({
            error: `Horário indisponível! ${clientName} já está agendado das ${existStart.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })} às ${existEnd.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}. Próximo horário: ${nextTime}`,
          });
          return;
        }
      }

      const appointment = await prisma.appointment.create({
        data: {
          date: appointmentDate,
          status: 'SCHEDULED',
          notes: validatedData.notes || null,
          price: validatedData.price,
          userId: validatedData.userId,
          clientId: validatedData.clientId,
          serviceId: validatedData.serviceId,
        },
        include: {
          client: true,
          service: true,
          user: { select: { id: true, name: true } },
        },
      });

      res.status(201).json(appointment);
    } catch (error: any) {
      if (error.name === 'ZodError') {
        res.status(400).json({ error: 'Dados inválidos', details: error.errors });
        return;
      }
      console.error('Erro ao criar agendamento:', error);
      res.status(500).json({ error: 'Erro ao criar agendamento' });
    }
  }

  async update(req: Request, res: Response): Promise<void> {
    try {
      const id = String(req.params.id);
      const validatedData = appointmentSchema.partial().parse(req.body);

      const appointment = await prisma.appointment.update({
        where: { id },
        data: { ...validatedData, date: validatedData.date ? new Date(validatedData.date) : undefined },
        include: { client: true, service: true, user: { select: { id: true, name: true } } },
      });

      res.json(appointment);
    } catch (error: any) {
      if (error.name === 'ZodError') {
        res.status(400).json({ error: 'Dados inválidos', details: error.errors });
        return;
      }
      res.status(500).json({ error: 'Erro ao atualizar agendamento' });
    }
  }

  async destroy(req: Request, res: Response): Promise<void> {
    try {
      const id = String(req.params.id);
      await prisma.appointment.delete({ where: { id } });
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: 'Erro ao remover agendamento' });
    }
  }
}
