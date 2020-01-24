const config = require('./config/config');
const db = config.db;

async function obtemDados() {

    const dados = {
        clientesMap: new Map(),
        aniversariantesDia: [],
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
            snapshot.forEach((cliente) => {
                dados.clientesMap.set(cliente.id, cliente.data());
                dtNascimento = new Date(cliente.data()['dataNascimento']);
                dtAniversario = `${dtNascimento.getDate()}-${dtNascimento.getMonth() + 1}`;
                dtHojeCompleto = new Date();
                dtHoje = `${dtHojeCompleto.getDate()}-${dtHojeCompleto.getMonth() + 1}`;
                if (dtAniversario === dtHoje) {
                    dados.aniversariantesDia.push(cliente.data());
                }
            });
        })
        .catch((err) => {
            console.log('Error getting documents', err);
        })

    // busca todas as outorgas
    await db.collection('outorga').get()
        .then((snapshot) => {
            snapshot.forEach((outorga) => {
                //dados.outorgas.push(doc.data());
                dtVencimento = new Date(outorga.data()['dataDeVencimento']);
                dtHoje = new Date();
                diasDiferenca = Math.ceil((dtVencimento - dtHoje) / (1000 * 3600 * 24));
                if (diasDiferenca <= 15) {
                    dados.outorgasVencer15Dias.push(outorga.data());
                } else if (diasDiferenca <= 30) {
                    dados.outorgasVencer30Dias.push(outorga.data());
                }
            });
        })
        .catch((err) => {
            console.log('Error getting documents', err);
        })

    // busca todas as declarações ambientais
    await db.collection('DeclaracaoAmbiental').get()
        .then((snapshot) => {
            snapshot.forEach((da) => {
                // dados.declaracoesAmbientais.push(doc.data());

                dtVencimento = new Date(da.data()['dataDeVencimento']);
                dtHoje = new Date();
                diasDiferenca = Math.ceil((dtVencimento - dtHoje) / (1000 * 3600 * 24));
                if (diasDiferenca <= 15) {
                    dados.daVencer15Dias.push(da.data());
                } else if (diasDiferenca <= 30) {
                    dados.daVencer30Dias.push(da.data());
                }

            });
        })
        .catch((err) => {
            console.log('Error getting documents', err);
        })

    // busca todas as licenças ambientais
    await db.collection('LicencaAmbiental').get()
        .then((snapshot) => {
            snapshot.forEach((la) => {

                dtVencimento = new Date(la.data()['dataDeVencimento']);
                dtHoje = new Date();
                diasDiferenca = Math.ceil((dtVencimento - dtHoje) / (1000 * 3600 * 24));
                if (diasDiferenca <= 15) {
                    dados.laVencer15Dias.push(la.data());
                } else if (diasDiferenca <= 60) {
                    dados.laVencer60Dias.push(la.data());
                } else if (diasDiferenca <= 130) {
                    dados.laVencer130Dias.push(la.data());
                }

            });
        })
        .catch((err) => {
            console.log('Error getting documents', err);
        })

    // busca todas os cadastro de credito
    await db.collection('cadastroCredito').get()
        .then((snapshot) => {
            snapshot.forEach((cc) => {
                // dados.cadastrosCredito.push(doc.data());

                dtExpiracao = new Date(cc.data()['dataExpiracaoCredito']);
                dtHoje = new Date();
                diasDiferenca = Math.ceil((dtExpiracao - dtHoje) / (1000 * 3600 * 24));
                if (diasDiferenca <= 15) {
                    dados.ccVencer15Dias.push(cc.data());
                } else if (diasDiferenca <= 60) {
                    dados.ccVencer30Dias.push(cc.data());
                } else if (diasDiferenca <= 130) {
                    dados.ccVencer130Dias.push(cc.data());
                }

            });
        })
        .catch((err) => {
            console.log('Error getting documents', err);
        })

    return dados;

};

