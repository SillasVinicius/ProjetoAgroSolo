const config = require('./config/config');
const db = config.db;

async function obtemDados() {

    const dados = {
        clientesMap: new Map(),
        outorgas: [],
        declaracoesAmbientais: [],
        licencasAmbientais: [],
        cadastrosCredito: [],
        aniversariantesDia:[],
        outorgasVencer30Dias: [],
        outorgasVencer15Dias: [],
        daVencer30Dias: [],
        daVencer15Dias: [],
        laVencer15Dias: [],
        laVencer60Dias: [],
        laVencer130Dias: [],
        ccVencer15Dias: [],
        ccVencer30Dias: [],
        ccVencer130Dias: [],
    };

    // busca todos os clientes
    await db.collection('cliente').get()
        .then((snapshot) => {
            snapshot.forEach((doc) => {
                dados.clientesMap.set(doc.id, doc.data());
            });
        })
        .catch((err) => {
            console.log('Error getting documents', err);
        })

    // busca todas as outorgas
    await db.collection('outorga').get()
        .then((snapshot) => {
            snapshot.forEach((doc) => {
                dados.outorgas.push(doc.data());
            });
        })
        .catch((err) => {
            console.log('Error getting documents', err);
        })

    // busca todas as declarações ambientais
    await db.collection('DeclaracaoAmbiental').get()
        .then((snapshot) => {
            snapshot.forEach((doc) => {
                dados.declaracoesAmbientais.push(doc.data());
            });
        })
        .catch((err) => {
            console.log('Error getting documents', err);
        })

    // busca todas as licenças ambientais
    await db.collection('LicencaAmbiental').get()
        .then((snapshot) => {
            snapshot.forEach((doc) => {
                dados.licencasAmbientais.push(doc.data());
            });
        })
        .catch((err) => {
            console.log('Error getting documents', err);
        })

    // busca todas os cadastro de credito
    await db.collection('cadastroCredito').get()
        .then((snapshot) => {
            snapshot.forEach((doc) => {
                dados.cadastrosCredito.push(doc.data());
            });
        })
        .catch((err) => {
            console.log('Error getting documents', err);
        })

    // Busca os aniversariantes do dia
    dados.clientesMap.forEach(
        (cliente) => {
            dtNascimento = new Date(cliente.dataNascimento);
            dtAniversario = `${dtNascimento.getDate()}-${dtNascimento.getMonth() + 1}`;
            dtHojeCompleto = new Date();
            dtHoje = `${dtHojeCompleto.getDate()}-${dtHojeCompleto.getMonth() + 1}`;
            if(dtAniversario === dtHoje) {
                dados.aniversariantesDia.push(cliente);
            }
        }
    );

    // Busca outorgas a vencer em 15 dias ou menos e 30 dias ou menos
    dados.outorgas.forEach(
        (outorga) => {
            dtVencimento = new Date(outorga.dataDeVencimento);
            dtHoje = new Date();
            diasDiferenca = Math.ceil((dtVencimento - dtHoje) / (1000 * 3600 * 24));
            if (diasDiferenca <= 15) {
                dados.outorgasVencer15Dias.push(outorga);
            } else if (diasDiferenca <= 30) {
                dados.outorgasVencer30Dias.push(outorga);
            }
        }
    )

    // Busca declaracoes ambientais a vencer em 15 dias ou menos e 30 dias ou menos
    dados.declaracoesAmbientais.forEach(
        (da) => {
            dtVencimento = new Date(da.dataDeVencimento);
            dtHoje = new Date();
            diasDiferenca = Math.ceil((dtVencimento - dtHoje) / (1000 * 3600 * 24));
            if (diasDiferenca <= 15) {
                dados.daVencer15Dias.push(da);
            } else if (diasDiferenca <= 30) {
                dados.daVencer30Dias.push(da);
            }
        }
    )

    // Busca licenças ambientais a vencer em 15 dias ou menos, 60 dias ou menos e 130 dias ou menos
    dados.licencasAmbientais.forEach(
        (la) => {
            dtVencimento = new Date(la.dataDeVencimento);
            dtHoje = new Date();
            diasDiferenca = Math.ceil((dtVencimento - dtHoje) / (1000 * 3600 * 24));
            if (diasDiferenca <= 15) {
                dados.laVencer15Dias.push(la);
            } else if (diasDiferenca <= 60) {
                dados.laVencer60Dias.push(la);
            } else if (diasDiferenca <= 130) {
                dados.laVencer130Dias.push(la);
            }
        }
    )

    // Busca cadastros de credito a vencer em 15 dias ou menos, 30 dias ou menos e 130 dias ou menos
    dados.cadastrosCredito.forEach(
        (cc) => {
            dtExpiracao = new Date(cc.dataExpiracaoCredito);
            dtHoje = new Date();
            diasDiferenca = Math.ceil((dtExpiracao - dtHoje) / (1000 * 3600 * 24));
            if (diasDiferenca <= 15) {
                dados.ccVencer15Dias.push(cc);
            } else if (diasDiferenca <= 60) {
                dados.ccVencer30Dias.push(cc);
            } else if (diasDiferenca <= 130) {
                dados.ccVencer130Dias.push(cc);
            }
        }
    )

    return dados;

};

module.exports = { obtemDados };