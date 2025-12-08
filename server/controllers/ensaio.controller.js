// controllers/EnsaioController.js
const Ensaio = require('../models/ensaio.model');

module.exports = {
  // Criar ensaio
  async criar(req, res) {
    try {
      const ensaio = await Ensaio.create(req.body);
      return res.status(201).json({ message: 'Ensaio criado com sucesso!', ensaio });
    } catch (error) {
      return res.status(400).json({ message: 'Erro ao criar ensaio', error: error.message });
    }
  },

  // Listar todos ensaios (com filtros)
  async listar(req, res) {
    try {
      const { data, grupo, local } = req.query;
      const where = {};
      if (data) where.data = data;
      if (grupo) where.grupo = grupo;
      if (local) where.local = local;

      const ensaios = await Ensaio.findAll({ where, order: [['data', 'ASC'], ['hora', 'ASC']] });
      return res.status(200).json(ensaios);
    } catch (error) {
      return res.status(400).json({ message: 'Erro ao listar ensaios', error: error.message });
    }
  },

  // Visualizar um ensaio específico
  async visualizar(req, res) {
    try {
      const ensaio = await Ensaio.findByPk(req.params.id);
      if (!ensaio) return res.status(404).json({ message: 'Ensaio não encontrado' });
      return res.status(200).json(ensaio);
    } catch (error) {
      return res.status(400).json({ message: 'Erro ao buscar ensaio', error: error.message });
    }
  },

  // Atualizar ensaio
  async atualizar(req, res) {
    try {
      const ensaio = await Ensaio.findByPk(req.params.id);
      if (!ensaio) return res.status(404).json({ message: 'Ensaio não encontrado' });

      await ensaio.update(req.body);
      return res.status(200).json({ message: 'Ensaio atualizado com sucesso!', ensaio });
    } catch (error) {
      return res.status(400).json({ message: 'Erro ao atualizar ensaio', error: error.message });
    }
  },

  // Deletar ensaio
  async deletar(req, res) {
    try {
      const ensaio = await Ensaio.findByPk(req.params.id);
      if (!ensaio) return res.status(404).json({ message: 'Ensaio não encontrado' });

      await ensaio.destroy();
      return res.status(200).json({ message: 'Ensaio deletado com sucesso!' });
    } catch (error) {
      return res.status(400).json({ message: 'Erro ao deletar ensaio', error: error.message });
    }
  },
};
