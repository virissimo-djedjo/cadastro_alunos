import "dotenv/config";
import pool from "./conexao.js";
import { Router } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import {autenticar} from "./middlewares.js"

const router = Router();

router.post("/cadastrar", async (req, res) => {
  try {
    const { nome, email, password } = req.body;

    if(!nome || !email || !password){
      return res.json('Campos nome, email e password são obrigatórios');
    }

    const jaExiste = await pool.query("select * from alunos where email = $1", [email]);

    if(jaExiste.rowCount > 0){
      return res.status(400).json('Este email já existe');
    }

    const salt = await bcrypt.genSalt(10);
    const senhaHashada = await bcrypt.hash(password, salt);

    const dados = await pool.query(
      "INSERT INTO alunos (nome, email, password) VALUES ($1,$2,$3) RETURNING id, nome, email, password",
      [nome, email, senhaHashada],
    );
    return res.status(201).json({ mensagem: "Usuario cadastro com sucesso", data: dados.rows });
  } catch (erro) {
    console.error(erro.message);
    return res.status(500).json({mensagem: 'erro ao cadastrar aluno', erro: erro});
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if(!email || !password){
      return res.json('email e password são obrigatórios')
    }

    const aluno = await pool.query("select * from alunos where email = $1", [
      email,
    ]);

    if (aluno.rowCount === 0) {
      return res.status(404).json("email ou password incorretos");
    }

    const usuario = aluno.rows[0];
    
    const senhaValida = await bcrypt.compare(password, usuario.password);

    if (!senhaValida) {
      return res.status(400).json("email ou senha incorretos");
    }

    const token = jwt.sign(
      { id: usuario.id, email: usuario.email },
      process.env.JWT_SECRET,
      { expiresIn: "7d" },
    );

    return res.status(200).json({token: token, dados:{ id: usuario.id, email: usuario.email} });

  } catch (erro) {
    console.error(erro.message)
    return res.status(500).json('erro ao realizar login')
  }
});


router.get("/perfil", autenticar, async (req, res)=>{

  const aluno = await pool.query('SELECT * FROM alunos where email = $1', [req.usuario.email])


  res.json(aluno.rows)
})


export default router;
