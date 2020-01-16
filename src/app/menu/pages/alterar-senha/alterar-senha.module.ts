import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { AlterarSenhaPage } from './alterar-senha.page';
import { Md5 } from 'ts-md5/dist/md5';

const routes: Routes = [
  {
    path: '',
    component: AlterarSenhaPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes),
    Md5
  ],
  declarations: [AlterarSenhaPage]
})
export class AlterarSenhaPageModule {}
