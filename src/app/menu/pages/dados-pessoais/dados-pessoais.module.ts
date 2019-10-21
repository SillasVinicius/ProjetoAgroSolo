import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SharedModule } from 'src/app/shared/shared.module';
import { DadosPessoaisPage } from './dados-pessoais.page';

const routes: Routes = [
  {
    path: '',
    component: DadosPessoaisPage
  }
];

@NgModule({
  imports: [SharedModule, RouterModule.forChild(routes)],
  declarations: [DadosPessoaisPage]
})
export class DadosPessoaisPageModule {}
