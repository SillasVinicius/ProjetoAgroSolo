import * as tslib_1 from "tslib";
import { Injectable } from '@angular/core';
import { Firestore } from '../classes/firestore';
import { AngularFirestore } from '@angular/fire/firestore';
import { UsuarioService } from './usuario.service';
var DaService = /** @class */ (function (_super) {
    tslib_1.__extends(DaService, _super);
    function DaService(db, usuarioService) {
        var _this = _super.call(this, db) || this;
        _this.usuarioService = usuarioService;
        _this.init();
        _this.usuarioId = _this.usuarioService.id;
        return _this;
    }
    DaService.prototype.init = function () {
        this.setCollection("/users/" + this.usuarioService.id + "/DeclaracaoAmbiental", function (ref) { return ref.orderBy('dataDeVencimento', 'desc'); });
    };
    DaService.prototype.initDA = function () {
        this.setCollection('/DeclaracaoAmbiental');
    };
    DaService.prototype.setCollectionArquivo = function (da) {
        this.setCollection("/users/" + this.usuarioId + "/DeclaracaoAmbiental/" + da + "/arquivos");
    };
    DaService.prototype.criarId = function () {
        return this.db.createId();
    };
    DaService = tslib_1.__decorate([
        Injectable({
            providedIn: 'root'
        }),
        tslib_1.__metadata("design:paramtypes", [AngularFirestore, UsuarioService])
    ], DaService);
    return DaService;
}(Firestore));
export { DaService };
//# sourceMappingURL=da.service.js.map