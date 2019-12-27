import * as tslib_1 from "tslib";
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedModule } from 'src/app/shared/shared.module';
import { CriaOutorgaPage } from './cria-outorga.page';
var routes = [
    {
        path: '',
        component: CriaOutorgaPage
    }
];
var CriaOutorgaPageModule = /** @class */ (function () {
    function CriaOutorgaPageModule() {
    }
    CriaOutorgaPageModule = tslib_1.__decorate([
        NgModule({
            imports: [SharedModule, RouterModule.forChild(routes)],
            declarations: [CriaOutorgaPage]
        })
    ], CriaOutorgaPageModule);
    return CriaOutorgaPageModule;
}());
export { CriaOutorgaPageModule };
//# sourceMappingURL=cria-outorga.module.js.map