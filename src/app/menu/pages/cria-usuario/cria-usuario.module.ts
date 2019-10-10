import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CriaUsuarioPage } from './cria-usuario.page';
import { SharedModule } from 'src/app/shared/shared.module';
import { BrMaskerModule } from 'br-mask';

const routes: Routes = [
  {
    path: '',
    component: CriaUsuarioPage
  }
];

@NgModule({
  imports: [SharedModule, RouterModule.forChild(routes), BrMaskerModule],
  declarations: [CriaUsuarioPage]
})
export class CriaUsuarioPageModule {}
