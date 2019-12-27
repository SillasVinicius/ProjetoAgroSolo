import * as tslib_1 from "tslib";
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { UsuarioService } from '../services/usuario.service';
var AuthGuard = /** @class */ (function () {
    function AuthGuard(usuarioService, router) {
        this.usuarioService = usuarioService;
        this.router = router;
    }
    AuthGuard.prototype.canLoad = function (route, segments) {
        var url = segments.map(function (s) { return "/" + s; }).join('');
        return this.estadoDeAutenticacao(url);
    };
    AuthGuard.prototype.canActivateChild = function (childRoute, state) {
        return this.canActivate(childRoute, state);
    };
    AuthGuard.prototype.canActivate = function (route, state) {
        return this.estadoDeAutenticacao(state.url);
    };
    AuthGuard.prototype.estadoDeAutenticacao = function (redirectt) {
        if (!this.usuarioService.logado) {
            this.router.navigate(['/login'], {
                queryParams: { redirect: redirectt }
            });
            return false;
        }
        else {
            return true;
        }
    };
    AuthGuard = tslib_1.__decorate([
        Injectable({
            providedIn: 'root'
        }),
        tslib_1.__metadata("design:paramtypes", [UsuarioService, Router])
    ], AuthGuard);
    return AuthGuard;
}());
export { AuthGuard };
//# sourceMappingURL=auth.guard.js.map