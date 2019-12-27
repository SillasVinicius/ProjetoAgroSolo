import * as tslib_1 from "tslib";
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { UsuarioService } from 'src/app/core/services/usuario.service';
var ListaClienteItemComponent = /** @class */ (function () {
    function ListaClienteItemComponent(usuarioService) {
        this.usuarioService = usuarioService;
        this.clicado = false;
        this.admin = false;
        this.update = new EventEmitter();
        this.delete = new EventEmitter();
    }
    ListaClienteItemComponent.prototype.ngOnInit = function () {
        this.clicado = false;
        if (this.usuarioService.admin) {
            this.admin = true;
        }
        else {
            this.admin = false;
        }
    };
    ListaClienteItemComponent.prototype.abrir = function () {
        this.clicado = true;
    };
    ListaClienteItemComponent.prototype.fechar = function () {
        this.clicado = false;
    };
    tslib_1.__decorate([
        Input(),
        tslib_1.__metadata("design:type", Object)
    ], ListaClienteItemComponent.prototype, "cliente", void 0);
    tslib_1.__decorate([
        Output(),
        tslib_1.__metadata("design:type", Object)
    ], ListaClienteItemComponent.prototype, "update", void 0);
    tslib_1.__decorate([
        Output(),
        tslib_1.__metadata("design:type", Object)
    ], ListaClienteItemComponent.prototype, "delete", void 0);
    ListaClienteItemComponent = tslib_1.__decorate([
        Component({
            selector: 'app-lista-cliente-item',
            templateUrl: './lista-cliente-item.component.html',
            styleUrls: ['./lista-cliente-item.component.scss']
        }),
        tslib_1.__metadata("design:paramtypes", [UsuarioService])
    ], ListaClienteItemComponent);
    return ListaClienteItemComponent;
}());
export { ListaClienteItemComponent };
//# sourceMappingURL=lista-cliente-item.component.js.map