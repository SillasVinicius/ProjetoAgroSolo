import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ListaClientePage } from './lista-cliente.page';
import { SharedModule } from 'src/app/shared/shared.module';
import { ComponentsModule } from '../../component/components.module';

const routes: Routes = [
  {
    path: '',
    component: ListaClientePage
  }
];

@NgModule({
  imports: [SharedModule, ComponentsModule, RouterModule.forChild(routes)],
  declarations: [ListaClientePage]
})
export class ListaClientePageModule {}
