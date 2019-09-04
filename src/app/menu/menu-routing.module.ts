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
        path: 'cliente',
        loadChildren: './pages/lista-cliente/lista-cliente.module#ListaClientePageModule'
      },
      {
        path: 'outorga',
        loadChildren: './pages/lista-outorga/lista-outorga.module#ListaOutorgaPageModule'
      },
      {
        path: '',
        loadChildren: './pages/home/home.module#HomePageModule'
      }
    ]
  },
  { path: 'cria-outorga', loadChildren: './pages/cria-outorga/cria-outorga.module#CriaOutorgaPageModule' }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MenuRoutingModule {}
