const config = require('./config');

const db = config.db;

let clientes;
let outorgas;
let declaracoesAmbientais;
let licencasAmbientais;
let cadastrosCredito;

let aniveriantesDia = [];
let outorgasVencer30Dias;
let outorgasVencer15Dias;
let daVencer30Dias;
let daVencer15Dias;
let laVencer15Dias;
let laVencer60Dias;
let laVencer130Dias;
let ccVencer15Dias;
let ccVencer30Dias;
let ccVencer130Dias;


async function buscaDados() {
    // Limpa variaveis
    clientes = [];
    outorgas = [];
    declaracoesAmbientais = [];
    licencasAmbientais = [];
    cadastrosCredito = [];

    aniveriantesDia = [];
    outorgasVencer30Dias = [];
    outorgasVencer15Dias = [];
    daVencer30Dias = [];
    daVencer15Dias = [];
    laVencer15Dias = [];
    laVencer60Dias = [];
    laVencer130Dias = [];
    ccVencer15Dias = [];
    ccVencer30Dias = [];
    ccVencer130Dias = [];

    // busca todos os clientes
    await db.collection('cliente').get()
        .then((snapshot) => {
            snapshot.forEach((doc) => {
                clientes.push(doc.data());
            });
        })
        .catch((err) => {
            console.log('Error getting documents', err);
        })

    // busca todas as outorgas
    await db.collection('outorga').get()
        .then((snapshot) => {
            snapshot.forEach((doc) => {
                outorgas.push(doc.data());
            });
        })
        .catch((err) => {
            console.log('Error getting documents', err);
        })

    // busca todas as declarações ambientais
    await db.collection('DeclaracaoAmbiental').get()
        .then((snapshot) => {
            snapshot.forEach((doc) => {
                declaracoesAmbientais.push(doc.data());
            });
        })
        .catch((err) => {
            console.log('Error getting documents', err);
        })

    // busca todas as licenças ambientais
    await db.collection('LicencaAmbiental').get()
        .then((snapshot) => {
            snapshot.forEach((doc) => {
                licencasAmbientais.push(doc.data());
            });
        })
        .catch((err) => {
            console.log('Error getting documents', err);
        })

    // busca todas os cadastro de credito
    await db.collection('cadastroCredito').get()
        .then((snapshot) => {
            snapshot.forEach((doc) => {
                cadastrosCredito.push(doc.data());
            });
        })
        .catch((err) => {
            console.log('Error getting documents', err);
        })

    // Busca os aniversariantes do dia
    aniveriantesDia = clientes.filter(
        (cliente) => {
            dtNascimento = new Date(cliente.dataNascimento);
            dtAniversario = `${dtNascimento.getDate()}-${dtNascimento.getMonth() + 1}`;
            dtHojeCompleto = new Date();
            dtHoje = `${dtHojeCompleto.getDate()}-${dtHojeCompleto.getMonth() + 1}`;
            return dtAniversario === dtHoje ? true : false;
        }
    );

    // Busca outorgas a vencer em 15 dias ou menos e 30 dias ou menos
    outorgas.forEach(
        (outorga) => {
            dtVencimento = new Date(outorga.dataDeVencimento);
            dtHoje = new Date();
            diasDiferenca = Math.ceil((dtVencimento - dtHoje) / (1000 * 3600 * 24));
            if (diasDiferenca <= 15) {
                outorgasVencer15Dias.push(outorga);
            } else if (diasDiferenca <= 30) {
                outorgasVencer30Dias.push(outorga);
            }
        }
    )

    // Busca declaracoes ambientais a vencer em 15 dias ou menos e 30 dias ou menos
    declaracoesAmbientais.forEach(
        (da) => {
            dtVencimento = new Date(da.dataDeVencimento);
            dtHoje = new Date();
            diasDiferenca = Math.ceil((dtVencimento - dtHoje) / (1000 * 3600 * 24));
            if (diasDiferenca <= 15) {
                daVencer15Dias.push(da);
            } else if (diasDiferenca <= 30) {
                daVencer30Dias.push(da);
            }
        }
    )

    // Busca licenças ambientais a vencer em 15 dias ou menos, 60 dias ou menos e 130 dias ou menos
    licencasAmbientais.forEach(
        (la) => {
            dtVencimento = new Date(la.dataDeVencimento);
            dtHoje = new Date();
            diasDiferenca = Math.ceil((dtVencimento - dtHoje) / (1000 * 3600 * 24));
            if (diasDiferenca <= 15) {
                laVencer15Dias.push(la);
            } else if (diasDiferenca <= 60) {
                laVencer60Dias.push(la);
            } else if (diasDiferenca <= 130) {
                laVencer130Dias.push(la);
            }
        }
    )

    // Busca cadastros de credito a vencer em 15 dias ou menos, 30 dias ou menos e 130 dias ou menos
    cadastrosCredito.forEach(
        (cc) => {
            dtExpiracao = new Date(cc.dataExpiracaoCredito);
            dtHoje = new Date();
            diasDiferenca = Math.ceil((dtExpiracao - dtHoje) / (1000 * 3600 * 24));
            if (diasDiferenca <= 15) {
                ccVencer15Dias.push(cc);
            } else if (diasDiferenca <= 60) {
                ccVencer30Dias.push(cc);
            } else if (diasDiferenca <= 130) {
                ccVencer130Dias.push(cc);
            }
        }
    )

    // tirar isso daqui
    montarEmail();
}

