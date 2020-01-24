const validacao = require('./validations');
const email = require('./email');
const request = require('request');
const config = require('./config/config');

// intervalo para execução da validacao, em milisegundos
const intervalo = 1000 * 60 * 10;
let corpoEmail;

setInterval(executaProcesso, intervalo);

async function executaProcesso() {
    const params = await config.envioRelatorio();
    const dataHoje = new Date();
    const dataUltimoRelatorio = new Date(params.hrUltimoRelatorio).toDateString();
    const dataUltimaValidClientes = new Date(params.hrUltimaValidClientes).toDateString();

    console.log('Processo de validações iniciado. ' + new Date().toTimeString());

    // verifica se hoje é o dia de envio de relatorio
    if (params.execRelHoje) {
        // verifica se já foi executado relatorio hoje
        if (dataUltimoRelatorio !== dataHoje.toDateString()) {
            // verifica se já deu a hora de envio do relatorio
            horasEnvio = trataHora(params.hrEnvioRelatorio)
            horasAgora = trataHora(`${dataHoje.getHours()}:${dataHoje.getMinutes()}`)
            
            if (horasAgora >= horasEnvio) {
                // eviar relatorio (executaRelatorio) e atualiza horario de envio do relatorio no firestore
                config.atualizaHoraUltimoRelatorio();
                if (executaRelatorio()) {
                    console.log('Relatorio geral executado.');
                }
            } else {
                console.log('Relatorio geral nao executado - "Horario programado nao atingido".');
            }
        } else {
            console.log('Relatorio geral nao executado - "Relatorio ja executado para o dia atual".');
        }
    } else {
        console.log('Relatorio geral nao executado - "Dia atual nao configurado para envio".');
    }

    // valida se ja executou a validacao de clientes hoje
    if (dataUltimaValidClientes !== dataHoje.toDateString()) {
        // valida se passou do horario de mandar
        horasEnvio = trataHora(params.hrEnvioRelatorio);
        horasAgora = trataHora(`${dataHoje.getHours()}:${dataHoje.getMinutes()}`);

        if (horasAgora >= horasEnvio) {
            // verifica e envia quando necessario os emails individuais 
            config.atualizaHoraUltimaValidClientes();
            if (executaAlertaCliente()) {
                console.log('Validacao de clientes executada.');
            }
        } else {
            console.log('Validacao de clientes nao executada - "Validacao ja executada para o dia atual".');
        }
    } else {
        console.log('Validacao de clientes nao executada - "Validacao ja executada para o dia atual".');
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
                        console.log('Api de envio de email retornou resposta sucesso para envio de relatorio geral.');
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

function executaAlertaCliente() {
    let sucesso = true;
    validacao.obtemClientesComPendencias()
        .then(
            async (clientes) => {

                for (cliente of clientes) {
                    corpoEmail = email.montaEmailCliente(cliente);
                    
                    // envia o email
                    let opcoesApi = {
                        url: await config.urlBase() + '/enviarelatorio',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        json: {
                            'destinatarios': cliente.email,
                            'assunto': 'Lembrete Agro Solo',
                            'corpo' : corpoEmail
                        }
                    }

                    request.post(opcoesApi, (error, response, body) => {
                        if (!error && response.statusCode == 200) {
                            console.log('Api de envio de email retornou resposta sucesso para envio de lembrete cliente.');
                        }
                        
                    });
                }

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