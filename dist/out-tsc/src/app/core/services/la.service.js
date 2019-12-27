import * as tslib_1 from "tslib";
import { Injectable } from '@angular/core';
import { Firestore } from '../classes/firestore';
import { AngularFirestore } from '@angular/fire/firestore';
import { UsuarioService } from './usuario.service';
var LaService = /** @class */ (function (_super) {
    tslib_1.__extends(LaService, _super);
    function LaService(db, usuarioService) {
        var _this = _super.call(this, db) || this;
        _this.usuarioService = usuarioService;
        _this.init();
        _this.usuarioId = _this.usuarioService.id;
        return _this;
    }
    LaService.prototype.init = function () {
        this.setCollection("/users/" + this.usuarioService.id + "/LicencaAmbiental", function (ref) { return ref.orderBy('dataDeVencimento', 'desc'); });
    };
    LaService.prototype.initLA = function () {
        this.setCollection('/LicencaAmbiental');
    };
    LaService.prototype.setCollectionArquivo = function (la) {
        this.setCollection("/users/" + this.usuarioId + "/LicencaAmbiental/" + la + "/arquivos");
    };
    LaService.prototype.criarId = function () {
        return this.db.createId();
    };
    LaService = tslib_1.__decorate([
        Injectable({
            providedIn: 'root'
        }),
        tslib_1.__metadata("design:paramtypes", [AngularFirestore, UsuarioService])
    ], LaService);
    return LaService;
}(Firestore));
export { LaService };
//# sourceMappingURL=la.service.js.map