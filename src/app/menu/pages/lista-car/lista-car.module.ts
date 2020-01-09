import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SharedModule } from '../../../shared/shared.module';
import { ComponentsModule } from '../../component/components.module';
import { ListaCARPage } from './lista-car.page';
import { RelatorioCarPage } from "../relatorio-car/relatorio-car.page";

const routes: Routes = [
  {
    path: '',
    component: ListaCARPage
  }
];

@NgModule({
imports: [ SharedModule, ComponentsModule, RouterModule.forChild(routes)],
  declarations: [ListaCARPage, RelatorioCarPage],
  entryComponents: [RelatorioCarPage]
})
export class ListaCARPageModule {}
