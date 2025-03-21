// routes/postRoutes.js
const express = require('express');
const router = express.Router();
const postController = require('../controllers/postController');

// Exemplo de rota para obter todas as postagens
router.get('/posts', postController.getAllPosts);

// Exemplo de rota para criar uma nova postagem
router.post('/posts', postController.createPost);

module.exports = router;