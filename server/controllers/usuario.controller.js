// controllers/UsuarioController.js
const Usuario = require('../models/usuario.model');
const Ensaio = require('../models/ensaio.model');
const Presenca = require('../models/presenca.model');

module.exports = {
  // Criar usuário
  async criar(req, res) {
    try {
      const usuario = await Usuario.create(req.body);
      return res.status(201).json({ message: 'Usuário criado!', usuario });
    } catch (error) {
      return res.status(400).json({ message: 'Erro ao criar usuário', error: error.message });
    }
  },
  
  // Listar usuários
  async listar(req, res) {
    try {
      const usuarios = await Usuario.findAll({ order: [['nome', 'ASC']] });
      return res.status(200).json(usuarios);
    } catch (error) {
      return res.status(400).json({ message: 'Erro ao listar usuários', error: error.message });
    }
  },
  async buscarPorEmail(req, res) {
  try {
    const { email } = req.params;
    const usuario = await Usuario.findOne({ where: { email } });
    if (!usuario) return res.status(404).json({ message: 'Usuário não encontrado' });
    return res.status(200).json(usuario);
  } catch (error) {
    return res.status(400).json({ message: 'Erro ao buscar usuário por email', error: error.message });
  }
},


  // Visualizar usuário
  async visualizar(req, res) {
    try {
      const usuario = await Usuario.findByPk(req.params.id, {
        include: { model: Ensaio, through: { attributes: ['status'] } }
      });
      if (!usuario) return res.status(404).json({ message: 'Usuário não encontrado' });
      return res.status(200).json(usuario);
    } catch (error) {
      return res.status(400).json({ message: 'Erro ao buscar usuário', error: error.message });
    }
  },

  // Atualizar usuário
  async atualizar(req, res) {
    try {
      const usuario = await Usuario.findByPk(req.params.id);
      if (!usuario) return res.status(404).json({ message: 'Usuário não encontrado' });
      await usuario.update(req.body);
      return res.status(200).json({ message: 'Usuário atualizado!', usuario });
    } catch (error) {
      return res.status(400).json({ message: 'Erro ao atualizar usuário', error: error.message });
    }
  },

  // Deletar usuário
  async deletar(req, res) {
    try {
      const usuario = await Usuario.findByPk(req.params.id);
      if (!usuario) return res.status(404).json({ message: 'Usuário não encontrado' });
      await usuario.destroy();
      return res.status(200).json({ message: 'Usuário deletado!' });
    } catch (error) {
      return res.status(400).json({ message: 'Erro ao deletar usuário', error: error.message });
    }
  },

  // Marcar presença em ensaio
  async marcarPresenca(req, res) {
    try {
      const { usuarioId, ensaioId, status } = req.body;
      const usuario = await Usuario.findByPk(usuarioId);
      const ensaio = await Ensaio.findByPk(ensaioId);

      if (!usuario || !ensaio) return res.status(404).json({ message: 'Usuário ou ensaio não encontrado' });

      // Cria ou atualiza a presença
      const [presenca, created] = await Presenca.upsert({ usuarioId, ensaioId, status });
      return res.status(200).json({ message: 'Presença atualizada', presenca });
    } catch (error) {
      return res.status(400).json({ message: 'Erro ao marcar presença', error: error.message });
    }
  }
};
