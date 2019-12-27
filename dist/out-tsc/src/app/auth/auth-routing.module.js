import * as tslib_1 from "tslib";
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
var routes = [
    { path: '', loadChildren: '../autentificacao/pages/login/login.module#LoginPageModule' }
];
var AuthRoutingModule = /** @class */ (function () {
    function AuthRoutingModule() {
    }
    AuthRoutingModule = tslib_1.__decorate([
        NgModule({
            imports: [RouterModule.forChild(routes)],
            exports: [RouterModule]
        })
    ], AuthRoutingModule);
    return AuthRoutingModule;
}());
export { AuthRoutingModule };
//# sourceMappingURL=auth-routing.module.js.map