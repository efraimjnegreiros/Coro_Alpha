// models/Usuario.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Usuario = sequelize.define('Usuario', {
  nome: { type: DataTypes.STRING, allowNull: false },
  tipo: { 
    type: DataTypes.ENUM(
      'membro', 
      'tesouraria', 
      'lider', 
      'coordenador', 
      'lider de eventos', 
      'secretaria'
    ), 
    allowNull: false 
  },
  email: { type: DataTypes.STRING, allowNull: true, unique: true },
  senha: { type: DataTypes.STRING, allowNull: true },
  dataNascimento: { type: DataTypes.DATEONLY, allowNull: false },
  naipe: { 
    type: DataTypes.ENUM(
      'homem', 
      'mulher', 
      'baixo', 
      'tenor', 
      'contralto', 
      'soprano'
    ), 
    allowNull: false 
  },
}, {
  tableName: 'usuarios',
  timestamps: true
});

module.exports = Usuario;
