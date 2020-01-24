function montaCorpoEmail(informacoes) {

    let htmlAniversariantes = '<tr style="text-align: center"><td>Sem aniversariantes hoje!</td></tr>';
    let htmlOutorgas30 = '<tr style="text-align: center"><td>Nenhuma!</td></tr>';
    let htmlOutorgas15 = '<tr style="text-align: center"><td>Nenhuma!</td></tr>';
    let htmlDA30 = '<tr style="text-align: center"><td>Nenhuma!</td></tr>';
    let htmlDA15 = '<tr style="text-align: center"><td>Nenhuma!</td></tr>';
    let htmlLA15 = '<tr style="text-align: center"><td>Nenhuma!</td></tr>';
    let htmlLA60 = '<tr style="text-align: center"><td>Nenhuma!</td></tr>';
    let htmlLA130 = '<tr style="text-align: center"><td>Nenhuma!</td></tr>';
    let htmlCC15 = '<tr style="text-align: center"><td>Nenhuma!</td></tr>';
    let htmlCC30 = '<tr style="text-align: center"><td>Nenhuma!</td></tr>';
    let htmlCC130 = '<tr style="text-align: center"><td>Nenhuma!</td></tr>';

    // monta conteudo da seção de aniverasriantes do dia
    if (informacoes.aniversariantesDia.length != 0) {
        htmlAniversariantes = '';
        informacoes.aniversariantesDia.forEach(
            (aniversariante) => {
                htmlAniversariantes += `<tr style="text-align: center"><td>${aniversariante.nome}</td></tr>`;
            }
        );
    }

    if (informacoes.outorgasVencer30Dias.length != 0) {
        htmlOutorgas30 = '';
        informacoes.outorgasVencer30Dias.forEach(
            (outorga) => {
                let nomeCliente = informacoes.clientesMap.get(outorga.clienteId).nome
                htmlOutorgas30 += `<tr style="text-align: center"><td>${nomeCliente} - ${outorga.descricao}</td></tr>`
            }
        );
    }

    if (informacoes.outorgasVencer15Dias.length != 0) {
        htmlOutorgas15 = '';
        informacoes.outorgasVencer15Dias.forEach(
            (outorga) => {
                let nomeCliente = informacoes.clientesMap.get(outorga.clienteId).nome
                htmlOutorgas15 += `<tr style="text-align: center"><td>${nomeCliente} - ${outorga.descricao}</td></tr>`
            }
        );
    }

    if (informacoes.daVencer30Dias.length != 0) {
        htmlDA30 = '';
        informacoes.daVencer30Dias.forEach(
            (da) => {
                let nomeCliente = informacoes.clientesMap.get(da.clienteId).nome
                htmlDA30 += `<tr style="text-align: center"><td>${nomeCliente} - ${da.descricao}</td></tr>`;
            }
        );
    }

    if (informacoes.daVencer15Dias.length != 0) {
        htmlDA15 = '';
        informacoes.daVencer15Dias.forEach(
            (da) => {
                let nomeCliente = informacoes.clientesMap.get(da.clienteId).nome
                htmlDA15 += `<tr style="text-align: center"><td>${nomeCliente} - ${da.descricao}</td></tr>`;
            }
        );
    }

    if (informacoes.laVencer15Dias.length != 0) {
        htmlLA15 = '';
        informacoes.laVencer15Dias.forEach(
            (la) => {
                let nomeCliente = informacoes.clientesMap.get(la.clienteId).nome
                htmlLA15 += `<tr style="text-align: center"><td>${nomeCliente} - ${la.descricao}</td></tr>`
            }
        );
    }

    if (informacoes.laVencer60Dias.length != 0) {
        htmlLA60 = '';
        informacoes.laVencer60Dias.forEach(
            (la) => {
                let nomeCliente = informacoes.clientesMap.get(la.clienteId).nome
                htmlLA60 += `<tr style="text-align: center"><td>${nomeCliente} - ${la.descricao}</td></tr>`
            }
        );
    }

    if (informacoes.laVencer130Dias.length != 0) {
        htmlLA130 = '';
        informacoes.laVencer130Dias.forEach(
            (la) => {
                let nomeCliente = informacoes.clientesMap.get(la.clienteId).nome
                htmlLA130 += `<tr style="text-align: center"><td>${nomeCliente} - ${la.descricao}</td></tr>`
            }
        );
    }

    if(informacoes.ccVencer15Dias.length != 0){
        htmlCC15 = '';
        informacoes.ccVencer15Dias.forEach(
            (cc) => {
                let nomeCliente = informacoes.clientesMap.get(cc.clienteId).nome
                htmlCC15 += `<tr style="text-align: center"><td>${nomeCliente} - ${cc.descricao}</td></tr>`
            }
        );
    }

    if(informacoes.ccVencer30Dias.length != 0){
        htmlCC30 = '';
        informacoes.ccVencer30Dias.forEach(
            (cc) => {
                let nomeCliente = informacoes.clientesMap.get(cc.clienteId).nome
                htmlCC30 += `<tr style="text-align: center"><td>${nomeCliente} - ${cc.descricao}</td></tr>`
            }
        );
    }
    
    if(informacoes.ccVencer130Dias.length != 0){
        htmlCC130 = '';
        informacoes.ccVencer130Dias.forEach(
            (cc) => {
                let nomeCliente = informacoes.clientesMap.get(cc.clienteId).nome
                htmlCC130 += `<tr style="text-align: center"><td>${nomeCliente} - ${cc.descricao}</td></tr>`
            }
        );
    }
        
    
    corpoEmail = 
    `
    <table style="border: solid black;width: 100%;">
    <tr style="text-align: center;"><th class="top" style="border-bottom: groove;background-color: #217e36;color: #fff;">Aniversariantes do dia</th></tr>
    ${htmlAniversariantes}
    <tr style="text-align: center;"><th class="divisao" style="border-top: solid black;border-bottom: groove;background-color: #217e36;color: #fff;">Outorgas a vencer</th></tr>
    <tr style="text-align: center;"><th><u>Em menos de 30 dias:</u></th></tr>
    ${htmlOutorgas30}
    <tr style="text-align: center;"><th><u>Em menos de 15 dias:</u></th></tr>
    ${htmlOutorgas15}
    <tr style="text-align: center;"><th class="divisao" style="border-top: solid black;border-bottom: groove;background-color: #217e36;color: #fff;">Declarações Ambientais a vencer</th></tr>
    <tr style="text-align: center;"><th><u>Em menos de 30 dias</u></th></tr>
    ${htmlDA30}
    <tr style="text-align: center;"><th><u>Em menos de 15 dias</u></th></tr>
    ${htmlDA15}
    <tr style="text-align: center;"><th class="divisao" style="border-top: solid black;border-bottom: groove;background-color: #217e36;color: #fff;">Licenças Ambientais a vencer</th></tr>
    <tr style="text-align: center;"><th><u>Em menos de 130 dias</u></th></tr>
    ${htmlLA130}
    <tr style="text-align: center;"><th><u>Em menos de 60 dias</u></th></tr>
    ${htmlLA60}
    <tr style="text-align: center;"><th><u>Em menos de 15 dias</u></th></tr>
    ${htmlLA15}
    <tr style="text-align: center;"><th class="divisao" style="border-top: solid black;border-bottom: groove;background-color: #217e36;color: #fff;">Cadastros de crédito a vencer</th></tr>
    <tr style="text-align: center;"><th><u>Em menos de 15 dias</u></th></tr>
    ${htmlCC15}
    <tr style="text-align: center;"><th><u>Em menos de 30 dias</u></th></tr>
    ${htmlCC30}
    <tr style="text-align: center;"><th><u>Em menos de 130 dias</u></th></tr>
    ${htmlCC130}
    </table>
    `
    return corpoEmail;
}

