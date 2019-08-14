import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  {
    path: '',
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
        path: '',
        loadChildren: './pages/lista-cliente/lista-cliente.module#ListaClientePageModule'
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MenuRoutingModule {}
