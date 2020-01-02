import * as tslib_1 from "tslib";
import { Injectable } from '@angular/core';
import { Firestore } from '../classes/firestore';
import { AngularFirestore } from '@angular/fire/firestore';
var UsuarioService = /** @class */ (function (_super) {
    tslib_1.__extends(UsuarioService, _super);
    function UsuarioService(db) {
        var _this = _super.call(this, db) || this;
        _this.init();
        return _this;
    }
    UsuarioService.prototype.init = function () {
        this.setCollection('/users');
    };
    UsuarioService.prototype.initFiltro = function () {
        this.setCollection('/users', function (ref) { return ref.where('admin', "==", false); });
    };
    UsuarioService = tslib_1.__decorate([
        Injectable({
            providedIn: 'root'
        }),
        tslib_1.__metadata("design:paramtypes", [AngularFirestore])
    ], UsuarioService);
    return UsuarioService;
}(Firestore));
export { UsuarioService };
//# sourceMappingURL=usuario.service.js.map