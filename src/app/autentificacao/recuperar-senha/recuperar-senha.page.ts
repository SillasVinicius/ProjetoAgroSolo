import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Usuario } from 'src/app/autentificacao/pages/login/model/usuario.model';
import { UsuarioService } from 'src/app/core/services/usuario.service';


@Component({
  selector: 'app-recuperar-senha',
  templateUrl: './recuperar-senha.page.html',
  styleUrls: ['./recuperar-senha.page.scss'],
})
export class RecuperarSenhaPage implements OnInit {

  constructor(
  private ModalController: ModalController,
  private usuarioService: UsuarioService
  )
  { }

  habilitar_botao: boolean = true;
  validar: boolean = true;
  email: string;
  email_novamente: string;
  usuario: Usuario[] = [];
  usuarioId: string = undefined;
  usuarioNome: string;
  usuarioEmail: string;
  admin: string;
  
  async ngOnInit(): Promise<void> {
    this.usuarioService.getAll().subscribe((r: Usuario[]) => {
      for (let i = 0; i < r.length; i++) {
          this.usuario[i] = r[i];
      }
    });
  }

  async closeModal(){
    this.usuario = [];
    await this.ModalController.dismiss();
  }

  habilitar_email(email:string){
    this.email = email;
    if (this.email)
    {
      this.habilitar_botao = !(this.email == this.email_novamente);
    }
    else this.habilitar_botao = true;
  } 

  habilitar_email_novamente(email_novamente:string){
    this.email_novamente = email_novamente;
    if (this.email_novamente)
    {
      this.habilitar_botao = !(this.email == this.email_novamente);
    }
    else this.habilitar_botao = true;
  }

  async recuperarSenha(){
      for (let i = 0; i < this.usuario.length; i++) { 
        this.validar = (this.email == this.usuario[i].email);
        if (this.validar)
        {
          this.usuarioId = this.usuario[i].id;
          this.usuarioNome = this.usuario[i].nome;
          this.usuarioEmail = this.usuario[i].email;
          break; 
        }    
      }
    

    if (this.validar == false)
    {
      alert("Usuário não encontrado...");
      return;
    }

    this.usuarioService.init();
    await this.usuarioService.update({
      id: this.usuarioId,
      nome: this.usuarioNome,
      senha: "agro123",
      email: this.usuarioEmail,
    });
    
    this.closeModal();
  }

}
