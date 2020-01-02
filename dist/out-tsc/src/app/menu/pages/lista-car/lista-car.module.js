import * as tslib_1 from "tslib";
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../../../shared/shared.module';
import { ComponentsModule } from '../../component/components.module';
import { ListaCARPage } from './lista-car.page';
var routes = [
    {
        path: '',
        component: ListaCARPage
    }
];
var ListaCARPageModule = /** @class */ (function () {
    function ListaCARPageModule() {
    }
    ListaCARPageModule = tslib_1.__decorate([
        NgModule({
            imports: [SharedModule, ComponentsModule, RouterModule.forChild(routes)],
            declarations: [ListaCARPage]
        })
    ], ListaCARPageModule);
    return ListaCARPageModule;
}());
export { ListaCARPageModule };
//# sourceMappingURL=lista-car.module.js.map