const express = require("express");
const fs = require("fs");
const cors = require("cors");
const dados = require("./dados.json")
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json');


const PORT = 3000;

const server = express()
server.use(cors());
server.use(express.json());
server.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

server.listen(PORT,()=>{
    console.log("Ta rodando");
});

server.post('/Imagens', (req, res) => {
    const novaImg = req.body

    if (!novaImg.id || !novaImg.nomeDaImagem || !novaImg.sobre || !novaImg.link) {
        return res.status(400).json({ mensagem: "Dados incompletos" })
    } else {
        dados.Imagens.push(novaImg)
        salvarDados(dados)
        return res.status(201).json({ mensagem: "Dados completos." })
    }
})

server.put('/Imagens/:id', (req, res) => {
    const imgId = parseInt(req.params.id)
    const atualizarImg = req.body


    const indiceImg = dados.Imagens.findIndex(Imagens => Imagens.id === imgId)

    if (indiceImg === -1) {
        return res.status(404).json({ mensagem: "Imagens não encontrado" })
    }

    dados.Imagens[indiceImg].nomeDaImagem = atualizarImg.nomeDaImagem || dados.Imagens[indiceImg].nomeDaImagem

    dados.Imagens[indiceImg].sobre = atualizarImg.sobre || dados.Imagens[indiceImg].sobre

    dados.Imagens[indiceImg].id = atualizarImg.id || dados.Imagens[indiceImg].id

    dados.Imagens[indiceImg].link = atualizarImg.link || dados.Imagens[indiceImg].link
    salvarDados(dados)
    return res.json({ mensagem: "Atualização feita com sucesso!" })
})

server.delete('/Imagens/:id', (req, res) => {
    const id = parseInt(req.params.id)

    dados.Imagens = dados.Imagens.filter(u => u.id !== id)

    salvarDados(dados)
    return res.status(200).json({ mensagem: "Imagens excluido!" })
})

server.get('/Imagens', (req, res) => {
    return res.json(dados.Imagens);
})

server.post('/Imagens', (req, res) => {
    const novaImg = req.body

    if (!novaImg.nomeDaImagem || !novaImg.id || !novaImg.sobre || !novaImg.link) {
        return res.status(400).json({ mensagem: "Dados incompletos" })
    } else {
        dados.Imagens.push(novaImg)
        salvarDados(dados)
        return res.status(201).json({ mensagem: "Dados completos, cadastro realizado" })
    }
})

function salvarDados(){
    fs.writeFileSync(__dirname + "/dados.json", JSON.stringify(dados, null, 2))
}