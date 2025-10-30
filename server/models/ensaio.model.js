// models/Ensaio.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database'); // sua conexão com o DB

const Ensaio = sequelize.define('Ensaio', {
  descricao: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  data: {
    type: DataTypes.DATEONLY, // apenas data
    allowNull: false,
  },
  hora: {
    type: DataTypes.TIME, // apenas hora
    allowNull: false,
  },
  local: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  grupo: {
    type: DataTypes.ENUM('todos', 'homens', 'mulheres'),
    defaultValue: 'todos',
  },
}, {
  tableName: 'ensaios',
  timestamps: true,
});

module.exports = Ensaio;
