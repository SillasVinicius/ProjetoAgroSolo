import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { RelatorioOutorgaPage } from './relatorio-outorga.page';

const routes: Routes = [
  {
    path: '',
    component: RelatorioOutorgaPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [RelatorioOutorgaPage]
})
export class RelatorioOutorgaPageModule {}
