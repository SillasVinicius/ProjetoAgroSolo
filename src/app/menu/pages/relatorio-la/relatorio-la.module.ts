import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { RelatorioLaPage } from './relatorio-la.page';

const routes: Routes = [
  {
    path: '',
    component: RelatorioLaPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [RelatorioLaPage]
})
export class RelatorioLaPageModule {}
