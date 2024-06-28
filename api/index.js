import express from "express";
import userRouter from "./routes/user.js";
import authRouter from "./routes/auth.js";
import bodyParser from "body-parser";
import cors from "cors";

const app = express();

// Middleware para parsear JSON
app.use(express.json());

// Middleware para parsear URL-encoded
app.use(bodyParser.urlencoded({extended: false}));
app.use(cors);

// Roteadores
app.use("/api/user/", userRouter);
app.use("/api/auth/", authRouter);

// Inicia o servidor
app.listen(8001, () => {
    console.log("Servidor rodando na porta 8001");
});