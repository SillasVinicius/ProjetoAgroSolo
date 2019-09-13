import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SharedModule } from 'src/app/shared/shared.module';
import { AlteraUsuarioPage } from './altera-usuario.page';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

const routes: Routes = [
  {
    path: '',
    component: AlteraUsuarioPage
  }
];

@NgModule({
imports: [SharedModule, RouterModule.forChild(routes), FormsModule, ReactiveFormsModule],
  declarations: [AlteraUsuarioPage]
})
export class AlteraUsuarioPageModule {}
