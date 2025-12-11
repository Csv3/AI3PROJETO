import User from "../models/user.js";
import bcrypt from "bcryptjs";
import { signToken } from "../utils/jwt.js";
import { sanitizeInput } from "../utils/sanitize.js";

export const register = async (req, res) => {
  try {
    const body = sanitizeInput(req.body);
    const { nome, email, password } = body;
    if (!nome || !email || !password) return res.status(400).json({ error: "Missing fields" });
    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ error: "Email already in use" });
    const hash = await bcrypt.hash(password, 10);
    const user = await User.create({ nome, email, passwordHash: hash });
    return res.status(201).json({ id: user._id, nome: user.nome, email: user.email });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Server error" });
  }
};

export const login = async (req, res) => {
  try {
    const body = sanitizeInput(req.body);
    const { email, password } = body;
    if (!email || !password) return res.status(400).json({ error: "Missing fields" });
    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ error: "Invalid credentials" });
    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) return res.status(401).json({ error: "Invalid credentials" });
    const token = signToken({ id: user._id, email: user.email });
    return res.json({ token });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Server error" });
  }
};
