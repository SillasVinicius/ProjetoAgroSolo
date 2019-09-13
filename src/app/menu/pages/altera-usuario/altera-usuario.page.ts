import { Component, OnInit } from '@angular/core';
import { OverlayService } from 'src/app/core/services/overlay.service';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { NavController } from '@ionic/angular';
import { finalize, take, tap } from 'rxjs/operators';
import { AngularFireStorage, AngularFireUploadTask } from '@angular/fire/storage';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { UsuarioService } from 'src/app/core/services/usuario.service';

@Component({
  selector: 'app-altera-usuario',
  templateUrl: './altera-usuario.page.html',
  styleUrls: ['./altera-usuario.page.scss'],
})
export class AlteraUsuarioPage implements OnInit {

  // Alterar Perfil
  updateUsuarioForm: FormGroup;
  updateUsuarioId: string = undefined;

  // Validacao
  numberPattern = /^[0-9]*$/;

  // Dependencias
  constructor(
    private formBuilder: FormBuilder,
    private overlayService: OverlayService,
    private navCtrl: NavController,
    private route: ActivatedRoute,
    private usuarioService: UsuarioService,
  ){}

  // metodo que é chamado quando a pagina é carregada
  ngOnInit() {
    this.criaFormulario();
    this.usuarioService.init();
    this.acao();
  }

  // Cria formulários
  criaFormulario(): void {
    this.updateUsuarioForm = this.formBuilder.group({
      senha: this.formBuilder.control('', [Validators.required, Validators.minLength(6)]),
      email: this.formBuilder.control('', [Validators.required, Validators.email]),
      nome: this.formBuilder.control('', [Validators.required, Validators.minLength(3)]),
      rg: this.formBuilder.control('', [
        Validators.required,
        Validators.pattern(this.numberPattern),
        Validators.minLength(9),
        Validators.maxLength(9)
      ]),
      cpf: this.formBuilder.control('', [
        Validators.required,
        Validators.pattern(this.numberPattern),
        Validators.minLength(11),
        Validators.maxLength(11)
      ]),
      dataNascimento: this.formBuilder.control('', [
        Validators.required,
        Validators.minLength(10),
        Validators.maxLength(10)
      ]),
      telefone: this.formBuilder.control('', [
        Validators.required,
        Validators.minLength(12),
        Validators.maxLength(12)
      ])
    });
  }

  // atualização
  acao(): void {
    const updateUsuarioId = this.route.snapshot.paramMap.get('id');
    this.updateUsuarioId = updateUsuarioId;
    this.usuarioService
      .get(updateUsuarioId)
      .pipe(take(1))
      .subscribe(({ nome, cpf, email, dataNascimento, rg, senha, telefone }) => {
        this.updateUsuarioForm.get('cpf').setValue(cpf),
          this.updateUsuarioForm.get('senha').setValue(senha),
          this.updateUsuarioForm.get('nome').setValue(nome),
          this.updateUsuarioForm.get('rg').setValue(rg),
          this.updateUsuarioForm.get('email').setValue(email),
          this.updateUsuarioForm.get('telefone').setValue(telefone),
          this.updateUsuarioForm.get('dataNascimento').setValue(dataNascimento)
      });
  }

  // metodos get que pegam o valor do input no formulário
  get cpf(): FormControl {
    return this.updateUsuarioForm.get('cpf') as FormControl;
  }
  get senha(): FormControl {
    return this.updateUsuarioForm.get('senha') as FormControl;
  }
  get nome(): FormControl {
    return this.updateUsuarioForm.get('nome') as FormControl;
  }
  get rg(): FormControl {
    return this.updateUsuarioForm.get('rg') as FormControl;
  }
  get email(): FormControl {
    return this.updateUsuarioForm.get('email') as FormControl;
  }
  get telefone(): FormControl {
    return this.updateUsuarioForm.get('telefone') as FormControl;
  }
  get dataNascimento(): FormControl {
    return this.updateUsuarioForm.get('dataNascimento') as FormControl;
  }

  // método que envia os dados do formulário para o banco de dados
  async onSubmit(): Promise<void> {
    const loading = await this.overlayService.loading({
      message: 'Alterando Perfil...'
    });
    try {
        const usuario = await this.usuarioService.update({
        id: this.updateUsuarioId,
        nome: this.updateUsuarioForm.get('nome').value,
        cpf: this.updateUsuarioForm.get('cpf').value,
        dataNascimento: this.updateUsuarioForm.get('dataNascimento').value,
        rg: this.updateUsuarioForm.get('rg').value,
        email: this.updateUsuarioForm.get('email').value,
        senha: this.updateUsuarioForm.get('senha').value,
        telefone: this.updateUsuarioForm.get('telefone').value
      });
      console.log('Perfil do usuario alterado para:', usuario);
      this.usuarioService.logado = false;
      this.navCtrl.navigateBack('/login');
    } catch (error) {
      await this.overlayService.toast({
        message: error.message
      });
      console.log('Erro ao atualizar perfil:', error);
    } finally {
      loading.dismiss();
    }
  }



}
