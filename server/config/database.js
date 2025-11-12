// // config/database.js
// const { Sequelize } = require('sequelize');

// // URL de conexão PostgreSQL (formato URI)
// const DATABASE_URL = 'postgresql://postgres:tgZcopvqTbZsqNqqUpiHSfRQENobOBlp@metro.proxy.rlwy.net:15549/railway';

// // Cria instância Sequelize usando a URL
// const sequelize = new Sequelize(DATABASE_URL, {
//   dialect: 'postgres',
//   logging: false, // desativa logs SQL
//   dialectOptions: {
//     ssl: {
//       require: true,
//       rejectUnauthorized: false, // necessário se o banco exigir SSL
//     },
//   },
//   pool: {
//     max: 5,
//     min: 0,
//     acquire: 30000,
//     idle: 10000,
//   },
// });

// module.exports = sequelize;
// require('dotenv').config();
const { Sequelize } = require('sequelize');

const sequelize = new Sequelize(
  'postgres',     // 'postgres'
  'postgres.kweqycmdexvgbgkxkpim',     // 'postgres.kweqycmdexvgbgkxkpim'
  'OnMarketIFPECJBG', // 'OnMarketIFPECJBG'
  {
    host: 'aws-0-sa-east-1.pooler.supabase.com',      // 'aws-0-sa-east-1.pooler.supabase.com'
    port: 6543,      // 6543
    dialect: 'postgres',
    logging: false,
    dialectOptions: {
      // Caso queira passar modo de pool para transação (modo_pool)
      // depende da versão do Sequelize e suporte do driver
      // Aqui é um exemplo, pode ser necessário ajustar conforme a documentação
      // por padrão, a pool é configurada abaixo
    },
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000,
      // modo pool "transaction" não é parâmetro direto do Sequelize,
      // mas do driver pg. 
      // Você pode usar o parâmetro 'mode' em dialectOptions se suportado:
      mode: process.env.DB_POOL_MODE || 'transaction',
    },
  }
);

module.exports = sequelize;
