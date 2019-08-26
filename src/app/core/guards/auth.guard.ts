import { Injectable } from '@angular/core';
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Router,
  CanActivateChild,
  CanLoad,
  Route,
  UrlSegment
} from '@angular/router';
import { UsuarioService } from '../services/usuario.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate, CanActivateChild, CanLoad {
  canLoad(route: Route, segments: UrlSegment[]): boolean {
    const url = segments.map(s => `/${s}`).join('');
    return this.estadoDeAutenticacao(url);
  }
  canActivateChild(childRoute: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    return this.canActivate(childRoute, state);
  }
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    return this.estadoDeAutenticacao(state.url);
  }

  constructor(private usuarioService: UsuarioService, private router: Router) {}

  private estadoDeAutenticacao(redirectt: string): boolean {
    if (!this.usuarioService.logado) {
      this.router.navigate(['/login'], {
        queryParams: { redirect: redirectt }
      });
      return false;
    } else {
      return true;
    }
  }
}
