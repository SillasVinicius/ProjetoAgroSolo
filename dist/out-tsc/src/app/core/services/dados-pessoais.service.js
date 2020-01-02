import * as tslib_1 from "tslib";
import { Injectable } from '@angular/core';
import { Firestore } from '../classes/firestore';
import { AngularFirestore } from '@angular/fire/firestore';
import { UsuarioService } from './usuario.service';
var DadosPessoaisService = /** @class */ (function (_super) {
    tslib_1.__extends(DadosPessoaisService, _super);
    function DadosPessoaisService(db, usuarioService) {
        var _this = _super.call(this, db) || this;
        _this.usuarioService = usuarioService;
        _this.init();
        _this.usuarioId = _this.usuarioService.id;
        return _this;
    }
    DadosPessoaisService.prototype.init = function () {
        this.setCollection("/users/" + this.usuarioService.id + "/dadosPessoais");
    };
    DadosPessoaisService.prototype.initImpostoDeRenda = function () {
        this.setCollection("/users/" + this.usuarioService.id + "/dadosPessoais/1/impostoDeRenda");
    };
    DadosPessoaisService.prototype.initCnh = function () {
        this.setCollection("/users/" + this.usuarioService.id + "/dadosPessoais/1/cnh");
    };
    DadosPessoaisService.prototype.criarId = function () {
        return this.db.createId();
    };
    DadosPessoaisService = tslib_1.__decorate([
        Injectable({
            providedIn: 'root'
        }),
        tslib_1.__metadata("design:paramtypes", [AngularFirestore, UsuarioService])
    ], DadosPessoaisService);
    return DadosPessoaisService;
}(Firestore));
export { DadosPessoaisService };
//# sourceMappingURL=dados-pessoais.service.js.map