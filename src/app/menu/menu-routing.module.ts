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
        path: 'updateCliente/:id',
        loadChildren: './pages/cria-cliente/cria-cliente.module#CriaClientePageModule'
      },
      {
        path: 'cliente',
        loadChildren: './pages/lista-cliente/lista-cliente.module#ListaClientePageModule'
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
