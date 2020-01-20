import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Usuario } from 'src/app/autentificacao/pages/login/model/usuario.model';
import { Cliente } from 'src/app/menu/models/cliente.model';
import { UsuarioService } from 'src/app/core/services/usuario.service';
import { ClienteService } from 'src/app/core/services/cliente.service';
import { OverlayService } from 'src/app/core/services/overlay.service';
import { EmailService } from 'src/app/core/services/email.service';
import { ConfigEmail } from 'src/app/menu/models/config-email.model';

@Component({
  selector: 'app-recuperar-senha',
  templateUrl: './recuperar-senha.page.html',
  styleUrls: ['./recuperar-senha.page.scss'],
})
export class RecuperarSenhaPage implements OnInit {

  constructor(
    private ModalController: ModalController,
    private usuarioService: UsuarioService,
    private clienteService: ClienteService,
    private overlayService: OverlayService,
    private emailService: EmailService
  ) { }

  habilitar_botao: boolean = true;
  validar_usuario_existe: boolean;
  email: string;
  email_novamente: string;
  usuario: Usuario[] = [];
  cliente: Cliente[] = [];
  usuarioId: string = undefined;
  usuarioNome: string;
  usuarioEmail: string;
  admin: boolean = false;
  // cliente 
  cpf_usu: string;
  patrimonio_usu: string;
  pdtvAgro_usu: string;
  informacoesAdicionais_usu: string;
  rg_usu: string;
  telefone_usu: string;
  dataNascimento_usu: string;

  async ngOnInit(): Promise<void> {
    this.usuarioService.getAll().subscribe((r: Usuario[]) => {
      for (let i = 0; i < r.length; i++) {
        this.usuario[i] = r[i];
      }
    });

    this.clienteService.getAll().subscribe((c: Cliente[]) => {
      for (let i = 0; i < c.length; i++) {
        this.cliente[i] = c[i];
      }
    });
  }



  async closeModal() {
    await this.ModalController.dismiss();
  }

  habilitar_email(email: string) {
    this.email = email;
    if (this.email) {
      this.habilitar_botao = !(this.email == this.email_novamente);
    }
    else this.habilitar_botao = true;
  }

  habilitar_email_novamente(email_novamente: string) {
    this.email_novamente = email_novamente;
    if (this.email_novamente) {
      this.habilitar_botao = !(this.email == this.email_novamente);
    }
    else this.habilitar_botao = true;
  }

  async recuperarSenha() {

    const loading = await this.overlayService.loading();
    this.validar_usuario_existe = false;
    try {
      for (let i = 0; i < this.usuario.length; i++) {
        this.validar_usuario_existe = (this.email == this.usuario[i].email);
        if (this.validar_usuario_existe) {
          this.usuarioId = this.usuario[i].id;
          this.usuarioNome = this.usuario[i].nome;
          this.usuarioEmail = this.usuario[i].email;
          this.admin = this.usuario[i].admin;
          break;
        }
      }

      if (!this.admin) {
        for (let i = 0; i < this.cliente.length; i++) {
          this.validar_usuario_existe = (this.email == this.cliente[i].email);
          if (this.validar_usuario_existe) {
            this.usuarioId = this.cliente[i].id;
            this.usuarioNome = this.cliente[i].nome;
            this.usuarioEmail = this.cliente[i].email;
            this.cpf_usu = this.cliente[i].cpf;
            this.patrimonio_usu = this.cliente[i].patrimonio;
            this.pdtvAgro_usu = this.cliente[i].pdtvAgro;
            this.informacoesAdicionais_usu = this.cliente[i].informacoesAdicionais;
            this.rg_usu = this.cliente[i].rg;
            this.telefone_usu = this.cliente[i].telefone;
            this.dataNascimento_usu = this.cliente[i].dataNascimento;
            break;
          }
        }
      }
      
      if (!this.validar_usuario_existe) {
        await this.overlayService.toast({
          message: "Usuário não encontrado..."
        });
        return;
      }

      const sha1 = require('sha1');

      if (this.admin) {
        this.usuarioService.init();
        await this.usuarioService.update({
          id: this.usuarioId,
          nome: this.usuarioNome,
          senha: sha1('agro123'),
          email: this.usuarioEmail,
        });
      }
      else {
        this.clienteService.init();
        await this.clienteService.update({
          id: this.usuarioId,
          cpf: this.cpf_usu,
          nome: this.usuarioNome,
          patrimonio: this.patrimonio_usu,
          pdtvAgro: this.pdtvAgro_usu,
          informacoesAdicionais: this.informacoesAdicionais_usu,
          rg: this.rg_usu,
          telefone: this.telefone_usu,
          dataNascimento: this.dataNascimento_usu,
          email: this.usuarioEmail,
          senha: sha1('agro123'),
        });
      }


      const config = new ConfigEmail(this.usuarioNome, 'agro123', this.usuarioEmail);
      this.emailService.sendMail(config)
        .subscribe((resp) => {
          console.log(resp.status);
        });

      this.closeModal();
    }
    finally {
      loading.remove();
    }
  }

}
