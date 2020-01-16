import { Component, OnInit, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { UsuarioService } from 'src/app/core/services/usuario.service';
import { ClienteService } from 'src/app/core/services/cliente.service';
import { Usuario} from 'src/app/autentificacao/pages/login/model/usuario.model';
import { Cliente } from '../../models/cliente.model';
import { OverlayService } from 'src/app/core/services/overlay.service';

@Component({
  selector: 'app-alterar-senha',
  templateUrl: './alterar-senha.page.html',
  styleUrls: ['./alterar-senha.page.scss'],
})
export class AlterarSenhaPage implements OnInit {

  constructor(
    private ModalController: ModalController,
    private usuarioService: UsuarioService,
    private clienteService: ClienteService,
    private overlayService: OverlayService
  ) { 
    
  }
  // validar o botão para fazer o cadastro
  habilitar_botao: boolean = true;
  senha: string;
  senha_novamente: string;
  senha_antiga: string;

  // validar se é usuário ou cliente
  @Input() id_usu: string;
  @Input() validar_usuario: boolean;
  senha_usu: string;
  nome_usu: string;
  email_usu: string;
  cpf_usu: string;
  patrimonio_usu: string;
  pdtvAgro_usu: string;
  informacoesAdicionais_usu: string;
  rg_usu: string;
  telefone_usu: string;
  dataNascimento_usu: string;
  mostraSenha: boolean = true;

  ngOnInit() {

    if (this.validar_usuario)
    {
      this.usuarioService.init();
      this.usuarioService.getAll().subscribe((u: Usuario[]) => {
        for (let i = 0; i < u.length; i++) {
            if (u[i].id == this.id_usu)
            {
              this.senha_usu = u[i].senha;
              this.nome_usu = u[i].nome;
              this.email_usu = u[i].email; 
            }        
        }
      });
    }
    else 
    { 
      this.clienteService.init();
      this.clienteService.getAll().subscribe((c: Cliente[]) => {
        for (let i = 0; i < c.length; i++) {
          if (c[i].id == this.id_usu)
          {
              this.senha_usu = c[i].senha;
              this.nome_usu = c[i].nome;
              this.email_usu = c[i].email;
              this.cpf_usu = c[i].cpf;
              this.patrimonio_usu = c[i].patrimonio;
              this.pdtvAgro_usu = c[i].pdtvAgro;
              this.informacoesAdicionais_usu = c[i].informacoesAdicionais;
              this.rg_usu = c[i].rg;
              this.telefone_usu = c[i].telefone;
              this.dataNascimento_usu = c[i].dataNascimento;
          }                        
        }
      });

    }

  }
  
  async closeModal(){
    await this.ModalController.dismiss();
  }

  habilitar_senha(senha:string){
    this.senha = senha;
    if (this.senha && this.senha_antiga && (this.senha_usu == this.senha_antiga)
    && (this.senha.length > 5) )
    {
      this.habilitar_botao = !(this.senha == this.senha_novamente);
    }
    else this.habilitar_botao = true;
  } 

  habilitar_senha_novamente(senha_novamente:string){
    this.senha_novamente = senha_novamente;
    if (this.senha_novamente && this.senha_antiga && (this.senha_usu == this.senha_antiga)
    && (this.senha_novamente.length > 5) )
    {
      this.habilitar_botao = !(this.senha == this.senha_novamente);
    }
    else this.habilitar_botao = true;
  }

  habilitar_senha_antiga(senha_antiga:string){
    this.senha_antiga = senha_antiga
    if (this.senha_novamente && this.senha && (this.senha_antiga.length > 5) )
      this.habilitar_botao = !(this.senha_usu == this.senha_antiga)
    else this.habilitar_botao = true;
  }

  async  mostrarSenha(){
    if (this.mostraSenha == true)
    {
      this.mostraSenha = false;
    }
    else this.mostraSenha = true;  
  }

  async alteraSenha(){
    const loading = await this.overlayService.loading(); 
    try
    {
      this.habilitar_botao = true;
      if (this.validar_usuario)
      {
        this.usuarioService.init();
        await this.usuarioService.update({
            id: this.id_usu,
            nome: this.nome_usu,
            senha: this.senha,
            email: this.email_usu
        });
      }
      else
      {
        this.clienteService.init();
        await this.clienteService.update({
          id: this.id_usu,
          cpf: this.cpf_usu,
          nome: this.nome_usu,
          patrimonio: this.patrimonio_usu,
          pdtvAgro: this.pdtvAgro_usu,
          informacoesAdicionais: this.informacoesAdicionais_usu,
          rg: this.rg_usu,
          telefone: this.telefone_usu,
          dataNascimento: this.dataNascimento_usu,
          email: this.email_usu,
          senha: this.senha,
        });
      }

      await this.overlayService.toast({
        message: 'Senha alterada com sucesso!'
      });
    }
    finally
    {
      loading.remove();
      this.closeModal();
    }
  }
}
