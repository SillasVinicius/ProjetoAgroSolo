import * as tslib_1 from "tslib";
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CriaUsuarioPage } from './cria-usuario.page';
import { SharedModule } from 'src/app/shared/shared.module';
import { BrMaskerModule } from 'br-mask';
var routes = [
    {
        path: '',
        component: CriaUsuarioPage
    }
];
var CriaUsuarioPageModule = /** @class */ (function () {
    function CriaUsuarioPageModule() {
    }
    CriaUsuarioPageModule = tslib_1.__decorate([
        NgModule({
            imports: [SharedModule, RouterModule.forChild(routes), BrMaskerModule],
            declarations: [CriaUsuarioPage]
        })
    ], CriaUsuarioPageModule);
    return CriaUsuarioPageModule;
}());
export { CriaUsuarioPageModule };
//# sourceMappingURL=cria-usuario.module.js.map