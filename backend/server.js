import express from "express"
import dotenv from "dotenv"
import pool from "./conexao.js"
import router from "./alunos.js"
import cors from "cors"

dotenv.config()

const PORT = process.env.PORT
const app = express()

app.use(express.json())
app.use(cors())

app.use("/", router)

const conetado = async ()=>{
    try {
        const resultado = await pool.query('SELECT NOW()')
        console.log("Banco de dados conetado")
        console.log(resultado.rows[0])
    } catch (erro) {
        console.error(erro)
    }
}

conetado()

app.listen(PORT, "0.0.0.0", ()=>{
    console.log(`Servidor rodando`)
})