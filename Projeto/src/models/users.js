import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    nome: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    email_institucional: { type: String, required: true },
    password: { type: String, required: true },
    numero_canografico: { type: String },
    curso: { type: String }
  },
  { timestamps: true }
);

export default mongoose.model("user", userSchema);
