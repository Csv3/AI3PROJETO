import mongoose from "mongoose";
const EvaluationSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  estrelas: { type: Number, min:1, max:5, required: true },
  comentario: String,
}, { timestamps: true });

const ResourceSchema = new mongoose.Schema({
  titulo: { type: String, required: true },
  descricao: { type: String, required: true },
  categoria: { type: String, required: true },
  arquivo: String,
  owner: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  avaliacoes: [EvaluationSchema],
  comentarios: [{ user: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, comentario: String, createdAt: Date }]
}, { timestamps: true });

export default mongoose.model("Resource", ResourceSchema);
