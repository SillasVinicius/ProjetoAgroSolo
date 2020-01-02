var Firestore = /** @class */ (function () {
    function Firestore(db) {
        this.db = db;
        this.id = '';
        this.logado = false;
        this.nomeUser = '';
        this.urlFoto = '...';
        this.admin = false;
    }
    Firestore.prototype.setCollection = function (path, queryFn) {
        this.collection = path ? this.db.collection(path, queryFn) : null;
    };
    Firestore.prototype.setItem = function (item, operation) {
        return this.collection
            .doc(item.id)[operation](item)
            .then(function () { return item; });
    };
    Firestore.prototype.getAll = function () {
        return this.collection.valueChanges();
    };
    Firestore.prototype.get = function (id) {
        return this.collection.doc(id).valueChanges();
    };
    Firestore.prototype.loginDb = function (email, senha) {
        this.setCollection('/users', function (ref) {
            return ref.where('email', '==', email).where('senha', '==', senha);
        });
        return this.getAll();
    };
    Firestore.prototype.setId = function (id) {
        this.id = id;
    };
    Firestore.prototype.create = function (item) {
        item.id = this.db.createId();
        this.setId(item.id);
        return this.setItem(item, 'set');
    };
    Firestore.prototype.createGlobal = function (item, id) {
        item.id = id;
        this.setId(item.id);
        return this.setItem(item, 'set');
    };
    Firestore.prototype.update = function (item) {
        return this.setItem(item, 'update');
    };
    Firestore.prototype.delete = function (item) {
        return this.collection.doc(item.id).delete();
    };
    return Firestore;
}());
export { Firestore };
//# sourceMappingURL=firestore.js.map