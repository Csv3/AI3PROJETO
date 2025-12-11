// src/controllers/authController.js (CORRIGIDO PARA O MODELO ATUAL)
import User from "../models/users.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// POST /auth/register
export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    
    // Campos ausentes no frontend, mas necessários no modelo:
    const numero_canografico = "";
    const curso = "";
    
    // Verificar se os campos obrigatórios básicos vieram
    if (!name || !email || !password) { 
      return res.status(400).json({ error: "Dados incompletos: nome, email e password são obrigatórios." });
    }

    // Verificar se o utilizador já existe
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ error: "Email já está registado" });
    }

    // Encriptar password
    const hashedPwd = await bcrypt.hash(password, 10);

    // Criar utilizador
    const newUser = await User.create({
      nome: name, // Mapeia 'name' do frontend para 'nome' do modelo
      email,
      password: hashedPwd,
      // 💡 ADICIONADO: Envia strings vazias para evitar erros no Mongoose
      numero_canografico, 
      curso 
    });

    res.status(201).json({ message: "Utilizador criado", userId: newUser._id });

  } catch (err) {
    console.error("Erro no registo (Mongoose/Modelo):", err);
    res.status(500).json({ error: "Erro interno do servidor durante a criação do utilizador." });
  }
};

// src/controllers/authController.js (Implementação da Função de Login)

// ... imports e função register ...

// POST /auth/login
export const login = async (req, res) => {
  try {
    const { email, password } = req.body; // 1. Recebe credenciais

    // Validação básica
    if (!email || !password) {
      return res.status(400).json({ error: "Email e password são obrigatórios." });
    }

    // 2. Encontra o utilizador pelo email
    const user = await User.findOne({ email });

    if (!user) {
      // Usar uma mensagem genérica para não dar dicas a atacantes
      return res.status(401).json({ error: "Credenciais inválidas." }); 
    }

    // 3. Compara a password fornecida com a armazenada
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ error: "Credenciais inválidas." });
    }

    // 4. Se a password for válida, gera um JWT
    // Use uma chave secreta do seu .env (process.env.JWT_SECRET)
    const secret = process.env.JWT_SECRET || 'SUA_CHAVE_SECRETA_PADRAO'; 
    const token = jwt.sign(
      { userId: user._id, email: user.email }, // Payload do token
      secret,
      { expiresIn: '1d' } // Expira em 1 dia
    );

    // 5. Envia o token de volta ao cliente
    res.status(200).json({ 
      message: "Login bem-sucedido",
      token, // O frontend (Login.js) espera este campo!
      userId: user._id 
    });

  } catch (err) {
    console.error("Erro no login:", err);
    res.status(500).json({ error: "Erro interno do servidor." });
  }
};
