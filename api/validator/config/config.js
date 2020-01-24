
const admin = require("firebase-admin");
const serviceAccount = require("./serviceAccountKey.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://agrosolo-34e94.firebaseio.com"
});

exports.db = admin.firestore();

exports.urlBase = async function () {
  const db = admin.firestore();
  let urlBase;
  await db.collection('parametrizacoes').doc('geral').get()
    .then(
      (doc) => {
        urlBase = doc.data()['urlApiEmail'];
      }
    )
  return urlBase;
}

exports.emailsAdmins = async function () {
  const db = admin.firestore();
  let emails = '';
  await db.collection('users').get()
    .then(
      (snapshot) => {
        snapshot.forEach(
          (doc) => {
            emails += doc.data()['email'] + ',';
          }
        )
      }
    )
  return emails;
}

exports.envioRelatorio = async function() {
  const db = admin.firestore();
  let relatorio = new Object();
  await db.collection('parametrizacoes').doc('geral').get()
    .then(
      (doc) => {
        relatorio.hrEnvioRelatorio = doc.data()['hrEnvioRelatorio'];
        relatorio.hrUltimoRelatorio = doc.data()['hrUltimoRelatorio'];
        relatorio.hrUltimaValidClientes = doc.data()['hrUltimaValidClientes'];

        diaSem = new Date().getDay()
        relatorio.execRelHoje = doc.data()['diasExecRel'][diaSem] === '1';
      }
    )
  return relatorio;
}

exports.atualizaHoraUltimoRelatorio = async function() {
  const db = admin.firestore();
  const configRef = db.collection('parametrizacoes').doc('geral');
  configRef.update({hrUltimoRelatorio: new Date().toISOString() });
}

exports.atualizaHoraUltimaValidClientes = async function() {
  const db = admin.firestore();
  const configRef = db.collection('parametrizacoes').doc('geral');
  configRef.update({hrUltimaValidClientes: new Date().toISOString() });
}