import * as tslib_1 from "tslib";
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedModule } from 'src/app/shared/shared.module';
import { AlteraUsuarioPage } from './altera-usuario.page';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrMaskerModule } from 'br-mask';
var routes = [
    {
        path: '',
        component: AlteraUsuarioPage
    }
];
var AlteraUsuarioPageModule = /** @class */ (function () {
    function AlteraUsuarioPageModule() {
    }
    AlteraUsuarioPageModule = tslib_1.__decorate([
        NgModule({
            imports: [SharedModule, RouterModule.forChild(routes), FormsModule, ReactiveFormsModule, BrMaskerModule],
            declarations: [AlteraUsuarioPage]
        })
    ], AlteraUsuarioPageModule);
    return AlteraUsuarioPageModule;
}());
export { AlteraUsuarioPageModule };
//# sourceMappingURL=altera-usuario.module.js.map