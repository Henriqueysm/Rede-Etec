// controllers/userController.js
const User = require('../models/userModel'); // Seu modelo do Sequelize

// Função para listar todos os usuários
exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.findAll(); // Encontrando todos os usuários
        res.json(users); // Retornando os usuários
    } catch (error) {
        res.status(500).json({ message: error.message }); // Tratando erros
    }
};

// Função para criar um novo usuário
exports.createUser = async (req, res) => {
    console.log('Dados recebidos:', req.body); // Log dos dados recebidos
    try {
        // Verifica se o email já existe no banco de dados
        const existingUser = await User.findOne({ where: { email } });
        console.log("Usuário encontrado:", existingUser);


        // Se já existir, retorna erro
        if (existingUser) {
            return res.status(400).json({ message: 'Erro: email já cadastrado' });
        }

        // Caso contrário, cria um novo usuário
        const user = await User.create(req.body);
        console.log('Usuário criado:', user); // Log do usuário criado
        res.status(201).json(user); // Retorna o usuário criado com sucesso
    } catch (error) {
        console.error('Erro ao criar usuário:', error); // Log do erro
        res.status(500).json({ message: error.message }); // Tratando erro interno
    }
};
