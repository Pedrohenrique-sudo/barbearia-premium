import { Request, Response } from 'express';
import { prisma } from '../lib/prisma';
import { serviceSchema } from '../validators/schemas';

export class ServiceController {
  async index(req: Request, res: Response): Promise<void> {
    try {
      const services = await prisma.service.findMany({
        where: { active: true },
        orderBy: { name: 'asc' },
      });

      res.json(services);
    } catch (error) {
      res.status(500).json({ error: 'Erro ao buscar serviços' });
    }
  }

  async store(req: Request, res: Response): Promise<void> {
    try {
      const validatedData = serviceSchema.parse(req.body);

      const service = await prisma.service.create({
        data: validatedData,
      });

      res.status(201).json(service);
    } catch (error: any) {
      if (error.name === 'ZodError') {
        res.status(400).json({ error: 'Dados inválidos', details: error.errors });
        return;
      }
      res.status(500).json({ error: 'Erro ao criar serviço' });
    }
  }

  async update(req: Request, res: Response): Promise<void> {
    try {
      const id = String(req.params.id);
      const validatedData = serviceSchema.partial().parse(req.body);

      const service = await prisma.service.update({
        where: { id },
        data: validatedData,
      });

      res.json(service);
    } catch (error: any) {
      if (error.name === 'ZodError') {
        res.status(400).json({ error: 'Dados inválidos', details: error.errors });
        return;
      }
      res.status(500).json({ error: 'Erro ao atualizar serviço' });
    }
  }

  async destroy(req: Request, res: Response): Promise<void> {
    try {
      const id = String(req.params.id);

      await prisma.service.update({
        where: { id },
        data: { active: false },
      });

      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: 'Erro ao desativar serviço' });
    }
  }
}
