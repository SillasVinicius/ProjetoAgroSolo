import * as tslib_1 from "tslib";
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ListaUsuarioPage } from './lista-usuario.page';
import { SharedModule } from 'src/app/shared/shared.module';
import { ComponentsModule } from '../../component/components.module';
var routes = [
    {
        path: '',
        component: ListaUsuarioPage
    }
];
var ListaUsuarioPageModule = /** @class */ (function () {
    function ListaUsuarioPageModule() {
    }
    ListaUsuarioPageModule = tslib_1.__decorate([
        NgModule({
            imports: [SharedModule, ComponentsModule, RouterModule.forChild(routes)],
            declarations: [ListaUsuarioPage]
        })
    ], ListaUsuarioPageModule);
    return ListaUsuarioPageModule;
}());
export { ListaUsuarioPageModule };
//# sourceMappingURL=lista-usuario.module.js.map