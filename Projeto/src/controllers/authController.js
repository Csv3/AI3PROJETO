import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/user.js";

export const register = async (req, res) => {
  try {
    const { nome, email, email_institucional, password } = req.body;

    // Verificar se todos os campos foram preenchidos
    if (!nome || !email || !email_institucional || !password) {
      return res.status(400).json({ error: "Dados incompletos" });
    }

    // Verificar se o email tem o formato correto
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: "Email inválido" });
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
      nome,
      email,
      email_institucional,
      password: hashedPwd
    });

    res.status(201).json({ message: "Utilizador criado", userId: newUser._id });

  } catch (err) {
    console.error("Erro no registo:", err);
    res.status(500).json({ error: "Erro interno do servidor" });
  }
};
// POST /auth/login
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Verificar campos
    if (!email || !password) {
      return res.status(400).json({ error: "Email e password são obrigatórios" });
    }

    // Procurar utilizador
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ error: "Credenciais inválidas" });
    }

    // Comparar password
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(401).json({ error: "Credenciais inválidas" });
    }

    // Criar token JWT (expira em 20 minutos)
    const token = jwt.sign(
      { id: user._id, email: user.email },  // dado que vai no token
      process.env.JWT_SECRET,              // segredo do .env
      { expiresIn: "20m" }                 // Token expira em 20 minutos
    );

    res.json({ token });

  } catch (err) {
    console.error("Erro no login:", err);
    res.status(500).json({ error: "Erro interno do servidor" });
  }
};