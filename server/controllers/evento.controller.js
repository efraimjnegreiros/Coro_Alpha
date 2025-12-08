// controllers/EventoController.js
const Evento = require('../models/evento.model');

module.exports = {

  // Criar evento
  async criar(req, res) {
    try {
      const evento = await Evento.create(req.body);
      return res.status(201).json({ message: 'Evento criado com sucesso!', evento });
    } catch (error) {
      return res.status(400).json({ message: 'Erro ao criar evento', error: error.message });
    }
  },

  // Listar eventos
  async listar(req, res) {
  try {
    const eventos = await Evento.findAll({
      order: [['horaEvento', 'ASC']]
    });

    return res.status(200).json(eventos);
  } catch (error) {
    return res.status(400).json({
      message: 'Erro ao listar eventos',
      error: error.message
    });
  }
},


  // Visualizar evento por ID
  async visualizar(req, res) {
    try {
      const evento = await Evento.findByPk(req.params.id);
      if (!evento) return res.status(404).json({ message: 'Evento não encontrado' });
      return res.status(200).json(evento);
    } catch (error) {
      return res.status(400).json({ message: 'Erro ao buscar evento', error: error.message });
    }
  },

  // Atualizar evento
  async atualizar(req, res) {
    try {
      const evento = await Evento.findByPk(req.params.id);
      if (!evento) return res.status(404).json({ message: 'Evento não encontrado' });

      await evento.update(req.body);
      return res.status(200).json({ message: 'Evento atualizado!', evento });
    } catch (error) {
      return res.status(400).json({ message: 'Erro ao atualizar evento', error: error.message });
    }
  },

  // Deletar evento
  async deletar(req, res) {
    try {
      const evento = await Evento.findByPk(req.params.id);
      if (!evento) return res.status(404).json({ message: 'Evento não encontrado' });

      await evento.destroy();
      return res.status(200).json({ message: 'Evento deletado!' });
    } catch (error) {
      return res.status(400).json({ message: 'Erro ao deletar evento', error: error.message });
    }
  }
};
