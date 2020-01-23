const assuntoEmailRecSenha = 'Agro Solo - recuperação de senha';

function montaCorpoEmailRecSenha (nome, novaSenha) {
    const corpoEmail =
        `<!DOCTYPE html>
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
            <h3>Olá ${nome}!!</h3>
            <p>
                Sua nova senha Agro Solo é <span>${novaSenha}</span>.</div>
            </p> 
        </body>
        </html> `;
    return corpoEmail;
};

module.exports = { assuntoEmailRecSenha, montaCorpoEmailRecSenha };