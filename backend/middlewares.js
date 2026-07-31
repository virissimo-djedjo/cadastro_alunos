import jwt from "jsonwebtoken";
import pool from "./conexao.js";

export const autenticar = async (req, res, next) =>{
    try {
        const autorizacao = req.headers.authorization;

        if(!autorizacao){
            return res.json("Token não informado");
        }

        const token = autorizacao.split(" ")[1]

        if(!token){
            return res.status(401).json("Token ínvalido")
        }

        const dadosToken = jwt.verify(token, process.env.JWT_SECRET)

        const usuarioValido = await pool.query("SELECT * FROM alunos where id = $1", [dadosToken.id])

        if(usuarioValido.rowCount === 0){
            res.status(401).json({message: "Usuario nao encontrado"})
        }

        req.usuario = dadosToken;

        next()

    } catch (erro) {
        console.error(erro.message)
        return res.status(401).json("Token invalido ou não informado")
    }
}