import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomePage } from './home.page';
import { SharedModule } from 'src/app/shared/shared.module';
import { AlterarSenhaPage } from 'src/app/menu/pages/alterar-senha/alterar-senha.page';

const routes: Routes = [
  {
    path: '',
    component: HomePage
  }
];

@NgModule({
  imports: [SharedModule, RouterModule.forChild(routes)],
  declarations: [HomePage, AlterarSenhaPage],
  entryComponents: [AlterarSenhaPage]
})
export class HomePageModule {}
