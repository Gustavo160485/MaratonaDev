//configurando o servidor
const express = require("express")
const server = express()


//configurar o servidor para apresentar arquivos estaticos(css, imagens, etc o que esta dentro da pasta public)
server.use(express.static('public'))

//habilitar body do formulário
server.use(express.urlencoded({ extended: true }))


//configurar a conexão com o banco de dados
const pool = require('pg').Pool
const db = new pool({
    user: 'postgres',
    password: '16041985',
    host: 'localhost',
    port: 5432,
    database: 'postgres'

})


//configurando a template engine   "./"->ele entende que é a raiz/pasta do projeto
const nunjucks = require("nunjucks")
nunjucks.configure("./", {
    express: server,
    noCache: true,  //booleano aceita 2 valores verdadeiro ou falso
})


//configurar a apresentação da pagina
server.get("/", function (req, res) {

    db.query("SELECT * FROM donors", function (err, result) {
        if (err) {
            console.log(err)
            return res.json(err)

        }

        const donors = result.rows
        return res.render("index.html", { donors })
    })


})

server.post("/", function (req, res) {
    //pegar dados do formulário
    const name = req.body.name
    const email = req.body.email
    const blood = req.body.blood

    //Se o name for igual a vazio
    //Ou o email igual a vazio
    //Ou o blood igual a vazio
    if (name == "" || email == "" || blood == "") {
        return res.send("todos os campos são obrigatórios.")

    }

    //coloco valores dentro do banco de dados

    const query = `
   INSERT INTO donors ("name", "email", "blood" ) 
   VALUES ($1, $2, $3)`

    const values = [name, email, blood]

    db.query(query, values, function (err) {
        //fluxo de erro
        if (err) {
            console.log(err)
            return res.json("erro no banco de dados.")

        }

        //fluxo ideal
        return res.redirect("/")

    })


})

//ligar o servidor e permitir o acesso na porta 3000
server.listen(3000, function () {
    console.log("iniciei o servidor")
})