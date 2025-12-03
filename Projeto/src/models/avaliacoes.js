import mongoose from "mongoose";

const AvaliacaoSchema = new mongoose.Schema(
  {
    titulo: { type: String, required: true },
    descricao: { type: String, required: true },
    data: { type: Date, required: true },
    recursoId: { type: mongoose.Schema.Types.ObjectId, ref: "Recurso", required: true },
    criadoPor: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }
  },
  { timestamps: true }
);

export default mongoose.model("Avaliacao", AvaliacaoSchema);
