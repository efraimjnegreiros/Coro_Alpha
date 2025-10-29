// routes/presencas.js
const express = require('express');
const router = express.Router();
const PresencaController = require('../controllers/presenca.controller');

// CRUD Presenças
router.post('/', PresencaController.criar);
router.get('/', PresencaController.listar);
router.get('/:id', PresencaController.visualizar);
router.put('/:id', PresencaController.atualizar);
router.delete('/:id', PresencaController.deletar);

// Filtros dedicados
router.get('/ensaio/:ensaioId', PresencaController.listarPorEnsaio);
router.get('/usuario/:usuarioId', PresencaController.listarPorUsuario);
router.get('/ensaio/:ensaioId/usuario/:usuarioId', PresencaController.listarPorEnsaioEUsuario);

module.exports = router;
