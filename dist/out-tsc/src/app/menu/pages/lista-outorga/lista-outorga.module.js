import * as tslib_1 from "tslib";
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../../../shared/shared.module';
import { ListaOutorgaPage } from './lista-outorga.page';
import { ComponentsModule } from '../../component/components.module';
var routes = [
    {
        path: '',
        component: ListaOutorgaPage
    }
];
var ListaOutorgaPageModule = /** @class */ (function () {
    function ListaOutorgaPageModule() {
    }
    ListaOutorgaPageModule = tslib_1.__decorate([
        NgModule({
            imports: [
                SharedModule, ComponentsModule, RouterModule.forChild(routes)
            ],
            declarations: [ListaOutorgaPage]
        })
    ], ListaOutorgaPageModule);
    return ListaOutorgaPageModule;
}());
export { ListaOutorgaPageModule };
//# sourceMappingURL=lista-outorga.module.js.map