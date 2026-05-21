
# 🪐 Barbearia Premium

<div align="center">

![Preview](https://img.shields.io/badge/Status-Online-success?style=for-the-badge&logo=statuspage)
![Version](https://img.shields.io/badge/Version-1.0.0-blue?style=for-the-badge)
![License](https://img.shields.io/badge/License-MIT-purple?style=for-the-badge)

**Sistema Premium de Gestão para Barbearias**

[![Login](https://img.shields.io/badge/🔐-Tela_de_Login-8A2BE2?style=flat-square)]()
[![Dashboard](https://img.shields.io/badge/📊-Dashboard-FF69B4?style=flat-square)]()
[![Agenda](https://img.shields.io/badge/📅-Agenda-9B30FF?style=flat-square)]()
[![3D](https://img.shields.io/badge/🪐-Efeitos_3D-7B2FFF?style=flat-square)]()

</div>

---

## ✨ Destaques

<table>
<tr>
<td width="50%">

### 🎨 **Visual Premium**
- 🪐 Planeta Júpiter com anéis 3D
- ⭐ 600+ estrelas no background
- 💫 Chuva de meteoros
- 🌌 Nebulosa flutuante
- 🔮 Esferas de energia
- 💎 Glassmorphism

</td>
<td width="50%">

### 🔧 **Funcionalidades**
- 📊 Dashboard com gráficos
- 📅 Agenda inteligente
- 👥 Gestão de clientes
- 💈 Catálogo de serviços
- 📈 Relatórios financeiros
- ⚙️ Configurações

</td>
</tr>
</table>

---

## 🚀 Tecnologias

<div align="center">

| Frontend | Backend | Banco | 3D |
|----------|---------|-------|-----|
| ![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB) | ![Node.js](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white) | ![MySQL](https://img.shields.io/badge/MySQL-00000F?style=for-the-badge&logo=mysql&logoColor=white) | ![Three.js](https://img.shields.io/badge/Three.js-000000?style=for-the-badge&logo=three.js&logoColor=white) |
| ![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white) | ![Express](https://img.shields.io/badge/Express-000000?style=for-the-badge&logo=express&logoColor=white) | ![Prisma](https://img.shields.io/badge/Prisma-2D3748?style=for-the-badge&logo=prisma&logoColor=white) | ![Framer](https://img.shields.io/badge/Framer_Motion-0055FF?style=for-the-badge&logo=framer&logoColor=white) |
| ![Tailwind](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white) | ![JWT](https://img.shields.io/badge/JWT-000000?style=for-the-badge&logo=JSON%20web%20tokens&logoColor=white) | ![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white) | ![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white) |

</div>

---

## 📸 Screenshots

<details>
<summary><b>🔐 Tela de Login</b></summary>
<br>

> ☄️ Cometa ultra realista colidindo ao fazer login
> 🖱️ Luz que segue o mouse
> 💎 Glassmorphism com anéis girando

</details>

<details>
<summary><b>📊 Dashboard</b></summary>
<br>

> 📈 Gráfico de faturamento (Recharts)
> 💳 Cards animados com métricas
> ⭐ Ranking de barbeiros

</details>

<details>
<summary><b>📅 Agenda</b></summary>
<br>

> ✅ Criar, listar e deletar agendamentos
> ⚠️ Validação de conflito de horários
> 👥 Dropdown com nomes (não IDs)

</details>

<details>
<summary><b>👥 Clientes</b></summary>
<br>

> 📋 Lista com busca em tempo real
> ➕ Cadastro com validação
> 🗑️ Exclusão com confirmação

</details>

---

## 🎯 Instalação

### 📋 Pré-requisitos

![Node](https://img.shields.io/badge/Node.js-20+-green?style=flat-square&logo=node.js)
![MySQL](https://img.shields.io/badge/MySQL-8.0+-blue?style=flat-square&logo=mysql)
![npm](https://img.shields.io/badge/npm-10+-red?style=flat-square&logo=npm)

### 🪟 Windows

```bash
# 1. Clone o repositório
git clone https://github.com/Pedrohenrique-sudo/barbearia-premium.git
cd barbearia-premium

# 2. Inicie o MySQL (XAMPP)

# 3. Importe o banco de dados (phpMyAdmin)
# Arquivo: barbearia_premium.sql

# 4. Terminal 1 - Backend
cd backend
npm install
npm run dev




# 📱 ANDROID (Termux)

# 1. Instalar dependências
pkg update && pkg upgrade -y
pkg install nodejs git -y

# 2. Clonar o projeto
git clone https://github.com/Pedrohenrique-sudo/barbearia-premium.git
cd barbearia-premium

# 3. Rodar o Backend (Terminal 1)
cd backend
npm install
npm run dev

# 4. Rodar o Frontend (Terminal 2 - deslizar para nova sessão)
cd ~/barbearia-premium/frontend
npm install
npm run dev -- --host

# 5. Acessar no navegador do celular
# http://localhost:5173/login





# 🐧 LINUX MINT (Terminal)

# 1. Instalar Node.js 20 LTS
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs

# 2. Instalar XAMPP
wget https://www.apachefriends.org/xampp-files/8.2.12/xampp-linux-x64-8.2.12-0-installer.run
chmod +x xampp-linux-x64-8.2.12-0-installer.run
sudo ./xampp-linux-x64-8.2.12-0-installer.run

# 3. Iniciar XAMPP (MySQL)
sudo /opt/lampp/lampp start

# 4. Clonar o projeto
git clone https://github.com/Pedrohenrique-sudo/barbearia-premium.git
cd barbearia-premium

# 5. Importar o banco de dados
sudo /opt/lampp/bin/mysql -u root < barbearia_premium.sql

# 6. Instalar e iniciar Backend (Terminal 1)
cd backend
npm install
npm run dev

# 7. Instalar e iniciar Frontend (Terminal 2)
cd ../frontend
npm install
npm run dev

# 8. Acessar no navegador
# http://localhost:5173/login

# 🔑 Login: admin@barbeariapremium.com
# 🔒 Senha: admin123
