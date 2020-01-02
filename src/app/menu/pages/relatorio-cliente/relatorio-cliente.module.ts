import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { RelatorioClientePage } from './relatorio-cliente.page';

const routes: Routes = [
  {
    path: '',
    component: RelatorioClientePage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [RelatorioClientePage],
  exports: [RelatorioClientePage]
})
export class RelatorioClientePageModule {}
