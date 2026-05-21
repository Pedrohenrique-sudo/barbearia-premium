import { z } from 'zod';

export const userSchema = z.object({
  name: z.string().min(3).max(100),
  email: z.string().email(),
  password: z.string().min(8).max(100),
  role: z.enum(['ADMIN', 'BARBER', 'MANAGER']).optional(),
  avatar: z.string().url().optional(),
});

export const clientSchema = z.object({
  name: z.string().min(3).max(100, 'Nome muito longo'),
  email: z.string().email('Email inválido').optional().nullable().or(z.literal('')),
  phone: z.string().min(8, 'Telefone deve ter pelo menos 8 dígitos').max(20, 'Telefone muito longo'),
  birthDate: z.string().datetime().optional().nullable(),
  notes: z.string().max(1000).optional().nullable(),
  avatar: z.string().url().optional().nullable(),
});

export const serviceSchema = z.object({
  name: z.string().min(3).max(100),
  description: z.string().max(500).optional().nullable(),
  price: z.number().positive('Preço deve ser positivo'),
  duration: z.number().int().positive().default(30),
});

export const appointmentSchema = z.object({
  date: z.string().datetime(),
  status: z.enum(['SCHEDULED', 'CONFIRMED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED', 'NO_SHOW']).optional(),
  notes: z.string().max(1000).optional().nullable(),
  price: z.number().positive(),
  userId: z.string().uuid('Barbeiro inválido'),
  clientId: z.string().uuid('Cliente inválido'),
  serviceId: z.string().uuid('Serviço inválido'),
});

export const loginSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(1, 'Senha é obrigatória'),
});

export const updateProfileSchema = z.object({
  name: z.string().min(3).max(100).optional(),
  email: z.string().email().optional(),
  phone: z.string().min(8).max(20).optional(),
  address: z.string().max(200).optional(),
});

export const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, 'Senha atual é obrigatória'),
  newPassword: z.string().min(8, 'Nova senha deve ter pelo menos 8 caracteres'),
});
