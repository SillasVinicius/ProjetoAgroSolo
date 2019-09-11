import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SharedModule } from 'src/app/shared/shared.module';
import { CriaLaPage } from './cria-la.page';

const routes: Routes = [
  {
    path: '',
    component: CriaLaPage
  }
];

@NgModule({
  imports: [SharedModule, RouterModule.forChild(routes)],
  declarations: [CriaLaPage]
})
export class CriaLaPageModule {}