async function obtemClientesComPendencias() {
    const clientesComPendencias = [];

    // busca todos os clientes
    clientes = [];
    await db.collection('cliente').get()
        .then((snapshot) => {
            snapshot.forEach(
                (cliente) => {
                    clientes.push(cliente.data());
                }
            )
        })
        .catch((err) => {
            console.log('Error getting documents', err);
        })

    // executa verificações
    for (cliente of clientes) {
        let temPendencia = false;

        await verificaOutorga(cliente.id)
            .then(
                (ouPendentes) => {
                    if (ouPendentes.vence15dias.length !== 0) {
                        temPendencia = true;
                        cliente.ouPendentes15 = ouPendentes.vence15dias;
                    };
                    if (ouPendentes.vence30dias.length !== 0) {
                        temPendencia = true;
                        cliente.ouPendentes30 = ouPendentes.vence30dias;
                    }
                }
            )


        await verificaDecAmb(cliente.id)
            .then(
                (daPendentes) => {
                    if (daPendentes.vence15dias.length !== 0) {
                        temPendencia = true;
                        cliente.daPendentes15 = daPendentes.vence15dias;
                    };
                    if (daPendentes.vence30dias.length !== 0) {
                        temPendencia = true;
                        cliente.daPendentes30 = daPendentes.vence30dias;
                    };
                }
            )

        await verificaLicAmb(cliente.id)
            .then(
                (laPendentes) => {
                    if (laPendentes.vence15dias.length !== 0) {
                        temPendencia = true;
                        cliente.laPendentes15 = laPendentes.vence15dias;
                    };
                    if (laPendentes.vence60dias.length !== 0) {
                        temPendencia = true;
                        cliente.laPendentes60 = laPendentes.vence60dias;
                    };
                    if (laPendentes.vence130dias.length !== 0) {
                        temPendencia = true;
                        cliente.laPendentes130 = laPendentes.vence130dias;
                    };
                }
            )

        await verificaCadCred(cliente.id)
            .then(
                (ccPendentes) => {
                    if (ccPendentes.vence15dias.length !== 0) {
                        temPendencia = true;
                        cliente.ccPendentes15 = ccPendentes.vence15dias;
                    };
                    if (ccPendentes.vence30dias.length !== 0) {
                        temPendencia = true;
                        cliente.ccPendentes30 = ccPendentes.vence30dias;
                    };
                    if (ccPendentes.vence130dias.length !== 0) {
                        temPendencia = true;
                        cliente.ccPendentes130 = ccPendentes.vence130dias;
                    };
                }
            )

        if (temPendencia) {
            clientesComPendencias.push(cliente);
        }
    }

    return clientesComPendencias;

};

async function verificaOutorga(idCliente) {
    const outorgasPendentes = {
        vence15dias: [],
        vence30dias: []
    };

    await db.collection('outorga').where('clienteId', '==', idCliente).get()
        .then((snapshot) => {
            snapshot.forEach((outorga) => {
                dtVencimento = new Date(outorga.data()['dataDeVencimento']);
                dtHoje = new Date();
                diasDiferenca = Math.floor((dtVencimento - dtHoje) / (1000 * 3600 * 24));
                if (diasDiferenca == 15) {
                    outorgasPendentes.vence15dias.push(outorga.data());
                } else if (diasDiferenca == 30) {
                    outorgasPendentes.vence30dias.push(outorga.data());
                }
            });
        })
        .catch((err) => {
            console.log('Error getting documents', err);
        })

    return outorgasPendentes;
};

async function verificaDecAmb(idCliente) {
    const decAmbPendentes = {
        vence15dias: [],
        vence30dias: []
    };

    await db.collection('DeclaracaoAmbiental').where('clienteId', '==', idCliente).get()
        .then((snapshot) => {
            snapshot.forEach((decAmb) => {
                dtVencimento = new Date(decAmb.data()['dataDeVencimento']);
                dtHoje = new Date();
                diasDiferenca = Math.floor((dtVencimento - dtHoje) / (1000 * 3600 * 24));
                if (diasDiferenca == 15) {
                    decAmbPendentes.vence15dias.push(decAmb.data());
                } else if (diasDiferenca == 30) {
                    decAmbPendentes.vence30dias.push(decAmb.data());
                }
            });
        })
        .catch((err) => {
            console.log('Error getting documents', err);
        })

    return decAmbPendentes;
};

async function verificaLicAmb(idCliente) {
    const decLicPendentes = {
        vence15dias: [],
        vence60dias: [],
        vence130dias: []
    };

    await db.collection('LicencaAmbiental').where('clienteId', '==', idCliente).get()
        .then((snapshot) => {
            snapshot.forEach((licAmb) => {
                dtVencimento = new Date(licAmb.data()['dataDeVencimento']);
                dtHoje = new Date();
                diasDiferenca = Math.floor((dtVencimento - dtHoje) / (1000 * 3600 * 24));
                if (diasDiferenca == 15) {
                    decLicPendentes.vence15dias.push(licAmb.data());
                } else if (diasDiferenca == 60) {
                    decLicPendentes.vence60dias.push(licAmb.data());
                } else if (diasDiferenca == 130) {
                    decLicPendentes.vence60dias.push(licAmb.data());
                }
            });
        })
        .catch((err) => {
            console.log('Error getting documents', err);
        })

    return decLicPendentes;
};

async function verificaCadCred(idCliente) {
    const cadCredPendentes = {
        vence15dias: [],
        vence30dias: [],
        vence130dias: []
    };

    await db.collection('cadastroCredito').where('clienteId', '==', idCliente).get()
        .then((snapshot) => {
            snapshot.forEach((cadCred) => {
                dtVencimento = new Date(cadCred.data()['dataExpiracaoCredito']);
                dtHoje = new Date();
                diasDiferenca = Math.floor((dtVencimento - dtHoje) / (1000 * 3600 * 24));
                if (diasDiferenca == 15) {
                    cadCredPendentes.vence15dias.push(cadCred.data());
                } else if (diasDiferenca == 30) {
                    cadCredPendentes.vence30dias.push(cadCred.data());
                } else if (diasDiferenca == 130) {
                    cadCredPendentes.vence130dias.push(cadCred.data());
                }
            });
        })
        .catch((err) => {
            console.log('Error getting documents', err);
        })

    return cadCredPendentes;
};

module.exports = { obtemDados, obtemClientesComPendencias };