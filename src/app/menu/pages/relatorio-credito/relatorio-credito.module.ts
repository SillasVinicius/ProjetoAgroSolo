import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { RelatorioCreditoPage } from './relatorio-credito.page';

const routes: Routes = [
  {
    path: '',
    component: RelatorioCreditoPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [RelatorioCreditoPage]
})
export class RelatorioCreditoPageModule {}