// dividir em dois documentos, talvez usando um objeto como retorno
buscaDados();
function montarEmail() {
    let htmlAniversariantes = '<tr><td>Sem aniversariantes hoje!</td></tr>';
    let htmlOutorgas30 = '<tr><td>Nenhuma!</td></tr>';
    let htmlOutorgas15 = '<tr><td>Nenhuma!</td></tr>';
    let htmlDA30 = '<tr><td>Nenhuma!</td></tr>';
    let htmlDA15 = '<tr><td>Nenhuma!</td></tr>';
    let htmlLA15 = '<tr><td>Nenhuma!</td></tr>';
    let htmlLA60 = '<tr><td>Nenhuma!</td></tr>';
    let htmlLA130 = '<tr><td>Nenhuma!</td></tr>';

    // monta conteudo da seção de aniverasriantes do dia
    if (aniveriantesDia) {
        htmlAniversariantes = '';
        aniveriantesDia.forEach(
            (aniversariante) => {
                htmlAniversariantes += `<tr><td>${aniversariante.nome}</td></tr>`;
            }
        );
    }

    if (outorgasVencer30Dias) {
        htmlOutorgas30 = '';
        outorgasVencer30Dias.forEach(
            (outorga) => {
                htmlOutorgas30 += `<tr><td>${outorga.descricao}</td></tr>`
            }
        );
    }

    if (outorgasVencer15Dias) {
        htmlOutorgas15 = '';
        outorgasVencer15Dias.forEach(
            (outorga) => {
                htmlOutorgas15 += `<tr><td>${outorga.descricao}</td></tr>`
            }
        );
    }

    if (daVencer30Dias) {
        htmlDA30 = '';
        daVencer30Dias.forEach(
            (da) => {
                htmlDA30 += `<tr><td>${da.descricao}</td></tr>`;
                console.log(da)
            }
        );
    }

    if (laVencer15Dias) {
        htmlLA15 = '';
        laVencer15Dias.forEach(
            (la) => {
                htmlLA15 += `<tr><td>${la.descricao}</td></tr>`
            }
        );
    }

    if (laVencer60Dias) {
        htmlLA60 = '';
        laVencer60Dias.forEach(
            (la) => {
                htmlLA60 += `<tr><td>${la.descricao}</td></tr>`
            }
        );
    }

    if (laVencer130Dias) {
        htmlLA130 = '';
        laVencer130Dias.forEach(
            (la) => {
                htmlLA130 += `<tr><td>${la.descricao}</td></tr>`
            }
        );
    }



    corpoEmail = 
    `
    <table style="width:100%">
    <tr><th>Aniversariantes do dia</th></tr>
    ${htmlAniversariantes}
    <tr><th>Outorgas a vencer</th></tr>
    <tr><th>30 dias:</th></tr>
    ${htmlOutorgas30}
    <tr><th>15 dias:</th></tr>
    ${htmlOutorgas15}
    <tr><th>Declarações Ambientais a vencer</th></tr>
    <tr><th>30 dias</th></tr>
    ${htmlDA30}
    <tr><th>15 dias</th></tr>
    ${htmlDA15}
    <tr><th>Licenças Ambientais a vencer</th></tr>
    <tr><th>130 dias</th></tr>
    ${htmlLA130}
    <tr><th>60 dias</th></tr>
    ${htmlLA60}
    <tr><th>15 dias</th></tr>
    ${htmlLA15}
    </table>
    `
    console.log(corpoEmail);
}


