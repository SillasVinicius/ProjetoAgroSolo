
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SharedModule } from 'src/app/shared/shared.module';
import { CriaOutorgaPage } from './cria-outorga.page';

const routes: Routes = [
{
  path: '',
  component: CriaOutorgaPage
}
];

@NgModule({
imports: [SharedModule, RouterModule.forChild(routes)],
declarations: [CriaOutorgaPage]
})
export class CriaOutorgaPageModule {}
