// routes/ensaios.js
const express = require('express');
const router = express.Router();
const EnsaioController = require('../controllers/ensaio.controller');

// CRUD + filtros
router.post('/', EnsaioController.criar);
router.get('/', EnsaioController.listar); // pode receber query params: data, grupo, local
router.get('/:id', EnsaioController.visualizar);
router.put('/:id', EnsaioController.atualizar);
router.delete('/:id', EnsaioController.deletar);

module.exports = router;
