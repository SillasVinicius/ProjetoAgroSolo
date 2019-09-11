import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SharedModule } from 'src/app/shared/shared.module';
import { CriaDaPage } from './cria-da.page';

const routes: Routes = [
  {
    path: '',
    component: CriaDaPage
  }
];

@NgModule({
imports: [SharedModule, RouterModule.forChild(routes)],
  declarations: [CriaDaPage]
})
export class CriaDaPageModule {}
