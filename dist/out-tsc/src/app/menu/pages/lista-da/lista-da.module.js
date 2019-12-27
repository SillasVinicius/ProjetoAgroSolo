import * as tslib_1 from "tslib";
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../../../shared/shared.module';
import { ComponentsModule } from '../../component/components.module';
import { ListaDAPage } from './lista-da.page';
var routes = [
    {
        path: '',
        component: ListaDAPage
    }
];
var ListaDAPageModule = /** @class */ (function () {
    function ListaDAPageModule() {
    }
    ListaDAPageModule = tslib_1.__decorate([
        NgModule({
            imports: [SharedModule, ComponentsModule, RouterModule.forChild(routes)],
            declarations: [ListaDAPage]
        })
    ], ListaDAPageModule);
    return ListaDAPageModule;
}());
export { ListaDAPageModule };
//# sourceMappingURL=lista-da.module.js.map