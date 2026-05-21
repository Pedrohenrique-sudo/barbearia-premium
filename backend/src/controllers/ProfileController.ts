import { Request, Response } from 'express';
import { prisma } from '../lib/prisma';
import { hashPassword, comparePassword } from '../utils/password';
import { z } from 'zod';

const updateProfileSchema = z.object({
  name: z.string().min(3).max(100).optional(),
  email: z.string().email().optional(),
  phone: z.string().min(10).max(20).optional(),
  address: z.string().max(200).optional(),
});

const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, 'Senha atual é obrigatória'),
  newPassword: z.string().min(8, 'Nova senha deve ter pelo menos 8 caracteres'),
});

export class ProfileController {
  async update(req: Request & { user?: any }, res: Response): Promise<void> {
    try {
      const validatedData = updateProfileSchema.parse(req.body);
      const userId = req.user.userId;

      const user = await prisma.user.update({
        where: { id: userId },
        data: validatedData,
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          avatar: true,
          active: true,
        },
      });

      res.json({ message: 'Perfil atualizado com sucesso', user });
    } catch (error: any) {
      if (error.name === 'ZodError') {
        res.status(400).json({ error: 'Dados inválidos', details: error.errors });
        return;
      }
      res.status(500).json({ error: 'Erro ao atualizar perfil' });
    }
  }

  async changePassword(req: Request & { user?: any }, res: Response): Promise<void> {
    try {
      const validatedData = changePasswordSchema.parse(req.body);
      const userId = req.user.userId;

      const user = await prisma.user.findUnique({
        where: { id: userId },
      });

      if (!user) {
        res.status(404).json({ error: 'Usuário não encontrado' });
        return;
      }

      const isCurrentPasswordValid = await comparePassword(
        validatedData.currentPassword,
        user.password
      );

      if (!isCurrentPasswordValid) {
        res.status(400).json({ error: 'Senha atual incorreta' });
        return;
      }

      const hashedNewPassword = await hashPassword(validatedData.newPassword);

      await prisma.user.update({
        where: { id: userId },
        data: { password: hashedNewPassword },
      });

      res.json({ message: 'Senha alterada com sucesso' });
    } catch (error: any) {
      if (error.name === 'ZodError') {
        res.status(400).json({ error: 'Dados inválidos', details: error.errors });
        return;
      }
      res.status(500).json({ error: 'Erro ao alterar senha' });
    }
  }
}