function montaEmailCliente(cliente) {

    conteudo = `<h1>Olá ${cliente.nome}</h1><table style="border:solid black;width: 100%;">`;

    // outorga
    if (cliente.ouPendentes15) {
        conteudo += tituloSecao('As seguintes outorgas vencerão em 15 dias:');
        cliente.ouPendentes15.forEach(
            (outorga) => {
                conteudo += dadoSecao(outorga.descricao);
            }
        ) 
    }

    if (cliente.ouPendentes30) {
        conteudo += tituloSecao('As seguintes outorgas vencerão em 30 dias:');
        cliente.ouPendentes30.forEach(
            (outorga) => {
                conteudo += dadoSecao(outorga.descricao);
            }
        ) 
    }

    // declaracao ambiental
    if (cliente.daPendentes15) {
        conteudo += tituloSecao('As seguintes declarações ambientais vencerão em 15 dias:');
        cliente.daPendentes15.forEach(
            (decAmb) => {
                conteudo += dadoSecao(decAmb.descricao);
            }
        ) 
    }

    if (cliente.daPendentes30) {
        conteudo += tituloSecao('As seguintes declarações ambientais vencerão em 30 dias:');
        cliente.daPendentes30.forEach(
            (decAmb) => {
                conteudo += dadoSecao(decAmb.descricao);
            }
        ) 
    }

    // licença ambiental
    if (cliente.laPendentes15) {
        conteudo += tituloSecao('As seguintes licenças ambientais vencerão em 15 dias:');
        cliente.laPendentes15.forEach(
            (licAmb) => {
                conteudo += dadoSecao(licAmb.descricao);
            }
        ) 
    }

    if (cliente.laPendentes60) {
        conteudo += tituloSecao('As seguintes licenças ambientais vencerão em 60 dias:');
        cliente.laPendentes60.forEach(
            (licAmb) => {
                conteudo += dadoSecao(licAmb.descricao);
            }
        ) 
    }

    if (cliente.laPendentes130) {
        conteudo += tituloSecao('As seguintes licenças ambientais vencerão em 130 dias:');
        cliente.laPendentes130.forEach(
            (licAmb) => {
                conteudo += dadoSecao(licAmb.descricao);
            }
        ) 
    }

    // cadastro de credito
    if (cliente.ccPendentes15) {
        conteudo += tituloSecao('As seguintes cadastros de crédito vencerão em 15 dias:');
        cliente.ccPendentes15.forEach(
            (cadCred) => {
                conteudo += dadoSecao(cadCred.descricao);
            }
        ) 
    }

    if (cliente.ccPendentes30) {
        conteudo += tituloSecao('As seguintes cadastros de crédito vencerão em 30 dias:');
        cliente.ccPendentes30.forEach(
            (cadCred) => {
                conteudo += dadoSecao(cadCred.descricao);
            }
        ) 
    }

    if (cliente.ccPendentes130) {
        conteudo += tituloSecao('As seguintes cadastros de crédito vencerão em 130 dias:');
        cliente.ccPendentes130.forEach(
            (cadCred) => {
                conteudo += dadoSecao(cadCred.descricao);
            }
        ) 
    }
   
    conteudo += '</table>';
    return conteudo;
}

const tituloSecao = (texto) => {
    return `<tr style="text-align: center;"><th style="border-top: solid black;border-bottom: groove;background-color: #217e36;color: #fff;">${texto}</th></tr>`
}
const dadoSecao = (texto) => `<tr style="text-align: center;"><td>${texto}</td></tr>`;


module.exports = { montaCorpoEmail, montaEmailCliente };

