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
  musicas: {
    type: DataTypes.TEXT, // pode armazenar várias músicas (ex: separadas por vírgula ou JSON)
    allowNull: true,
    get() {
      const value = this.getDataValue('musicas');
      try {
        return value ? JSON.parse(value) : [];
      } catch {
        return value ? value.split(',').map(m => m.trim()) : [];
      }
    },
    set(value) {
      if (Array.isArray(value)) {
        this.setDataValue('musicas', JSON.stringify(value));
      } else {
        this.setDataValue('musicas', value);
      }
    },
  },
}, {
  tableName: 'ensaios',
  timestamps: true,
});

module.exports = Ensaio;
