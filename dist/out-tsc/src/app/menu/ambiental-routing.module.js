import * as tslib_1 from "tslib";
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AuthGuard } from '../core/guards/auth.guard';
var routes = [
    {
        path: '',
        canActivateChild: [AuthGuard],
        children: [
            {
                path: 'CadastroDeclaracaoAmbiental',
                loadChildren: './pages/cria-da/cria-da.module#CriaDaPageModule'
            },
            {
                path: 'UpdateDeclaracaoAmbiental/:id',
                loadChildren: './pages/cria-da/cria-da.module#CriaDaPageModule'
            },
            {
                path: 'CadastroLicencaAmbiental',
                loadChildren: './pages/cria-la/cria-la.module#CriaLaPageModule'
            },
            {
                path: 'UpdateLicencaAmbiental/:id',
                loadChildren: './pages/cria-la/cria-la.module#CriaLaPageModule'
            },
            {
                path: 'UpdateCadastroAmbientalRural/:id',
                loadChildren: './pages/cria-car/cria-car.module#CriaCarPageModule'
            },
            {
                path: 'AddCadastroAmbientalRural',
                loadChildren: './pages/cria-car/cria-car.module#CriaCarPageModule'
            },
            {
                path: 'DeclaracaoAmbiental',
                loadChildren: './pages/lista-da/lista-da.module#ListaDAPageModule'
            },
            {
                path: 'LicencaAmbiental',
                loadChildren: './pages/lista-la/lista-la.module#ListaLAPageModule'
            },
            {
                path: 'CadastroAmbientalRural',
                loadChildren: './pages/lista-car/lista-car.module#ListaCARPageModule'
            },
            {
                path: '',
                loadChildren: './pages/home-ambiental/home-ambiental.module#HomeAmbientalPageModule'
            }
        ]
    }
];
var AmbientalRoutingModule = /** @class */ (function () {
    function AmbientalRoutingModule() {
    }
    AmbientalRoutingModule = tslib_1.__decorate([
        NgModule({
            imports: [RouterModule.forChild(routes)],
            exports: [RouterModule]
        })
    ], AmbientalRoutingModule);
    return AmbientalRoutingModule;
}());
export { AmbientalRoutingModule };
//# sourceMappingURL=ambiental-routing.module.js.map