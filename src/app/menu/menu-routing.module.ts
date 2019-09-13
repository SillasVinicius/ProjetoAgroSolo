import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from '../core/guards/auth.guard';

const routes: Routes = [
  {
    path: '',
    canActivateChild: [AuthGuard],
    children: [
      {
        path: 'cadastroCliente',
        loadChildren: './pages/cria-cliente/cria-cliente.module#CriaClientePageModule'
      },
      {
        path: 'cadastroOutorga',
        loadChildren: './pages/cria-outorga/cria-outorga.module#CriaOutorgaPageModule'
      },
      {
        path: 'updateCliente/:id',
        loadChildren: './pages/cria-cliente/cria-cliente.module#CriaClientePageModule'
      },
      {
        path: 'updateUsuario/:id',
        loadChildren: './pages/altera-usuario/altera-usuario.module#AlteraUsuarioPageModule'
      },
      // {
      //   path: 'updateUsuario',
      //   loadChildren: './pages/altera-usuario/altera-usuario.module#AlteraUsuarioPageModule'
      // },
      {
        path: 'cliente',
        loadChildren: './pages/lista-cliente/lista-cliente.module#ListaClientePageModule'
      },
      {
        path: 'outorga',
        loadChildren: './pages/lista-outorga/lista-outorga.module#ListaOutorgaPageModule'
      },
      {
        path: 'ambiental',
        loadChildren: './ambiental-routing.module#AmbientalRoutingModule'
      },
      {
        path: '',
        loadChildren: './pages/home/home.module#HomePageModule'
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MenuRoutingModule {}
