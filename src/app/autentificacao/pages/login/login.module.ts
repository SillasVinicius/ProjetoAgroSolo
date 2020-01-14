import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginPage } from './login.page';
import { SharedModule } from 'src/app/shared/shared.module';
import { BrMaskerModule } from 'br-mask';
import { RecuperarSenhaPage} from 'src/app/autentificacao/recuperar-senha/recuperar-senha.page'

const routes: Routes = [
  {
    path: '',
    component: LoginPage
  }
];

@NgModule({
  imports: [SharedModule, RouterModule.forChild(routes), BrMaskerModule],
  declarations: [LoginPage, RecuperarSenhaPage],
  entryComponents: [RecuperarSenhaPage]
})
export class LoginPageModule {}
