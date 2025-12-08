// controllers/presenca.controller.js
const Presenca = require('../models/presenca.model');
const Usuario = require('../models/usuario.model');
const Ensaio = require('../models/ensaio.model');
const { Op } = require('sequelize');

module.exports = {
  // Criar presença (cria ou atualiza se já existir combinação usuarioId+ensaioId)
  async criar(req, res) {
    try {
      const { usuarioId, ensaioId, status, justificativa } = req.body;

      if (!usuarioId || !ensaioId) {
        return res.status(400).json({ message: 'usuarioId e ensaioId são obrigatórios' });
      }

      // verifica existência de usuario e ensaio (opcional, mas recomendado)
      const usuario = await Usuario.findByPk(usuarioId);
      const ensaio = await Ensaio.findByPk(ensaioId);
      if (!usuario || !ensaio) {
        return res.status(404).json({ message: 'Usuário ou Ensaio não encontrado' });
      }

      // procura por presença existente
      let presenca = await Presenca.findOne({ where: { usuarioId, ensaioId } });

      if (presenca) {
        // atualiza
        await presenca.update({ status, justificativa });
        return res.status(200).json({ message: 'Presença atualizada', presenca });
      } else {
        presenca = await Presenca.create({ usuarioId, ensaioId, status, justificativa });
        return res.status(201).json({ message: 'Presença criada', presenca });
      }
    } catch (error) {
      return res.status(400).json({ message: 'Erro ao criar/atualizar presença', error: error.message });
    }
  },

  // Listar presenças com filtros opcionais via query (ensaioId, usuarioId)
  async listar(req, res) {
    try {
      const { ensaioId, usuarioId } = req.query;
      const where = {};
      if (ensaioId) where.ensaioId = ensaioId;
      if (usuarioId) where.usuarioId = usuarioId;

      const presencas = await Presenca.findAll({
        where,
        include: [
          { model: Usuario, attributes: ['id', 'nome', 'email'] },
          { model: Ensaio, attributes: ['id', 'descricao', 'data', 'hora'] }
        ],
        order: [['createdAt', 'DESC']]
      });

      return res.status(200).json(presencas);
    } catch (error) {
      return res.status(400).json({ message: 'Erro ao listar presenças', error: error.message });
    }
  },

  // Visualizar presença por id
  async visualizar(req, res) {
    try {
      const presenca = await Presenca.findByPk(req.params.id, {
        include: [
          { model: Usuario, attributes: ['id', 'nome', 'email'] },
          { model: Ensaio, attributes: ['id', 'descricao', 'data', 'hora'] }
        ]
      });
      if (!presenca) return res.status(404).json({ message: 'Presença não encontrada' });
      return res.status(200).json(presenca);
    } catch (error) {
      return res.status(400).json({ message: 'Erro ao buscar presença', error: error.message });
    }
  },

  // Atualizar presença por id
  async atualizar(req, res) {
    try {
      const presenca = await Presenca.findByPk(req.params.id);
      if (!presenca) return res.status(404).json({ message: 'Presença não encontrada' });

      const { status, justificativa } = req.body;
      await presenca.update({ status, justificativa });
      return res.status(200).json({ message: 'Presença atualizada', presenca });
    } catch (error) {
      return res.status(400).json({ message: 'Erro ao atualizar presença', error: error.message });
    }
  },

  // Deletar presença por id
  async deletar(req, res) {
    try {
      const presenca = await Presenca.findByPk(req.params.id);
      if (!presenca) return res.status(404).json({ message: 'Presença não encontrada' });
      await presenca.destroy();
      return res.status(200).json({ message: 'Presença deletada' });
    } catch (error) {
      return res.status(400).json({ message: 'Erro ao deletar presença', error: error.message });
    }
  },

  // Filtro por ensaio
  async listarPorEnsaio(req, res) {
    try {
      const { ensaioId } = req.params;
      const presencas = await Presenca.findAll({
        where: { ensaioId },
        include: [{ model: Usuario, attributes: ['id', 'nome'] }]
      });
      return res.status(200).json(presencas);
    } catch (error) {
      return res.status(400).json({ message: 'Erro ao listar presenças por ensaio', error: error.message });
    }
  },

  // Filtro por usuario
  async listarPorUsuario(req, res) {
    try {
      const { usuarioId } = req.params;
      const presencas = await Presenca.findAll({
        where: { usuarioId },
        include: [{ model: Ensaio, attributes: ['id', 'descricao', 'data'] }]
      });
      return res.status(200).json(presencas);
    } catch (error) {
      return res.status(400).json({ message: 'Erro ao listar presenças por usuário', error: error.message });
    }
  },

  // Filtro por ensaio e usuario combinado
  async listarPorEnsaioEUsuario(req, res) {
    try {
      const { ensaioId, usuarioId } = req.params;
      const presencas = await Presenca.findAll({
        where: { ensaioId, usuarioId },
        include: [
          { model: Usuario, attributes: ['id', 'nome'] },
          { model: Ensaio, attributes: ['id', 'descricao', 'data'] }
        ]
      });
      return res.status(200).json(presencas);
    } catch (error) {
      return res.status(400).json({ message: 'Erro ao listar presenças por ensaio e usuário', error: error.message });
    }
  }
};
