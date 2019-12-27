import * as tslib_1 from "tslib";
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedModule } from 'src/app/shared/shared.module';
import { CriaLaPage } from './cria-la.page';
var routes = [
    {
        path: '',
        component: CriaLaPage
    }
];
var CriaLaPageModule = /** @class */ (function () {
    function CriaLaPageModule() {
    }
    CriaLaPageModule = tslib_1.__decorate([
        NgModule({
            imports: [SharedModule, RouterModule.forChild(routes)],
            declarations: [CriaLaPage]
        })
    ], CriaLaPageModule);
    return CriaLaPageModule;
}());
export { CriaLaPageModule };
//# sourceMappingURL=cria-la.module.js.map