import mongoose from "mongoose";

const ResourceSchema = new mongoose.Schema({
  nome_utilizador: { type: String, required: true },
  nome_recurso: { type: String, required: true },
  tipo_recurso: { type: String, required: true },
  criado_em: { type: Date, default: Date.now }
});

export default mongoose.model("Resource", ResourceSchema);
