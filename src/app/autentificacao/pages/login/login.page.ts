import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, AbstractControl, FormControl } from '@angular/forms';
import { trigger, state, transition, style, animate } from '@angular/animations';
import { AuthService } from 'src/app/core/services/auth.service';
import { User } from '../../../core/services/user.model';
import { OverlayService } from 'src/app/core/services/overlay.service';
import { response } from 'express';
import { Router } from '@angular/router';
import { UsuarioService } from 'src/app/core/services/usuario.service';
import { NavController } from '@ionic/angular';
import { Observable } from 'rxjs';
import { Usuario } from './model/usuario.model';
import { map, tap } from 'rxjs/operators';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  animations: [
    trigger('movLogo', [
      state('cadastro', style({ 'padding-top': '10%' })),
      state('login', style({ 'padding-top': '25%' })),
      transition('login => cadastro', [style({ transition: '1s' }), animate('300ms 0s ease-in')]),
      transition('cadastro => login', [style({ transition: '1s' }), animate('300ms 0s ease-in')])
    ])
  ]
})
export class LoginPage implements OnInit {
  loginForm: FormGroup;
  logado: boolean = false;
  numberPattern = /^[0-9]*$/;
  configs = {
    login: true,
    acao: 'Login',
    novaAcao: 'Criar conta!'
  };

  private user: Observable<Usuario[]>;

  private nomeControl = new FormControl('', [Validators.required, Validators.minLength(3)]);
  private rgControl = new FormControl('', [
    Validators.required,
    Validators.pattern(this.numberPattern),
    Validators.minLength(9),
    Validators.maxLength(9)
  ]);
  private cpfControl = new FormControl('', [
    Validators.required,
    Validators.pattern(this.numberPattern),
    Validators.minLength(11),
    Validators.maxLength(11)
  ]);
  private telefoneControl = new FormControl('', [
    Validators.required,
    Validators.pattern(this.numberPattern),
    Validators.minLength(12),
    Validators.maxLength(12)
  ]);
  private dataNascimentoControl = new FormControl('', [
    Validators.required,
    Validators.minLength(10),
    Validators.maxLength(10)
  ]);
  constructor(
    private formBuilder: FormBuilder,
    private loginService: AuthService,
    private overlayService: OverlayService,
    private router: Router,
    private usuarioService: UsuarioService,
    private navCtrl: NavController
  ) {}

  ngOnInit() {
    this.loginForm = this.formBuilder.group({
      senha: this.formBuilder.control('123456', [Validators.required, Validators.minLength(6)]),
      email: this.formBuilder.control('sillas@gmail.com', [Validators.required, Validators.email])
    });
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
    this.configs.acao = login ? 'Entrar' : 'Cadastrar';
    this.configs.novaAcao = login ? 'Criar Conta!' : 'Já tenho uma conta!';
    if (!login) {
      this.loginForm.addControl('nome', this.nomeControl);
      this.loginForm.addControl('rg', this.rgControl);
      this.loginForm.addControl('cpf', this.cpfControl);
      this.loginForm.addControl('telefone', this.telefoneControl);
      this.loginForm.addControl('dataNascimento', this.dataNascimentoControl);
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
    // const loading = await this.overlayService.loading();
    // this.loginService
    //   .login(this.loginForm.value.email, this.loginForm.value.senha)
    //   .subscribe(
    //     user => this.router.navigate(['/menu']),
    //     response => this.overlayService.toast({ message: response.error.message })
    //   );

    // loading.dismiss();
    // console.log('login');
    //console.log(this.logado);
    const loading = await this.overlayService.loading({
      message: 'Logando...'
    });

    try {
      this.user = await this.usuarioService.loginDb(
        this.loginForm.get('email').value,
        this.loginForm.get('senha').value
      );
      this.user.subscribe(async (r: Usuario[]) => {
        if (r.length >= 1) {
          //await this.logar();
          console.log('Usuário Logado', this.user);
          this.usuarioService.setId(r[0].id);
          this.logar();
          console.log(r[0].id);
          console.log(this.logado);
          this.navCtrl.navigateForward('/menu');
          this.usuarioService.logado = true;
          this.usuarioService.nomeUser = r[0].nome;
          //console.log(this.usuarioService.nomeUser);
        } else {
          await this.overlayService.toast({
            message: 'Usuário inválido! Verifique os dados e tente novamente!'
          });
          this.usuarioService.logado = false;
        }
      });
    } catch (error) {
      await this.overlayService.toast({
        message: error.message
      });
      console.log('Erro ao Logar usuário: ', error);
    } finally {
      loading.dismiss();
    }
    //console.log(this.logado);
  }

  async cadastro(): Promise<void> {
    //console.log('cadastro');
    const loading = await this.overlayService.loading({
      message: 'Cadastrando...'
    });
    try {
      const usuario = await this.usuarioService.create(this.loginForm.value);
      console.log('Usuário Criado', usuario);
      this.navCtrl.navigateForward('/menu');
      this.usuarioService.logado = true;
      this.usuarioService.nomeUser = this.loginForm.get('nome').value;
    } catch (error) {
      await this.overlayService.toast({
        message: error.message
      });
      this.usuarioService.logado = false;
      console.log('Erro ao criar usuário: ', error);
    } finally {
      loading.dismiss();
    }
  }

  onSubmit() {
    if (this.configs.login) {
      this.login();
    } else {
      this.cadastro();
    }
  }
}
