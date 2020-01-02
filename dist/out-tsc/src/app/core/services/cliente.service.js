import * as tslib_1 from "tslib";
import { Injectable } from '@angular/core';
import { Firestore } from '../classes/firestore';
import { AngularFirestore } from '@angular/fire/firestore';
import { UsuarioService } from './usuario.service';
var ClienteService = /** @class */ (function (_super) {
    tslib_1.__extends(ClienteService, _super);
    function ClienteService(db, usuarioService) {
        var _this = _super.call(this, db) || this;
        _this.usuarioService = usuarioService;
        _this.init();
        _this.usuarioId = _this.usuarioService.id;
        return _this;
    }
    ClienteService.prototype.init = function () {
        this.setCollection("/users/" + this.usuarioService.id + "/cliente");
    };
    ClienteService.prototype.initCliente = function () {
        this.setCollection("/cliente");
    };
    ClienteService.prototype.setCollectionFoto = function (cliente) {
        this.setCollection("/users/" + this.usuarioId + "/cliente/" + cliente + "/imagens");
    };
    ClienteService.prototype.setCollectionArquivo = function (cliente) {
        this.setCollection("/users/" + this.usuarioId + "/cliente/" + cliente + "/arquivos");
    };
    ClienteService.prototype.criarId = function () {
        return this.db.createId();
    };
    ClienteService = tslib_1.__decorate([
        Injectable({
            providedIn: 'root'
        }),
        tslib_1.__metadata("design:paramtypes", [AngularFirestore, UsuarioService])
    ], ClienteService);
    return ClienteService;
}(Firestore));
export { ClienteService };
//# sourceMappingURL=cliente.service.js.map