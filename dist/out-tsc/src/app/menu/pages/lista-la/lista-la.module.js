import * as tslib_1 from "tslib";
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../../../shared/shared.module';
import { ComponentsModule } from '../../component/components.module';
import { ListaLAPage } from './lista-la.page';
var routes = [
    {
        path: '',
        component: ListaLAPage
    }
];
var ListaLAPageModule = /** @class */ (function () {
    function ListaLAPageModule() {
    }
    ListaLAPageModule = tslib_1.__decorate([
        NgModule({
            imports: [SharedModule, ComponentsModule, RouterModule.forChild(routes)],
            declarations: [ListaLAPage]
        })
    ], ListaLAPageModule);
    return ListaLAPageModule;
}());
export { ListaLAPageModule };
//# sourceMappingURL=lista-la.module.js.map