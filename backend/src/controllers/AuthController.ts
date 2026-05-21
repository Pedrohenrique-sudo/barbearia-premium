import { Request, Response } from 'express';
import { prisma } from '../lib/prisma';
import { hashPassword, comparePassword } from '../utils/password';
import { generateAccessToken, generateRefreshToken } from '../utils/jwt';
import { loginSchema, userSchema } from '../validators/schemas';

export class AuthController {
  async register(req: Request, res: Response): Promise<void> {
    try {
      const validatedData = userSchema.parse(req.body);

      const existingUser = await prisma.user.findUnique({
        where: { email: validatedData.email },
      });

      if (existingUser) {
        res.status(409).json({ error: 'Email já cadastrado' });
        return;
      }

      const hashedPassword = await hashPassword(validatedData.password);

      const user = await prisma.user.create({
        data: {
          ...validatedData,
          password: hashedPassword,
        },
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          avatar: true,
          active: true,
          createdAt: true,
        },
      });

      const tokenPayload = {
        userId: user.id,
        email: user.email,
        role: user.role,
      };

      const accessToken = generateAccessToken(tokenPayload);
      const refreshToken = generateRefreshToken(tokenPayload);

      res.status(201).json({
        user,
        accessToken,
        refreshToken,
      });
    } catch (error: any) {
      if (error.name === 'ZodError') {
        res.status(400).json({ error: 'Dados inválidos', details: error.errors });
        return;
      }
      res.status(500).json({ error: 'Erro interno do servidor' });
    }
  }

  async login(req: Request, res: Response): Promise<void> {
    try {
      const validatedData = loginSchema.parse(req.body);

      const user = await prisma.user.findUnique({
        where: { email: validatedData.email },
      });

      if (!user) {
        res.status(401).json({ error: 'Email ou senha inválidos' });
        return;
      }

      if (!user.active) {
        res.status(403).json({ error: 'Conta desativada' });
        return;
      }

      const isPasswordValid = await comparePassword(validatedData.password, user.password);

      if (!isPasswordValid) {
        res.status(401).json({ error: 'Email ou senha inválidos' });
        return;
      }

      const tokenPayload = {
        userId: user.id,
        email: user.email,
        role: user.role,
      };

      const accessToken = generateAccessToken(tokenPayload);
      const refreshToken = generateRefreshToken(tokenPayload);

      res.json({
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          avatar: user.avatar,
          active: user.active,
        },
        accessToken,
        refreshToken,
      });
    } catch (error: any) {
      if (error.name === 'ZodError') {
        res.status(400).json({ error: 'Dados inválidos', details: error.errors });
        return;
      }
      res.status(500).json({ error: 'Erro interno do servidor' });
    }
  }

  async me(req: Request & { user?: any }, res: Response): Promise<void> {
    try {
      const user = await prisma.user.findUnique({
        where: { id: req.user.userId },
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          avatar: true,
          active: true,
          createdAt: true,
          updatedAt: true,
        },
      });

      if (!user) {
        res.status(404).json({ error: 'Usuário não encontrado' });
        return;
      }

      res.json(user);
    } catch (error) {
      res.status(500).json({ error: 'Erro interno do servidor' });
    }
  }
}
