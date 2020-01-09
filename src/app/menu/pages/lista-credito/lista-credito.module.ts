import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { ListaCreditoPage } from './lista-credito.page';
import { ComponentsModule } from '../../component/components.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { RelatorioCreditoPage } from "../relatorio-credito/relatorio-credito.page";

const routes: Routes = [
  {
    path: '',
    component: ListaCreditoPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ComponentsModule,
    SharedModule,
    RouterModule.forChild(routes)
  ],
  declarations: [ListaCreditoPage, RelatorioCreditoPage],
  entryComponents: [RelatorioCreditoPage]
})
export class ListaCreditoPageModule {}
