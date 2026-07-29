import jwt from "jsonwebtoken";

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

        req.usuario = dadosToken;

        next()

    } catch (erro) {
        console.error(erro.message)
        return res.status(401).json("Token invalido ou não informado")
    }
}