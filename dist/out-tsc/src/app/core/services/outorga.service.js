import * as tslib_1 from "tslib";
import { Injectable } from '@angular/core';
import { Firestore } from '../classes/firestore';
import { AngularFirestore } from '@angular/fire/firestore';
import { UsuarioService } from './usuario.service';
var OutorgaService = /** @class */ (function (_super) {
    tslib_1.__extends(OutorgaService, _super);
    function OutorgaService(db, usuarioService) {
        var _this = _super.call(this, db) || this;
        _this.usuarioService = usuarioService;
        _this.init();
        _this.usuarioId = _this.usuarioService.id;
        return _this;
    }
    OutorgaService.prototype.init = function () {
        this.setCollection("/users/" + this.usuarioService.id + "/outorga", function (ref) { return ref.orderBy('dataDeVencimento', 'desc'); });
    };
    OutorgaService.prototype.initOutorga = function () {
        this.setCollection('/outorga');
    };
    OutorgaService.prototype.setCollectionArquivo = function (outorga) {
        this.setCollection("/users/" + this.usuarioId + "/outorga/" + outorga + "/arquivos");
    };
    OutorgaService.prototype.criarId = function () {
        return this.db.createId();
    };
    OutorgaService = tslib_1.__decorate([
        Injectable({
            providedIn: 'root'
        }),
        tslib_1.__metadata("design:paramtypes", [AngularFirestore, UsuarioService])
    ], OutorgaService);
    return OutorgaService;
}(Firestore));
export { OutorgaService };
//# sourceMappingURL=outorga.service.js.map