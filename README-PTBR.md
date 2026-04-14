BookProject

Este projeto consiste em uma aplicação web para gerenciamento de livros, com frontend em Angular e backend utilizando json-server.

Pré-requisitos

Node.js (versão 12 ou superior)
npm (gerenciador de pacotes do Node.js)
Instalação do Node.js

Windows
Acesse o site oficial: https://nodejs.org/
Baixe a versão LTS (recomendada)
Execute o instalador e siga as instruções
Para verificar a instalação, abra o Prompt de Comando e execute:
node --version
npm --version

Linux
Ubuntu/Debian
sudo apt update
sudo apt install nodejs npm

Fedora
sudo dnf install nodejs npm

Arch Linux
sudo pacman -S nodejs npm

Para verificar a instalação:

node --version
npm --version


Configuração do Projeto

1. Clonar o repositório
gh repo clone kauanbruno/bookProject
git clone https://github.com/kauanbruno/bookProject.git
cd bookProject

2. Instalar dependências do backend
cd backend
npm install

3. Instalar dependências do frontend
cd ../frontend
npm install

Executando o projeto

Backend
Entre na pasta do backend:
cd backend
Inicie o servidor:
npm start

O backend estará disponível em: http://localhost:3000

Frontend
Entre na pasta do frontend:
cd frontend
Inicie o servidor de desenvolvimento:
npm start
Abra o navegador e acesse: http://localhost:4200

Scripts disponíveis

Backend
npm start — inicia o servidor json-server

Frontend
npm start — inicia o servidor de desenvolvimento (ng serve)
npm run build — compila o projeto para produção
npm test — executa os testes unitários
npm run lint — executa a verificação de código

Estrutura do projeto

bookProject/
├── backend/          # Servidor Node.js com json-server
│   ├── db.json       # Dados da API
│   ├── server.js     # Configuração do servidor
│   └── package.json  # Dependências do backend
│
└── frontend/         # Aplicação Angular
    ├── src/          # Código-fonte
    └── package.json  # Dependências do frontend
    
Observações
O frontend consome a API do backend na porta 3000
Certifique-se de iniciar o backend antes do frontend
O arquivo db.json contém os dados iniciais da aplicação