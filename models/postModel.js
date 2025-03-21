const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');  // Importando a instância do Sequelize
const User = require('./userModel');  // Importando o modelo de Usuário

const Post = sequelize.define('Post', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: User,  // Relaciona com a tabela User
            key: 'id'
        }
    },
    title: {
        type: DataTypes.STRING,
        allowNull: false
    },
    content: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    createdAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    },
    updatedAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    }
}, {
    tableName: 'Posts',  // Nome da tabela no banco de dados
    timestamps: false    // Desativa os timestamps automáticos
});

module.exports = Post;
