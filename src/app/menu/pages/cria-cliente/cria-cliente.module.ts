import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CriaClientePage } from './cria-cliente.page';
import { SharedModule } from 'src/app/shared/shared.module';
import { BrMaskerModule } from 'br-mask';
const routes: Routes = [
  {
    path: '',
    component: CriaClientePage
  }
];

@NgModule({
  imports: [SharedModule, RouterModule.forChild(routes), BrMaskerModule],
  declarations: [CriaClientePage]
})
export class CriaClientePageModule {}
