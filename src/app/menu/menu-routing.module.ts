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
        path: 'cadastroUsuarios',
        loadChildren: './pages/cria-usuario/cria-usuario.module#CriaUsuarioPageModule'
      },
      {
        path: 'cadastroOutorga',
        loadChildren: './pages/cria-outorga/cria-outorga.module#CriaOutorgaPageModule'
      },
      {
        path: 'updateOutorga/:id',
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
      {
        path: 'atualizarCliente/:id',
        loadChildren: './pages/cria-usuario/cria-usuario.module#CriaUsuarioPageModule'
      },
      {
        path: 'cliente',
        loadChildren: './pages/lista-cliente/lista-cliente.module#ListaClientePageModule'
      },
      {
        path: 'usuario',
        loadChildren: './pages/lista-usuario/lista-usuario.module#ListaUsuarioPageModule'
      },
      {
        path: 'outorga',
        loadChildren: './pages/lista-outorga/lista-outorga.module#ListaOutorgaPageModule'
      },
      {
        path: 'credito',
        loadChildren: './pages/lista-credito/lista-credito.module#ListaCreditoPageModule'
      },
      {
        path: 'ambiental',
        loadChildren: './ambiental-routing.module#AmbientalRoutingModule'
      },
      {
        path: 'dadosPessoais',
        loadChildren: './pages/dados-pessoais/dados-pessoais.module#DadosPessoaisPageModule'
      },       
      {
        path: '',
        loadChildren: './pages/home/home.module#HomePageModule'
      },
      {
        path: 'updateCredito/:id',
        loadChildren: './pages/credito/credito.module#CreditoPageModule'
      }
      
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MenuRoutingModule {}
