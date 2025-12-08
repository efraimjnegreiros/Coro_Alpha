// routes/eventos.js
const express = require('express');
const router = express.Router();
const EventoController = require('../controllers/evento.controller');

// CRUD de Eventos
router.post('/', EventoController.criar);        // Criar evento
router.get('/', EventoController.listar);        // Listar eventos
router.get('/:id', EventoController.visualizar); // Buscar evento por ID
router.put('/:id', EventoController.atualizar);  // Atualizar evento
router.delete('/:id', EventoController.deletar); // Deletar evento

module.exports = router;
