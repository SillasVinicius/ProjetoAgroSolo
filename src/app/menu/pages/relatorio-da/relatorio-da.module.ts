import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { RelatorioDaPage } from './relatorio-da.page';

const routes: Routes = [
  {
    path: '',
    component: RelatorioDaPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [RelatorioDaPage]
})
export class RelatorioDaPageModule {}
