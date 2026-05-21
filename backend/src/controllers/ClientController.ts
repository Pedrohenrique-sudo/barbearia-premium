import { Request, Response } from 'express';
import { prisma } from '../lib/prisma';
import { clientSchema } from '../validators/schemas';

export class ClientController {
  async index(req: Request, res: Response): Promise<void> {
    try {
      const { search, page = '1', limit = '20' } = req.query;
      const skip = (Number(page) - 1) * Number(limit);

      const where: any = { active: true };
      
      if (search) {
        where.OR = [
          { name: { contains: String(search), mode: 'insensitive' } },
          { phone: { contains: String(search) } },
          { email: { contains: String(search), mode: 'insensitive' } },
        ];
      }

      const [clients, total] = await Promise.all([
        prisma.client.findMany({
          where,
          skip,
          take: Number(limit),
          orderBy: { createdAt: 'desc' },
          include: {
            _count: {
              select: { appointments: true },
            },
          },
        }),
        prisma.client.count({ where }),
      ]);

      res.json({
        clients,
        total,
        page: Number(page),
        totalPages: Math.ceil(total / Number(limit)),
      });
    } catch (error) {
      res.status(500).json({ error: 'Erro ao buscar clientes' });
    }
  }

  async show(req: Request, res: Response): Promise<void> {
    try {
      const id = String(req.params.id);

      const client = await prisma.client.findUnique({
        where: { id },
        include: {
          appointments: {
            include: {
              service: true,
              user: {
                select: { id: true, name: true },
              },
            },
            orderBy: { date: 'desc' },
            take: 10,
          },
          timeline: {
            orderBy: { eventDate: 'desc' },
          },
        },
      });

      if (!client) {
        res.status(404).json({ error: 'Cliente não encontrado' });
        return;
      }

      res.json(client);
    } catch (error) {
      res.status(500).json({ error: 'Erro ao buscar cliente' });
    }
  }

  async store(req: Request, res: Response): Promise<void> {
    try {
      // Limpar dados antes de validar
      const data = {
        ...req.body,
        email: req.body.email || null,
        notes: req.body.notes || null,
      };
      
      const validatedData = clientSchema.parse(data);

      const existingClient = await prisma.client.findUnique({
        where: { phone: validatedData.phone },
      });

      if (existingClient) {
        res.status(409).json({ error: 'Telefone já cadastrado' });
        return;
      }

      const client = await prisma.client.create({
        data: {
          name: validatedData.name,
          email: validatedData.email || null,
          phone: validatedData.phone,
          notes: validatedData.notes || null,
          birthDate: validatedData.birthDate ? new Date(validatedData.birthDate) : null,
        },
      });

      res.status(201).json(client);
    } catch (error: any) {
      if (error.name === 'ZodError') {
        res.status(400).json({ error: 'Dados inválidos', details: error.errors });
        return;
      }
      console.error('Erro ao criar cliente:', error);
      res.status(500).json({ error: 'Erro ao criar cliente' });
    }
  }

  async update(req: Request, res: Response): Promise<void> {
    try {
      const id = String(req.params.id);
      const validatedData = clientSchema.partial().parse(req.body);

      const client = await prisma.client.update({
        where: { id },
        data: {
          ...validatedData,
          birthDate: validatedData.birthDate ? new Date(validatedData.birthDate) : undefined,
        },
      });

      res.json(client);
    } catch (error: any) {
      if (error.name === 'ZodError') {
        res.status(400).json({ error: 'Dados inválidos', details: error.errors });
        return;
      }
      res.status(500).json({ error: 'Erro ao atualizar cliente' });
    }
  }

  async destroy(req: Request, res: Response): Promise<void> {
    try {
      const id = String(req.params.id);

      await prisma.client.update({
        where: { id },
        data: { active: false },
      });

      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: 'Erro ao desativar cliente' });
    }
  }
}
