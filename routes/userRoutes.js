// routes/userRoutes.js
const express = require('express');
const { createUser, getAllUsers } = require('../controllers/userController'); // Importando as funções do controlador
const router = express.Router();

// Rota para listar todos os usuários
router.get('/users', getAllUsers);

// Rota para criar um novo usuário
router.post('/users', createUser);

module.exports = router;
