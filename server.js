const express = require("express");
const cors = require("cors");
const path = require("path");
const multer = require("multer");
const bcrypt = require("bcrypt");
const userRoutes = require("./routes/userRoutes");
const postRoutes = require("./routes/postRoutes");
const sequelize = require('./config/database');
const User = require('./models/userModel');
const Post = require('./models/postModel');

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

// Sincronizando os modelos com o banco de dados
sequelize.sync()
    .then(() => {
        console.log('Modelos sincronizados com sucesso!');
    })
    .catch((error) => {
        console.error('Erro ao sincronizar os modelos:', error);
    });

// Servir arquivos estáticos da pasta "public"
app.use(express.static(path.join(__dirname, "public")));

// Configuração de rotas
app.use("/api", userRoutes);
app.use("/api", postRoutes);

// 📌 Rota para registrar um novo usuário com senha criptografada
app.post("/register", async (req, res) => {
    try {
        const { firstName, lastName, email, password, birthDate } = req.body;

        if (!firstName || !lastName || !email || !password || !birthDate) {
            return res.status(400).json({ message: "Preencha todos os campos!" });
        }

        // Verificar se o e-mail já existe no banco
        const userExists = await User.findOne({ where: { email } });
        if (userExists) {
            return res.status(400).json({ message: "E-mail já cadastrado" });
        }

        // 🔹 Converter `birthDate` para formato válido (YYYY-MM-DD)
        const formattedBirthDate = new Date(birthDate).toISOString().split('T')[0];

        // Criptografar a senha
        const hashedPassword = await bcrypt.hash(password, 10);

        // Criar novo usuário no banco de dados
        const newUser = await User.create({
            name: `${firstName} ${lastName}`,
            email,
            password: hashedPassword,
            birthDate: formattedBirthDate,  // 🔹 Agora salvamos corretamente
            photoUrl: null,
        });

        return res.status(201).json({ message: "Conta criada com sucesso!", user: newUser });
    } catch (error) {
        console.error("Erro ao registrar usuário:", error);
        return res.status(500).json({ message: "Erro ao registrar usuário", error: error.message });
    }
});

// 📌 Rota para fazer login (verifica senha criptografada)
app.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;

        // Busca o usuário no banco de dados
        const user = await User.findOne({ where: { email } });

        if (!user) {
            return res.status(401).json({ message: "Credenciais inválidas" });
        }

        // 🔹 Comparar a senha digitada com a senha criptografada
        const passwordMatch = await bcrypt.compare(password, user.password);

        if (!passwordMatch) {
            return res.status(401).json({ message: "Credenciais inválidas" });
        }

        // Simulação de token (em produção, utilize JWT)
        const token = "simulado-token-aqui";

        return res.status(200).json({ token });
    } catch (error) {
        res.status(500).json({ message: "Erro ao fazer login", error });
    }
});

// 📌 Configuração do multer para upload de fotos
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "public/images/"); // Diretório onde as fotos serão salvas
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname)); // Exemplo: 1633984847584.jpg
    },
});

const upload = multer({ storage: storage });

// 📌 Rota para atualizar o perfil do usuário (foto, nome, senha, etc)
app.put("/update-profile/photo", upload.single("newPhoto"), async (req, res) => {
    try {
        const email = req.body.email;  // O email pode vir do corpo da requisição, por exemplo
        const newPhoto = req.file ? req.file.filename : null;

        if (!email) {
            return res.status(400).json({ message: "E-mail não informado." });
        }

        // Busca o usuário no banco de dados
        const user = await User.findOne({ where: { email } });

        if (!user) {
            return res.status(404).json({ message: "Usuário não encontrado." });
        }

        // Atualiza a foto do perfil
        if (newPhoto) {
            user.photoUrl = newPhoto;
        }

        await user.save();

        res.status(200).json({ message: "Foto do perfil atualizada com sucesso!", photoUrl: `/images/${newPhoto}` });
    } catch (error) {
        res.status(500).json({ message: "Erro ao atualizar foto do perfil", error });
    }
});

// Rota para atualizar o perfil do usuário (nome, senha, foto, etc)
app.put('/update-profile', async (req, res) => {
    try {
      const { email, newName, newPassword } = req.body;
  
      // Adicione o console.log para verificar os dados recebidos
      console.log({
        email,
        newName,
        newPassword,
      });
  
      // Buscar o usuário pelo email
      const user = await User.findOne({ where: { email } });
  
      if (!user) {
        return res.status(404).json({ message: 'Usuário não encontrado.' });
      }
  
      // Atualizar o nome e sobrenome
      if (newName) {
        const [firstName, lastName] = newName.split(' ');  // Divida o nome completo em duas partes
        user.firstName = firstName;
        user.lastName = lastName || '';  // Garante que o sobrenome não seja undefined
      }
  
      // Atualizar a senha, se fornecida
      if (newPassword) {
        user.password = await bcrypt.hash(newPassword, 10);  // Criptografa a senha antes de salvar
      }
  
      await user.save();  // Salva as alterações no banco de dados
  
      // Responde com sucesso
      res.status(200).json({ message: 'Perfil atualizado com sucesso!', user });
  
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Erro ao atualizar perfil', error });
    }
  });

  

// 📌 Rota para retornar o perfil do usuário
app.get("/profile", async (req, res) => {
    try {
        const { email } = req.query;

        if (!email) {
            return res.status(400).json({ message: "E-mail não informado." });
        }

        const user = await User.findOne({ where: { email } });

        if (!user) {
            return res.status(404).json({ message: "Usuário não encontrado." });
        }

        let idade = "Idade não disponível";
        if (user.birthDate) {
            const nascimento = new Date(user.birthDate);
            const hoje = new Date();
            idade = hoje.getFullYear() - nascimento.getFullYear();
            if (hoje.getMonth() < nascimento.getMonth() || 
               (hoje.getMonth() === nascimento.getMonth() && hoje.getDate() < nascimento.getDate())) {
                idade--;
            }
        }

        res.status(200).json({
            name: user.name,
            email: user.email,
            age: idade,
            photoUrl: user.photoUrl ? `/images/${user.photoUrl}` : `/images/user.png`,  // 🔹 Caminho correto para a imagem padrão
        });

    } catch (error) {
        res.status(500).json({ message: "Erro ao buscar dados do perfil", error });
    }
});

// Inicia o servidor na porta 3000
app.listen(port, () => {
    console.log(`🚀 Backend rodando na porta ${port}`);
});
