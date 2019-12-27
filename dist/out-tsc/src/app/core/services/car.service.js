import * as tslib_1 from "tslib";
import { Injectable } from '@angular/core';
import { Firestore } from '../classes/firestore';
import { AngularFirestore } from '@angular/fire/firestore';
import { UsuarioService } from './usuario.service';
var CarService = /** @class */ (function (_super) {
    tslib_1.__extends(CarService, _super);
    function CarService(db, usuarioService) {
        var _this = _super.call(this, db) || this;
        _this.usuarioService = usuarioService;
        _this.init();
        _this.usuarioId = _this.usuarioService.id;
        return _this;
    }
    CarService.prototype.init = function () {
        this.setCollection("/users/" + this.usuarioService.id + "/CadastroAmbientalRural");
    };
    CarService.prototype.initCAR = function () {
        this.setCollection("/CadastroAmbientalRural");
    };
    CarService.prototype.setCollectionArquivo = function (la) {
        this.setCollection("/users/" + this.usuarioId + "/CadastroAmbientalRural/" + la + "/arquivos");
    };
    CarService.prototype.criarId = function () {
        return this.db.createId();
    };
    CarService = tslib_1.__decorate([
        Injectable({
            providedIn: 'root'
        }),
        tslib_1.__metadata("design:paramtypes", [AngularFirestore, UsuarioService])
    ], CarService);
    return CarService;
}(Firestore));
export { CarService };
//# sourceMappingURL=car.service.js.map