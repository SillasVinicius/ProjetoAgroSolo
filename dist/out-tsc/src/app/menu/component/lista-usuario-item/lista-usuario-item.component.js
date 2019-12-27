import * as tslib_1 from "tslib";
import { Component, Input, Output, EventEmitter } from '@angular/core';
var ListaUsuarioItemComponent = /** @class */ (function () {
    function ListaUsuarioItemComponent() {
        this.clicado = false;
        this.update = new EventEmitter();
        this.delete = new EventEmitter();
    }
    ListaUsuarioItemComponent.prototype.ngOnInit = function () {
        this.clicado = false;
    };
    ListaUsuarioItemComponent.prototype.abrir = function () {
        this.clicado = true;
    };
    ListaUsuarioItemComponent.prototype.fechar = function () {
        this.clicado = false;
    };
    tslib_1.__decorate([
        Input(),
        tslib_1.__metadata("design:type", Object)
    ], ListaUsuarioItemComponent.prototype, "usuario", void 0);
    tslib_1.__decorate([
        Output(),
        tslib_1.__metadata("design:type", Object)
    ], ListaUsuarioItemComponent.prototype, "update", void 0);
    tslib_1.__decorate([
        Output(),
        tslib_1.__metadata("design:type", Object)
    ], ListaUsuarioItemComponent.prototype, "delete", void 0);
    ListaUsuarioItemComponent = tslib_1.__decorate([
        Component({
            selector: 'app-lista-usuario-item',
            templateUrl: './lista-usuario-item.component.html',
            styleUrls: ['./lista-usuario-item.component.scss'],
        })
    ], ListaUsuarioItemComponent);
    return ListaUsuarioItemComponent;
}());
export { ListaUsuarioItemComponent };
//# sourceMappingURL=lista-usuario-item.component.js.map