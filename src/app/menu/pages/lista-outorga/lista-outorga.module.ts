import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SharedModule } from '../../../shared/shared.module';
import { ListaOutorgaPage } from './lista-outorga.page';
import { ComponentsModule } from '../../component/components.module';
import { RelatorioOutorgaPage } from "../relatorio-outorga/relatorio-outorga.page";


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
  declarations: [ListaOutorgaPage, RelatorioOutorgaPage],
  entryComponents: [RelatorioOutorgaPage]
})
export class ListaOutorgaPageModule {}
