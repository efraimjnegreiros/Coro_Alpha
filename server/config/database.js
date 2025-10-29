// config/database.js
const { Sequelize } = require('sequelize');
const path = require('path');

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: path.join(__dirname, '../database.sqlite'), // arquivo do banco SQLite
  logging: false, // desativa logs SQL
});

module.exports = sequelize;
