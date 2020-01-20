const config = require('./config');

const db = config.db;

let clientes = new Map();
let outorga = [];

db.collection('cliente').get()
    .then((snapshot) => {
        snapshot.forEach((doc) => {
            clientes.set(doc.id, doc.data());
        });
        // console.log(clientes);
    })
    .catch((err) => {
        console.log('Error getting documents', err);
    })

db.collection('outorga').get()
    .then((snapshot) => {
        snapshot.forEach((doc) => {
            outorga.push(doc.data());
        });
        console.log(outorga);
    })
    .catch((err) => {
        console.log('Error getting documents', err);
    })

