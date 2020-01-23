const nodemailer = require('nodemailer');
const config = require('./config/config');
const db = config.db;

exports.send = async function (nomeDest, novaSenha, emailDest, assuntoEmail = null, corpoEmail = null) {
    let $usuario;
    let $senha;
    let $service;

    // Busca os dados do email remetente
    await db.collection('parametrizacoes').doc('geral').get()
        .then(
            (doc) => {
                $usuario = doc.data()['emailRemetenteEmail'];
                $senha = doc.data()['senhaRemetenteEmail'];
                $service = doc.data()['servicoEmail'];
            }
        )
        .catch(
            (err) => {
                console.log('Erro ao solicictar dados de email!\n', err);
                // tratativa??????
            }
        );

    const transporter = nodemailer.createTransport({
        service: $service,
        auth: {
            user: $usuario,
            pass: $senha
        }
    });

    const mailOptions = {
        from: $usuario,
        to: emailDest,
        subject: assuntoEmail === null ? 'Agrosolo - recuperação de senha.' : assuntoEmail,
        html: corpoEmail === null ? `
        <!DOCTYPE html>
        <html lang="pt-br">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <style>
                body {
                    padding: 10px;
                    font-family: Arial, Helvetica, sans-serif;
                    font-size: medium;
                }
                span {
                    font-weight: bold;
                }
            </style>
        </head>
        <body>
            <h3>Olá ${nomeDest}!!</h3>
            <p>
                Sua nova senha AgroSolo é <span>${novaSenha}</span>.</div>
            </p> 
        </body>

        </html>
        `: corpoEmail
    };

    let emailSent = true;
    transporter.sendMail(mailOptions, (error) => {
        if (error) {
            emailSent = false;
        }
    });
    return emailSent;
}


exports.enviaEmailGenerico = async function (emailDest, assuntoEmail, corpoEmail) {
    let $usuario;
    let $senha;
    let $service;
    let emailSent = true;

    // Busca os dados do email remetente
    await db.collection('parametrizacoes').doc('geral').get()
        .then(
            (doc) => {
                $usuario = doc.data()['emailRemetenteEmail'];
                $senha = doc.data()['senhaRemetenteEmail'];
                $service = doc.data()['servicoEmail'];
            }
        )
        .catch(
            (err) => {
                console.log('Erro ao solicictar dados de email!\n', err);
                emailSent = false; // melhorar isso
            }
        );

    const transporter = nodemailer.createTransport({
        service: $service,
        auth: {
            user: $usuario,
            pass: $senha
        }
    });

    const mailOptions = {
        from: $usuario,
        to: emailDest,
        subject: assuntoEmail,
        html: corpoEmail
    };

    transporter.sendMail(mailOptions, (error) => {
        if (error) {
            emailSent = false;
        }
    });
    return emailSent;
}