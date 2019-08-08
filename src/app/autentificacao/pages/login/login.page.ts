import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, AbstractControl, FormControl } from '@angular/forms';
@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss']
})
export class LoginPage implements OnInit {
  loginForm: FormGroup;
  numberPattern = /^[0-9]*$/;
  configs = {
    login: true,
    acao: 'Login',
    novaAcao: 'Criar conta!'
  };

  private nomeControl = new FormControl('', [Validators.required, Validators.minLength(3)]);
  private rgControl = new FormControl('', [
    Validators.required,
    Validators.pattern(this.numberPattern),
    Validators.minLength(9),
    Validators.maxLength(9)
  ]);
  private emailControl = new FormControl('', [Validators.required, Validators.email]);
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
  constructor(private formBuilder: FormBuilder) {}

  ngOnInit() {
    this.loginForm = this.formBuilder.group({
      senha: this.formBuilder.control('', [Validators.required, Validators.minLength(6)]),
      cpf: this.formBuilder.control('', [
        Validators.required,
        Validators.pattern(this.numberPattern),
        Validators.minLength(11),
        Validators.maxLength(11)
      ])
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
      this.loginForm.addControl('email', this.emailControl);
      this.loginForm.addControl('telefone', this.telefoneControl);
      this.loginForm.addControl('dataNascimento', this.dataNascimentoControl);
    } else {
      this.loginForm.removeControl('nome');
      this.loginForm.removeControl('rg');
      this.loginForm.removeControl('email');
      this.loginForm.removeControl('telefone');
      this.loginForm.removeControl('dataNascimento');
    }
  }

  onSubmit(): void {
    console.log('LoginForm: ', this.loginForm.value);
  }
}
