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

exports.sendMail = function (nomeDest, novaSenha, emailDest) {

    let mailOptions = {
        from: $usuario,
        to: destinatario,
        subject: 'Enviando um email pelo Node.js',
        text: `
        O nome do usuário é ${nomeDest}.
        `
    };

    transporter.sendMail(mailOptions, function(error, info){
        if (error) {
            return false;
        } else {
            return true;
        }
    });
}
