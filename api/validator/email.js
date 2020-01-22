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
                htmlAniversariantes += `<tr><td>${aniversariante.nome}</td></tr>`;
            }
        );
    }

    if (informacoes.outorgasVencer30Dias.length != 0) {
        htmlOutorgas30 = '';
        informacoes.outorgasVencer30Dias.forEach(
            (outorga) => {
                htmlOutorgas30 += `<tr><td>${outorga.descricao}</td></tr>`
            }
        );
    }

    if (informacoes.outorgasVencer15Dias.length != 0) {
        htmlOutorgas15 = '';
        informacoes.outorgasVencer15Dias.forEach(
            (outorga) => {
                htmlOutorgas15 += `<tr><td>${outorga.descricao}</td></tr>`
            }
        );
    }

    if (informacoes.daVencer30Dias.length != 0) {
        htmlDA30 = '';
        informacoes.daVencer30Dias.forEach(
            (da) => {
                htmlDA30 += `<tr><td>${da.descricao}</td></tr>`;
            }
        );
    }

    if (informacoes.laVencer15Dias.length != 0) {
        htmlLA15 = '';
        informacoes.laVencer15Dias.forEach(
            (la) => {
                htmlLA15 += `<tr><td>${la.descricao}</td></tr>`
            }
        );
    }

    if (informacoes.laVencer60Dias.length != 0) {
        htmlLA60 = '';
        informacoes.laVencer60Dias.forEach(
            (la) => {
                htmlLA60 += `<tr><td>${la.descricao}</td></tr>`
            }
        );
    }

    if (informacoes.laVencer130Dias.length != 0) {
        htmlLA130 = '';
        informacoes.laVencer130Dias.forEach(
            (la) => {
                htmlLA130 += `<tr><td>${la.descricao}</td></tr>`
            }
        );
    }

    if(informacoes.ccVencer15Dias.length != 0){
        htmlCC15 = '';
        informacoes.ccVencer15Dias.forEach(
            (cc) => {
            htmlCC15 += `<tr><td>${cc.descricao}</td></tr>`
            }
        );
    }

    if(informacoes.ccVencer30Dias.length != 0){
        htmlCC30 = '';
        informacoes.ccVencer30Dias.forEach(
            (cc) => {
                htmlCC30 += `<tr><td>${cc.descricao}</td></tr>`
            }
        );
    }
    
    if(informacoes.ccVencer130Dias.length != 0){
        htmlCC130 = '';
        informacoes.ccVencer130Dias.forEach(
            (cc) => {
                htmlCC130 += `<tr><td>${cc.descricao}</td></tr>`
            }
        );
    }
        
    
    corpoEmail = 
    `
    <table style="width:100%">
    <tr><th>Aniversariantes do dia</th></tr>
    ${htmlAniversariantes}
    <tr><th>Outorgas a vencer</th></tr>
    <tr><th>Em menos de 30 dias:</th></tr>
    ${htmlOutorgas30}
    <tr><th>Em menos de 15 dias:</th></tr>
    ${htmlOutorgas15}
    <tr><th>Declarações Ambientais a vencer</th></tr>
    <tr><th>Em menos de 30 dias</th></tr>
    ${htmlDA30}
    <tr><th>Em menos de 15 dias</th></tr>
    ${htmlDA15}
    <tr><th>Licenças Ambientais a vencer</th></tr>
    <tr><th>Em menos de 130 dias</th></tr>
    ${htmlLA130}
    <tr><th>Em menos de 60 dias</th></tr>
    ${htmlLA60}
    <tr><th>Em menos de 15 dias</th></tr>
    ${htmlLA15}
    <tr><th>Em menos de 130</th></tr>
    <tr><th>Cadastros de crédito a vencer</th></tr>
    <tr><th>Menos de 15 dias</th></tr>
    ${htmlCC15}
    <tr><th>Menos de 30 dias</th></tr>
    ${htmlCC30}
    <tr><th>Menos de 130 dias</th></tr>
    ${htmlCC130}
    </table>
    `
    return corpoEmail;
}

module.exports = { montaCorpoEmail };

