function montaCorpoEmail(informacoes) {

    let htmlAniversariantes = '<tr><td>Sem aniversariantes hoje!</td></tr>';
    let htmlOutorgas30 = '<tr><td>Nenhuma!</td></tr>';
    let htmlOutorgas15 = '<tr><td>Nenhuma!</td></tr>';
    let htmlDA30 = '<tr><td>Nenhuma!</td></tr>';
    let htmlDA15 = '<tr><td>Nenhuma!</td></tr>';
    let htmlLA15 = '<tr><td>Nenhuma!</td></tr>';
    let htmlLA60 = '<tr><td>Nenhuma!</td></tr>';
    let htmlLA130 = '<tr><td>Nenhuma!</td></tr>';
    let htmlCC15 = '<tr><td>Nenhuma!</td></tr>';
    let htmlCC30 = '<tr><td>Nenhuma!</td></tr>';
    let htmlCC130 = '<tr><td>Nenhuma!</td></tr>';

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
    <tr style="text-align: center;"><th><u>Em menos de 130</u></th></tr>
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

module.exports = { montaCorpoEmail };

