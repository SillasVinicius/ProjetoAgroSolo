import * as tslib_1 from "tslib";
import { Injectable } from '@angular/core';
import { Firestore } from '../classes/firestore';
import { AngularFirestore } from '@angular/fire/firestore';
import { UsuarioService } from './usuario.service';
var NotificacaoService = /** @class */ (function (_super) {
    tslib_1.__extends(NotificacaoService, _super);
    function NotificacaoService(db, usuarioService) {
        var _this = _super.call(this, db) || this;
        _this.usuarioService = usuarioService;
        _this.init();
        _this.usuarioId = _this.usuarioService.id;
        return _this;
    }
    NotificacaoService.prototype.init = function () {
        this.setCollection("/users/" + this.usuarioService.id + "/notificacao");
    };
    NotificacaoService.prototype.criarId = function () {
        return this.db.createId();
    };
    NotificacaoService = tslib_1.__decorate([
        Injectable({
            providedIn: 'root'
        }),
        tslib_1.__metadata("design:paramtypes", [AngularFirestore, UsuarioService])
    ], NotificacaoService);
    return NotificacaoService;
}(Firestore));
export { NotificacaoService };
//# sourceMappingURL=notificacao.service.js.map