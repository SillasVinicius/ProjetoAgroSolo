import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SharedModule } from 'src/app/shared/shared.module';
import { CreditoPage } from './credito.page';


const routes: Routes = [
  {
    path: '',
    component: CreditoPage
  }
];

@NgModule({
  imports: [SharedModule, RouterModule.forChild(routes)],
  declarations: [CreditoPage]
})
export class CreditoPageModule {}
