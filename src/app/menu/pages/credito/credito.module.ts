import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SharedModule } from 'src/app/shared/shared.module';
import { CreditoPage } from './credito.page';
import { ComponentsModule } from '../../component/components.module';


const routes: Routes = [
  {
    path: '',
    component: CreditoPage
  }
];

@NgModule({
  imports: [SharedModule, RouterModule.forChild(routes), ComponentsModule],
  declarations: [CreditoPage]
})
export class CreditoPageModule {}
