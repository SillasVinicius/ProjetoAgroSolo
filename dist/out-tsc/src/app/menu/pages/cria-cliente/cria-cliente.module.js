import * as tslib_1 from "tslib";
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CriaClientePage } from './cria-cliente.page';
import { SharedModule } from 'src/app/shared/shared.module';
import { BrMaskerModule } from 'br-mask';
var routes = [
    {
        path: '',
        component: CriaClientePage
    }
];
var CriaClientePageModule = /** @class */ (function () {
    function CriaClientePageModule() {
    }
    CriaClientePageModule = tslib_1.__decorate([
        NgModule({
            imports: [SharedModule, RouterModule.forChild(routes), BrMaskerModule],
            declarations: [CriaClientePage]
        })
    ], CriaClientePageModule);
    return CriaClientePageModule;
}());
export { CriaClientePageModule };
//# sourceMappingURL=cria-cliente.module.js.map