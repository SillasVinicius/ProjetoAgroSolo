const nodemailer = require('nodemailer');

const $usuario = 'lucasdsaints96@gmail.com';
const $senha = 'Wi2KZXSy';
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: $usuario,
        pass: $senha
    }
});

exports.send = function (nomeDest, novaSenha, emailDest) {

    let mailOptions = {
        from: $usuario,
        to: emailDest,
        subject: 'Agrosolo - recuperação de senha.',
        html: `
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
        `
    };

    let emailSent = true;
    transporter.sendMail(mailOptions, (error, info) => {
        if (error !== null) {
            emailSent = false
        }
    });
    return emailSent;
}
