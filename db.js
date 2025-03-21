// db.js
const sql = require('mssql');

const config = {
  user: 'seu_usuario', // Coloque seu usuário do SQL Server
  password: 'sua_senha', // Coloque sua senha
  server: 'localhost', // O endereço do servidor do SQL Server
  database: 'seu_banco', // Nome do banco de dados
  options: {
    encrypt: true, // Usado para SQL Server na Azure
    trustServerCertificate: true // Se estiver rodando localmente
  }
};

module.exports = config;
