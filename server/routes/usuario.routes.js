// routes/usuarios.js
const express = require('express');
const router = express.Router();
const UsuarioController = require('../controllers/usuario.controller');

// CRUD Usuários
router.post('/', UsuarioController.criar);
router.get('/', UsuarioController.listar);
router.get('/:id', UsuarioController.visualizar);
router.put('/:id', UsuarioController.atualizar);
router.delete('/:id', UsuarioController.deletar);
router.get('/email/:email', UsuarioController.buscarPorEmail);

// Marcar presença
router.post('/presenca', UsuarioController.marcarPresenca);

module.exports = router;
