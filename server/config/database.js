// config/database.js
const { Sequelize } = require('sequelize');

// URL de conexão PostgreSQL (formato URI)
const DATABASE_URL = 'postgresql://postgres:tgZcopvqTbZsqNqqUpiHSfRQENobOBlp@metro.proxy.rlwy.net:15549/railway';

// Cria instância Sequelize usando a URL
const sequelize = new Sequelize(DATABASE_URL, {
  dialect: 'postgres',
  logging: false, // desativa logs SQL
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false, // necessário se o banco exigir SSL
    },
  },
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
});

module.exports = sequelize;
