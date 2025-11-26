// models/Presenca.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Usuario = require('./usuario.model');
const Ensaio = require('./ensaio.model');

const Presenca = sequelize.define('Presenca', {
  status: { 
    type: DataTypes.ENUM('presenca', 'ausencia', 'falta_justificada'), 
    defaultValue: 'ausencia' 
  },
  justificativa: {
    type: DataTypes.TEXT,
    allowNull: true
  }
}, {
  tableName: 'presencas',
  timestamps: true,
  indexes: [
    {
      unique: true,
      fields: ['usuarioId', 'ensaioId']
    }
  ]
});

// Relacionamentos (mantendo Many-to-Many via Presenca)
Usuario.belongsToMany(Ensaio, { through: Presenca, foreignKey: 'usuarioId' });
Ensaio.belongsToMany(Usuario, { through: Presenca, foreignKey: 'ensaioId' });

// Para facilitar includes diretos
Presenca.belongsTo(Usuario, { foreignKey: 'usuarioId' });
Presenca.belongsTo(Ensaio, { foreignKey: 'ensaioId' });

module.exports = Presenca;
