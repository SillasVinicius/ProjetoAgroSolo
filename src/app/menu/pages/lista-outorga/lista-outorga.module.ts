import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SharedModule } from '../../../shared/shared.module';
import { ListaOutorgaPage } from './lista-outorga.page';
import { ComponentsModule } from '../../component/components.module';

const routes: Routes = [
  {
    path: '',
    component: ListaOutorgaPage
  }
];

@NgModule({
  imports: [
    SharedModule, ComponentsModule, RouterModule.forChild(routes)
  ],
  declarations: [ListaOutorgaPage]
})
export class ListaOutorgaPageModule {}
