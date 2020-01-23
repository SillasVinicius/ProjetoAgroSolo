const validacao = require('./validations');
const email = require('./email');
const request = require('request');
const config = require('./config/config');

// intervalo para execução da validaçaõ, em milisegundos
const intervalo = 1000 * 60 * 10;
let corpoEmail;

setInterval(executaProcesso, intervalo);

async function executaProcesso() {
    // verificar se o relatorio foi enviado hoje
    const infoRelatorio = await config.envioRelatorio();
    const dataHoje = new Date();
    const dataUltimoRelatorio = new Date(infoRelatorio.hrUltimoRelatorio).toDateString();
    if (dataUltimoRelatorio !== dataHoje.toDateString()) {
        // verifiar se já deu a hora de envio do relatorio
        horasEnvio = trataHora(infoRelatorio.hrEnvioRelatorio)
        horasAgora = trataHora(`${dataHoje.getHours()}:${dataHoje.getMinutes()}`)
        
        if (horasAgora >= horasEnvio) {
            // eviar relatorio (executaRelatorio) e atualiza horario de envio do relatorio no firestore
            if (executaRelatorio()) {
                config.atualizaHoraUltimoRelatorio();
                console.log('Relatorio enviado');
            }
        }

    }

}

function trataHora(hora) {
    let arrayHora = hora.split(':');
    horas = parseFloat(arrayHora[0]) + parseFloat(arrayHora[1])/60;
    return horas;
} 
    
function executaRelatorio() {
    let sucesso = true;
    validacao.obtemDados()
        .then(
            async (dados) => {
                // envia o email
                corpoEmail = email.montaCorpoEmail(dados);
                let opcoesApi = {
                    url: await config.urlBase() + '/enviarelatorio',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    json: {
                        'destinatarios': await config.emailsAdmins(),
                        'assunto': 'Relatório AgroSolo',
                        'corpo' : corpoEmail
                    }
                }
                request.post(opcoesApi, (error, response, body) => {
                    if (!error && response.statusCode == 200) {
                        console.log('Api retornou resposta Sucesso.' + body);
                    }
                    
                });

            }
        )
        .catch(
            (err) => { 
                console.log('Erro ao realizar validações!\n', err);
                sucesso = false;
            }
        )
    return sucesso;
};