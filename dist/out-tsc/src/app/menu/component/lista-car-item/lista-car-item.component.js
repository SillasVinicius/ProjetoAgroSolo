import * as tslib_1 from "tslib";
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';
import { UsuarioService } from 'src/app/core/services/usuario.service';
var ListaCarItemComponent = /** @class */ (function () {
    function ListaCarItemComponent(iab, usuarioService) {
        this.iab = iab;
        this.usuarioService = usuarioService;
        this.clicado = false;
        this.admin = false;
        this.update = new EventEmitter();
        this.delete = new EventEmitter();
    }
    ListaCarItemComponent.prototype.openLink = function () {
        this.iab.create("" + this.cadastroAmbientalRural.arquivo, "_system");
    };
    ListaCarItemComponent.prototype.ngOnInit = function () {
        this.clicado = false;
        if (this.usuarioService.admin) {
            this.admin = true;
        }
        else {
            this.admin = false;
        }
    };
    ListaCarItemComponent.prototype.abrir = function () {
        this.clicado = true;
    };
    ListaCarItemComponent.prototype.fechar = function () {
        this.clicado = false;
    };
    tslib_1.__decorate([
        Input(),
        tslib_1.__metadata("design:type", Object)
    ], ListaCarItemComponent.prototype, "cadastroAmbientalRural", void 0);
    tslib_1.__decorate([
        Output(),
        tslib_1.__metadata("design:type", Object)
    ], ListaCarItemComponent.prototype, "update", void 0);
    tslib_1.__decorate([
        Output(),
        tslib_1.__metadata("design:type", Object)
    ], ListaCarItemComponent.prototype, "delete", void 0);
    ListaCarItemComponent = tslib_1.__decorate([
        Component({
            selector: 'app-lista-car-item',
            templateUrl: './lista-car-item.component.html',
            styleUrls: ['./lista-car-item.component.scss'],
        }),
        tslib_1.__metadata("design:paramtypes", [InAppBrowser, UsuarioService])
    ], ListaCarItemComponent);
    return ListaCarItemComponent;
}());
export { ListaCarItemComponent };
//# sourceMappingURL=lista-car-item.component.js.map