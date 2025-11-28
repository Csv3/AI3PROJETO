import mongoose from "mongoose";
//fizemos o throw para garantir que os erros de ligação a base de dados nao iniciem o servidor
export const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log("MongoDB conectado!");
  } catch (error) {
    console.error("Erro ao conectar ao MongoDB:", error);
    throw new Error("Erro ao conectar ao MongoDB");  // Lançar o erro
  }
};