import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SharedModule } from 'src/app/shared/shared.module';
import { CriaCarPage } from './cria-car.page';

const routes: Routes = [
  {
    path: '',
    component: CriaCarPage
  }
];

@NgModule({
imports: [SharedModule, RouterModule.forChild(routes)],
  declarations: [CriaCarPage]
})
export class CriaCarPageModule {}
