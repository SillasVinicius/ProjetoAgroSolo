import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ListaClientePage } from './lista-cliente.page';
import { SharedModule } from 'src/app/shared/shared.module';
import { ComponentsModule } from '../../component/components.module';
import { RelatorioClientePage } from '../relatorio-cliente/relatorio-cliente.page';

const routes: Routes = [
  {
    path: '',
    component: ListaClientePage,
    
  }
];

@NgModule({
  imports: [SharedModule, ComponentsModule, RouterModule.forChild(routes)],
  declarations: [ListaClientePage, RelatorioClientePage],
  entryComponents: [RelatorioClientePage]
})



export class ListaClientePageModule {}