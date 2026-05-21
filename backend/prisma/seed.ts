import { PrismaClient, Role } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Iniciando seed do banco de dados...');

  // Limpar dados existentes
  await prisma.appointment.deleteMany();
  await prisma.timeline.deleteMany();
  await prisma.client.deleteMany();
  await prisma.service.deleteMany();
  await prisma.user.deleteMany();

  // Criar usuários
  const adminPassword = await bcrypt.hash('admin123', 12);
  const barberPassword = await bcrypt.hash('barber123', 12);

  await prisma.user.create({
    data: {
      name: 'Administrador',
      email: 'admin@barbeariapremium.com',
      password: adminPassword,
      role: Role.ADMIN,
    },
  });

  await prisma.user.create({
    data: {
      name: 'Ricardo Silva',
      email: 'ricardo@barbeariapremium.com',
      password: barberPassword,
      role: Role.BARBER,
    },
  });

  await prisma.user.create({
    data: {
      name: 'Carlos Oliveira',
      email: 'carlos@barbeariapremium.com',
      password: barberPassword,
      role: Role.BARBER,
    },
  });

  console.log('✅ Usuários criados');

  // Criar serviços
  await prisma.service.createMany({
    data: [
      { name: 'Corte Clássico', description: 'Corte tradicional com tesoura e máquina', price: 45.00, duration: 30 },
      { name: 'Corte Premium', description: 'Corte personalizado com finalização premium', price: 65.00, duration: 45 },
      { name: 'Barba Completa', description: 'Aparar e modelar barba com toalha quente', price: 35.00, duration: 30 },
      { name: 'Corte + Barba', description: 'Combo corte e barba completa', price: 70.00, duration: 60 },
      { name: 'Hidratação Capilar', description: 'Tratamento de hidratação profunda', price: 55.00, duration: 40 },
    ],
  });

  console.log('✅ Serviços criados');

  // Buscar IDs
  const admin = await prisma.user.findFirst({ where: { email: 'admin@barbeariapremium.com' } });
  const barber1 = await prisma.user.findFirst({ where: { email: 'ricardo@barbeariapremium.com' } });
  const barber2 = await prisma.user.findFirst({ where: { email: 'carlos@barbeariapremium.com' } });
  const services = await prisma.service.findMany();

  // Criar clientes
  await prisma.client.createMany({
    data: [
      { name: 'João Mendes', email: 'joao@email.com', phone: '(11) 99999-0001', notes: 'Prefere corte com tesoura' },
      { name: 'Pedro Alves', email: 'pedro@email.com', phone: '(11) 99999-0002' },
      { name: 'Lucas Ferreira', phone: '(11) 99999-0003', notes: 'Cliente desde 2024' },
      { name: 'Gabriel Souza', email: 'gabriel@email.com', phone: '(11) 99999-0004' },
      { name: 'Rafael Costa', phone: '(11) 99999-0005', notes: 'Prefere horários pela manhã' },
    ],
  });

  console.log('✅ Clientes criados');

  const clients = await prisma.client.findMany();

  // Criar agendamentos
  if (admin && barber1 && barber2 && services.length >= 4 && clients.length >= 3) {
    await prisma.appointment.create({
      data: {
        date: new Date('2026-05-21T09:00:00'),
        status: 'SCHEDULED',
        price: services[0].price,
        userId: barber1.id,
        clientId: clients[0].id,
        serviceId: services[0].id,
      },
    });

    await prisma.appointment.create({
      data: {
        date: new Date('2026-05-21T10:00:00'),
        status: 'SCHEDULED',
        price: services[2].price,
        userId: barber2.id,
        clientId: clients[1].id,
        serviceId: services[2].id,
      },
    });

    await prisma.appointment.create({
      data: {
        date: new Date('2026-05-21T14:00:00'),
        status: 'SCHEDULED',
        price: services[3].price,
        userId: barber1.id,
        clientId: clients[2].id,
        serviceId: services[3].id,
      },
    });
  }

  console.log('✅ Agendamentos criados');
  console.log('\n📧 Credenciais de acesso:');
  console.log('   Admin: admin@barbeariapremium.com / admin123');
  console.log('   Barbeiro: ricardo@barbeariapremium.com / barber123');
  console.log('   Barbeiro: carlos@barbeariapremium.com / barber123');
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
