import * as tslib_1 from "tslib";
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedModule } from 'src/app/shared/shared.module';
import { DadosPessoaisPage } from './dados-pessoais.page';
var routes = [
    {
        path: '',
        component: DadosPessoaisPage
    }
];
var DadosPessoaisPageModule = /** @class */ (function () {
    function DadosPessoaisPageModule() {
    }
    DadosPessoaisPageModule = tslib_1.__decorate([
        NgModule({
            imports: [SharedModule, RouterModule.forChild(routes)],
            declarations: [DadosPessoaisPage]
        })
    ], DadosPessoaisPageModule);
    return DadosPessoaisPageModule;
}());
export { DadosPessoaisPageModule };
//# sourceMappingURL=dados-pessoais.module.js.map