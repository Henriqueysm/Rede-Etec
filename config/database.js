const { Sequelize } = require('sequelize'); //C:\Windows\SysWOW64\SQLServerManager16.msc

const sequelize = new Sequelize('Redetec', 'api-yuri', '1234', {
  host: '127.0.0.1', // Tente usar 127.0.0.1 ao invés de localhost
  dialect: 'mssql',
  port: 1433,
  dialectOptions: {
    encrypt: true,
    trustServerCertificate: true
  },
  logging: false
});


sequelize.authenticate()
  .then(() => {
    console.log('Conexão com o banco de dados foi bem-sucedida!');
  })
  .catch((err) => {
    console.error('Erro ao conectar no banco de dados:', err);
  });

module.exports = sequelize;  // 🔹 Certifique-se de que está exportando o sequelize
