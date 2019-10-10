import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ListaUsuarioPage } from './lista-usuario.page';
import { SharedModule } from 'src/app/shared/shared.module';
import { ComponentsModule } from '../../component/components.module';

const routes: Routes = [
  {
    path: '',
    component: ListaUsuarioPage
  }
];

@NgModule({
imports: [SharedModule, ComponentsModule, RouterModule.forChild(routes)],
  declarations: [ListaUsuarioPage]
})
export class ListaUsuarioPageModule {}
