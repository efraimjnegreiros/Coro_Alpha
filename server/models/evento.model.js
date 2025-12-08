// models/Evento.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Evento = sequelize.define('Evento', {
  nomeEvento: { 
    type: DataTypes.STRING, 
    allowNull: false 
  },

  descricao: { 
    type: DataTypes.TEXT, 
    allowNull: true 
  },

  local: { 
    type: DataTypes.STRING, 
    allowNull: false 
  },

  // Apenas data
  dataEvento: { 
    type: DataTypes.DATEONLY, 
    allowNull: false 
  },

  // Apenas hora
  horaEvento: { 
    type: DataTypes.TIME, 
    allowNull: false 
  },

  // Apenas hora
  horaSaidaIgreja: { 
    type: DataTypes.TIME, 
    allowNull: false 
  }

}, {
  tableName: 'eventos',
  timestamps: true
});

module.exports = Evento;
