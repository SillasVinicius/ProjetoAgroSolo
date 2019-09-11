import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SharedModule } from '../../../shared/shared.module';
import { ComponentsModule } from '../../component/components.module';
import { ListaDAPage } from './lista-da.page';

const routes: Routes = [
  {
    path: '',
    component: ListaDAPage
  }
];

@NgModule({
  imports: [ SharedModule, ComponentsModule, RouterModule.forChild(routes)],
  declarations: [ListaDAPage]
})
export class ListaDAPageModule {}
