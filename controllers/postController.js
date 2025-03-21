// logica para gerenciar postagens
// // controllers/postController.js
const Post = require('../models/postModel');

exports.createPost = async (req, res) => {
    console.log('Dados recebidos para criação de postagem:', req.body); // Log dos dados recebidos
    try {
        const post = await Post.create(req.body);
        console.log('Postagem criada:', post); // Log da postagem criada
        res.status(201).json(post); // Retorna a postagem criada
    } catch (error) {
        console.error('Erro ao criar postagem:', error); // Log do erro
        res.status(500).json({ message: error.message });
    }
};

exports.getAllPosts = async (req, res) => {
    try {
        const posts = await Post.findAll();
        res.json(posts);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};