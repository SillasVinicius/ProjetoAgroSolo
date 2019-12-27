import * as tslib_1 from "tslib";
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedModule } from 'src/app/shared/shared.module';
import { CriaCarPage } from './cria-car.page';
var routes = [
    {
        path: '',
        component: CriaCarPage
    }
];
var CriaCarPageModule = /** @class */ (function () {
    function CriaCarPageModule() {
    }
    CriaCarPageModule = tslib_1.__decorate([
        NgModule({
            imports: [SharedModule, RouterModule.forChild(routes)],
            declarations: [CriaCarPage]
        })
    ], CriaCarPageModule);
    return CriaCarPageModule;
}());
export { CriaCarPageModule };
//# sourceMappingURL=cria-car.module.js.map