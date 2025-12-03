import mongoose from "mongoose";

const ComentarioSchema = new mongoose.Schema(
  {
    texto: { type: String, required: true },
    recursoId: { type: mongoose.Schema.Types.ObjectId, ref: "Recurso", required: true },
    criadoPor: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }
  },
  { timestamps: true }
);

export default mongoose.model("Comentario", ComentarioSchema);
