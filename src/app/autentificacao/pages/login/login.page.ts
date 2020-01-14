import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { trigger, state, transition, style, animate } from '@angular/animations';
import { OverlayService } from 'src/app/core/services/overlay.service';
import { UsuarioService } from 'src/app/core/services/usuario.service';
import { NavController, ModalController } from '@ionic/angular';
import { Observable } from 'rxjs';
import { Usuario } from './model/usuario.model';
import { RecuperarSenhaPage} from 'src/app/autentificacao/recuperar-senha/recuperar-senha.page';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  animations: [
    trigger('movDiv', [
      state('cadastro', style({ 'margin-top': '-14%', 'height': '105%', 'border-radius': '3%' })),
      state('login', style({ 'margin-top': '33%', 'height': '79%', 'border-radius': '5%'})),
      transition('login => cadastro', [style({ transition: '0.2s' }), animate('100ms 0s ease-in')]),
      transition('cadastro => login', [style({ transition: '0.2s' }), animate('100ms 0s ease-in')])
    ]),
  ]
})
export class LoginPage implements OnInit {
  // variáveis login
  version: string = '';
  author: string = '';
  loginForm: FormGroup;
  logado = false;
  numberPattern = /^[0-9]*$/;
  configs = {
    login: true,
    acao: 'Login'
  };

  private cliente: Observable<Usuario[]>;

  private user: Observable<Usuario[]>;

  private nomeControl = new FormControl('', [Validators.required, Validators.minLength(3)]);
  private rgControl = new FormControl('', [
    Validators.required,
    Validators.minLength(1)
  ]);
  private cpfControl = new FormControl('', [
    Validators.required,
    Validators.minLength(14),
    Validators.maxLength(18)
  ]);
  private telefoneControl = new FormControl('', [
    Validators.required,
    Validators.minLength(14),
    Validators.maxLength(15)
  ]);
  private dataNascimentoControl = new FormControl('', [
    Validators.required
  ]);
  constructor(
    private formBuilder: FormBuilder,
    private ModalController: ModalController,
    private overlayService: OverlayService,
    private usuarioService: UsuarioService,
    private navCtrl: NavController
  ) {}

  ngOnInit() {
    this.loginForm = this.formBuilder.group({
      senha: this.formBuilder.control('123456', [Validators.required, Validators.minLength(6)]),
      email: this.formBuilder.control('admin@gmail.com', [Validators.required, Validators.email]),
      admin: this.formBuilder.control(false, [])
    });

    var packageJsonInfo = require('package.json');
    this.version = packageJsonInfo.version;
    this.author = packageJsonInfo.author;
  }



  get cpf(): FormControl {
    return this.loginForm.get('cpf') as FormControl;
  }
  get senha(): FormControl {
    return this.loginForm.get('senha') as FormControl;
  }
  get nome(): FormControl {
    return this.loginForm.get('nome') as FormControl;
  }
  get rg(): FormControl {
    return this.loginForm.get('rg') as FormControl;
  }
  get email(): FormControl {
    return this.loginForm.get('email') as FormControl;
  }
  get telefone(): FormControl {
    return this.loginForm.get('telefone') as FormControl;
  }
  get dataNascimento(): FormControl {
    return this.loginForm.get('dataNascimento') as FormControl;
  }

  mudarAcaoForm(): void {
    this.configs.login = !this.configs.login;
    const { login } = this.configs;
    this.configs.acao = login ? 'Login' : 'Cadastrar';

    if (!login) {
      this.loginForm.addControl('nome', this.nomeControl);
      this.loginForm.addControl('rg', this.rgControl);
      this.loginForm.addControl('cpf', this.cpfControl);
      this.loginForm.addControl('telefone', this.telefoneControl);
      this.loginForm.addControl('dataNascimento', this.dataNascimentoControl);
      this.loginForm.reset();
    } else {
      this.loginForm.removeControl('nome');
      this.loginForm.removeControl('rg');
      this.loginForm.removeControl('cpf');
      this.loginForm.removeControl('telefone');
      this.loginForm.removeControl('dataNascimento');
    }
  }

  logar(): void {
    this.logado = true;
  }
  async login() {
    const loading = await this.overlayService.loading({
      message: 'Logando...'
    });

    try {
      this.user = await this.usuarioService.loginDb(
        this.loginForm.get('email').value,
        this.loginForm.get('senha').value,
      );
      this.user.subscribe(async (r: Usuario[]) => {
        if (r.length >= 1) {
          console.log('Usuário Logado', this.user);
          this.usuarioService.setId(r[0].id);
          this.logar();
          console.log(r[0].id);
          console.log(this.logado);
          this.navCtrl.navigateForward('/menu');
          this.usuarioService.logado = true;
          this.usuarioService.nomeUser = r[0].nome;
          this.usuarioService.urlFoto = r[0].foto;
          this.usuarioService.admin = r[0].admin;
        } else {
          this.user = await this.usuarioService.loginDbCliente(
            this.loginForm.get('email').value,
            this.loginForm.get('senha').value,
          );
          this.user.subscribe(async (r: Usuario[]) => {
            if (r.length >= 1) {
              console.log('Usuário Logado', this.user);
              this.usuarioService.setId(r[0].id);
              this.logar();
              console.log(r[0].id);
              console.log(this.logado);
              this.navCtrl.navigateForward('/menu');
              this.usuarioService.logado = true;
              this.usuarioService.nomeUser = r[0].nome;
              this.usuarioService.urlFoto = r[0].foto;
              this.usuarioService.admin = r[0].admin;
            }
            else{
              await this.overlayService.toast({
                  message: 'Dados incorretos! Verifique-os e tente novamente!'
                });
                this.usuarioService.logado = false;
            }
          }
        );
        }

      },
    );
    } catch (error) {
      await this.overlayService.toast({
        message: error.message
      });
      console.log('Erro ao Logar usuário: ', error);
    } finally {
      loading.dismiss();
    }
  }






  onSubmit() {
    if (this.configs.login) {
      this.login();
    } else {

    }
  }


  async openModal() {
    const modal = await this.ModalController.create({
      component: RecuperarSenhaPage
    })
    modal.present();
  } 


}
