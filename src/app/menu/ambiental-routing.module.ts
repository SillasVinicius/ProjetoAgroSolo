import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from '../core/guards/auth.guard';

const routes: Routes = [
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
        path: 'RelatorioCadastroAmbientalRural',
        loadChildren: './pages/relatorio-car/relatorio-car.module#RelatorioCarPageModule'
      },
      {
        path: 'RelatorioDa',
        loadChildren: './pages/relatorio-da/relatorio-da.module#RelatorioDaPageModule'
      },
      {
        path: 'RelatorioLa',
        loadChildren: './pages/relatorio-la/relatorio-la.module#RelatorioLaPageModule'
      },
      {
        path: '',
        loadChildren: './pages/home-ambiental/home-ambiental.module#HomeAmbientalPageModule'
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AmbientalRoutingModule {}
