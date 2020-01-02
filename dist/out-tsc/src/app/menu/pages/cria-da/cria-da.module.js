import * as tslib_1 from "tslib";
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedModule } from 'src/app/shared/shared.module';
import { CriaDaPage } from './cria-da.page';
var routes = [
    {
        path: '',
        component: CriaDaPage
    }
];
var CriaDaPageModule = /** @class */ (function () {
    function CriaDaPageModule() {
    }
    CriaDaPageModule = tslib_1.__decorate([
        NgModule({
            imports: [SharedModule, RouterModule.forChild(routes)],
            declarations: [CriaDaPage]
        })
    ], CriaDaPageModule);
    return CriaDaPageModule;
}());
export { CriaDaPageModule };
//# sourceMappingURL=cria-da.module.js.map