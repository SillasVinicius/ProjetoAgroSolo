import * as tslib_1 from "tslib";
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ListaClientePage } from './lista-cliente.page';
import { SharedModule } from 'src/app/shared/shared.module';
import { ComponentsModule } from '../../component/components.module';
var routes = [
    {
        path: '',
        component: ListaClientePage
    }
];
var ListaClientePageModule = /** @class */ (function () {
    function ListaClientePageModule() {
    }
    ListaClientePageModule = tslib_1.__decorate([
        NgModule({
            imports: [SharedModule, ComponentsModule, RouterModule.forChild(routes)],
            declarations: [ListaClientePage]
        })
    ], ListaClientePageModule);
    return ListaClientePageModule;
}());
export { ListaClientePageModule };
//# sourceMappingURL=lista-cliente.module.js.map