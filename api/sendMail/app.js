const express = require('express');
const bodyParser = require('body-parser');
const sendMail = require('./email');
const cors = require('cors');

var app = express();
app.use(cors());
app.use(bodyParser.json());

// Rotas
app.post('/recuperasenha', (req, res) => {
    const nome = req.body['usuario'];
    const senha = req.body['senha'];
    const destinatario = req.body['destinatario'];

    if (nome && senha && destinatario) {

        sendMail.send(nome, senha, destinatario)
            .then(
                (emailEnviado) => {
                    if (emailEnviado) {
                        res.status(200).send(JSON.stringify({ response: 'Email sent.' }));
                    } else {
                        res.status(500).send(JSON.stringify({ message: 'Error sending email.' })); // Internal Server Error
                    }
                }
            )

    } else {
        res.status(400).send(JSON.stringify({ message: 'Invalid parameters.' })); // Bad request
    }
});

app.post('/enviarelatorio', (req, res) => {
    const destinatarios = req.body['destinatarios'];
    const assuntoEmail = req.body['assunto'];
    const corpoEmail = req.body['corpo'];

    if (destinatarios && assuntoEmail && corpoEmail) { 

        sendMail.enviaEmailGenerico(destinatarios, assuntoEmail, corpoEmail)
            .then(
                (emailEnviado) => {
                    if (emailEnviado) {
                        res.status(200).send(JSON.stringify({ response: 'Email sent.' }));
                    } else {
                        res.status(500).send(JSON.stringify({ message: 'Error sending email.' })); // Internal Server Error
                    }
                }
            )

    } else {
        res.status(400).send(JSON.stringify({ message: 'Invalid parameters.' })); // Bad request
    }
});


// Start
app.listen(8000, function () {
    console.log('Servidor rodando na porta 8000.');
});

