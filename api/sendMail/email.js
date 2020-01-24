const nodemailer = require('nodemailer');
const config = require('./config/config');
const db = config.db;

exports.send = async function (emailDest, assuntoEmail, corpoEmail) {
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
                emailSent = false;
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