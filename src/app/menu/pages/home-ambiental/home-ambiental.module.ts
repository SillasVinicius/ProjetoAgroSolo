import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeAmbientalPage } from './home-ambiental.page';
import { SharedModule } from 'src/app/shared/shared.module';

const routes: Routes = [
  {
    path: '',
    component: HomeAmbientalPage
  }
];

@NgModule({
  imports: [
    SharedModule,
    RouterModule.forChild(routes)
  ],
  declarations: [HomeAmbientalPage]
})
export class HomeAmbientalPageModule {}
