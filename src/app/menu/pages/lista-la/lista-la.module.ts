import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SharedModule } from '../../../shared/shared.module';
import { ComponentsModule } from '../../component/components.module';
import { ListaLAPage } from './lista-la.page';

const routes: Routes = [
  {
    path: '',
    component: ListaLAPage
  }
];

@NgModule({
  imports: [ SharedModule, ComponentsModule, RouterModule.forChild(routes)],
  declarations: [ListaLAPage]
})
export class ListaLAPageModule {}
