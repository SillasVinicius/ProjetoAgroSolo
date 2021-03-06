import { Component, OnInit } from '@angular/core';
import { OverlayService } from 'src/app/core/services/overlay.service';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { NavController, Platform } from '@ionic/angular';
import { finalize, take } from 'rxjs/operators';
import { UsuarioService } from 'src/app/core/services/usuario.service';
import { AngularFireStorage } from '@angular/fire/storage';
import { Observable } from 'rxjs';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { File } from '@ionic-native/file/ngx';
import { trigger, state, transition, style, animate } from '@angular/animations';
import { ClienteService } from 'src/app/core/services/cliente.service';
import { Cliente } from 'src/app/menu/models/cliente.model';
import { Usuario } from 'src/app/autentificacao/pages/login/model/usuario.model';

@Component({
  selector: 'app-cria-usuario',
  templateUrl: './cria-usuario.page.html',
  styleUrls: ['./cria-usuario.page.scss'],
  animations: [
    trigger('tamanhoArquivo', [
      state('semArquivo', style({ 'height': '100px' })),
      state('comArquivo', style({ 'height': '250px' })),
      transition('antes => depois', [style({ transition: '0.2s' }), animate('100ms 0s ease-in')]),
      transition('depois => antes', [style({ transition: '0.2s' }), animate('100ms 0s ease-in')])
    ]),
    trigger('marginBotao', [
      state('semArquivo', style({ 'margin-top': '2px' })),
      state('comArquivo', style({ 'margin-top': '30px' })),
      transition('antes => depois', [style({ transition: '0.1s' }), animate('100ms 0s ease-in')]),
      transition('depois => antes', [style({ transition: '0.1s' }), animate('100ms 0s ease-in')])
    ]),
  ]
})
export class CriaUsuarioPage implements OnInit {

  // usuario
  usuarioForm: FormGroup;
  usuarioId: string = undefined;
  admin: boolean = false;
  update: boolean = false;

  // Validacao
  botaoTitle = '...';
  pageTitle = '...';
  toastMessage = '...';
  liberaArquivo = false;
  liberaAlterar = false;

  // FOTOS
  public uploadPercent: Observable<number>;
  public downloadUrl: Observable<string>;
  public urlFoto: string;
  arquivos: Object;
  files2: Observable<any[]>;
  fileName = '';
  novaFoto = false;
  fotoAntigo: any;

  //Validação de email;
  clientes: Cliente[] = [];
  usuarios: Usuario[] = [];
  validar_email_existe: boolean;
  email_atual: string;

  senha_cript: string;
  senha_banco: string; 

  campoValidacaoSenha: string;

  // Dependencias
  constructor(
    private formBuilder: FormBuilder,
    private overlayService: OverlayService,
    private navCtrl: NavController,
    private route: ActivatedRoute,
    private usuarioService: UsuarioService,
    private storage: AngularFireStorage,
    private camera: Camera,
    private platform: Platform,
    private file: File,
    private clienteService: ClienteService,
  ) { }

  

  // metodo que é chamado quando a pagina é carregada
  ngOnInit() {
    this.criaFormulario();

    if (this.usuarioService.admin) {
      this.usuarioService.init();
      this.admin = true;
    }
    else {
      this.usuarioService.init();
      this.admin = false;
    }
   

    this.usuarioService.init();
    this.usuarioService.getAll().subscribe((u: Usuario[]) => {
        for(let i = 0; i<u.length; i++){
          this.usuarios[i] = u[i];
        }
      }); 

      this.clienteService.init();
      this.clienteService.getAll().subscribe((c: Cliente[]) => {
          for(let i = 0; i<c.length; i++){
            this.clientes[i] = c[i];
          }
        }); 

    this.acao();
  }

   // Cria formulários
   criaFormulario(): void {
    this.usuarioForm = this.formBuilder.group({
      senha: this.formBuilder.control('', [Validators.required, Validators.minLength(6)]),
      email: this.formBuilder.control('', [Validators.required, Validators.email]),
      nome: this.formBuilder.control('', [Validators.required, Validators.minLength(3)]),
      admin: this.formBuilder.control(true, [])
    });
  }

   // metodos get que pegam o valor do input no formulário

   get senha(): FormControl {
    return this.usuarioForm.get('senha') as FormControl;
  }
  get nome(): FormControl {
    return this.usuarioForm.get('nome') as FormControl;
  }
  get email(): FormControl {
    return this.usuarioForm.get('email') as FormControl;
  }

  acao(): void {
    const usuarioId = this.route.snapshot.paramMap.get('id');
    if (!usuarioId) {
      this.pageTitle = 'Cadastrar Administrador';
      this.botaoTitle = 'CADASTRAR';
      this.toastMessage = 'Criando...';
      return;
    }
    this.usuarioId = usuarioId;
    this.pageTitle = 'Atualizar Administrador';
    this.botaoTitle = 'ATUALIZAR';
    this.toastMessage = 'Atualizando...';
    this.liberaArquivo = true;
    this.usuarioService.id = '';
    this.usuarioService
      .get(usuarioId)
      .pipe(take(1))
      .subscribe(({ nome, email, senha, foto, nomeFoto }) => {
        this.usuarioForm.get('senha').setValue(senha),
          this.usuarioForm.get('nome').setValue(nome),
          this.usuarioForm.get('email').setValue(email),
          this.email_atual = email,
          this.senha_cript = senha;
          this.urlFoto = foto;
        this.fileName = nomeFoto;
        this.fotoAntigo = nomeFoto;
      });
  }

   // verifica se a acao é de criação ou atualização
   async AtualizaListaGlobal() {
    this.usuarioService.init();
    await this.usuarioService.update({
      id: this.usuarioId,
      nome: this.usuarioForm.get('nome').value,
      senha: this.senha_banco,
      email: this.usuarioForm.get('email').value,
    });
  }

  // método que envia os dados do formulário para o banco de dados
  async onSubmit(): Promise<void> {
    const loading = await this.overlayService.loading({
      message: this.toastMessage
    });
    this.validar_email_existe = false;
    // if para alteração(*) e o else para inserção(#) 
    if (this.email_atual)//*
    {
      //validar se o usuario está inserindo o mesmo email.
      if (this.email_atual == this.usuarioForm.get('email').value)
        this.validar_email_existe = false;
      else
      {
        for (let i = 0; i < this.usuarios.length; i++) {
          if (this.usuarios[i].email == this.usuarioForm.get('email').value) {
            this.validar_email_existe = true;     
            break;
          }
          }
  
          if (!this.validar_email_existe) {
            for (let i = 0; i < this.clientes.length; i++) {
              if (this.clientes[i].email == this.usuarioForm.get('email').value) {
                this.validar_email_existe = true;
                break;
              }
            }
          }
      }
    }
    else //#
    {
      for (let i = 0; i < this.usuarios.length; i++) {
        if (this.usuarios[i].email == this.usuarioForm.get('email').value) {
          this.validar_email_existe = true;     
          break;
        }
        }

        if (!this.validar_email_existe) {
          for (let i = 0; i < this.clientes.length; i++) {
            if (this.clientes[i].email == this.usuarioForm.get('email').value) {
              this.validar_email_existe = true;
              break;
            }
          }
        }
    }

    if (this.validar_email_existe) {
      await this.overlayService.toast({
        message: "Este email já está sendo usado por outro usuário!"
      });
      loading.dismiss();
      return;
    }

    //hash
    const sha1 = require('sha1');
    if (this.senha_cript ==  this.usuarioForm.get('senha').value)
        this.senha_banco = this.senha_cript;
    else this.senha_banco = sha1(this.usuarioForm.get('senha').value);

    this.usuarioForm.get('senha').setValue(this.senha_banco);

    try {
      const usuario = '';
      if (!this.usuarioId) {

        const usuario = await this.usuarioService.create(this.usuarioForm.value);
        this.deletePicture();
        this.uploadFileTo(this.arquivos);

      } else {

        if (this.novaFoto) {
          if (this.fotoAntigo !== "") {
            this.deletePicturePasta();
            // deleta a foto temporaria que foi feito upload no servidor
            this.deletePicture();
          }
          this.uploadFileTo(this.arquivos);
          this.novaFoto = false;
        } else {
          this.AtualizaListaGlobal();
        }

      }
      console.log('Administrador Criado', usuario);
      await this.overlayService.toast({
        message: "Administrador Criado!"
      });
      this.navCtrl.navigateBack('/menu/usuario');
    } catch (error) {
      await this.overlayService.toast({
        message: error.message
      });
      console.log('Erro ao criar administrador: ', error);
    } finally {
      loading.dismiss();
    }
  }

  async uploadFile(file: Object) {
    const ref = this.storage.ref(`foto${this.fileName}`);
    const task = ref.put(file);
    //
    this.uploadPercent = task.percentageChanges();
    task.snapshotChanges().pipe(
      finalize(async () => {
        const loading = await this.overlayService.loading({
          message: "Carregando Foto..."
        });
        this.downloadUrl = ref.getDownloadURL();
        this.liberaArquivo = true;
        this.downloadUrl.subscribe(async r => {
          this.urlFoto = r;
        });

        loading.dismiss();
      })
    ).subscribe();
  }


  async openGalery(event: FileList) {
    try {
      const file = event.item(0);
      if (file.type.split('/')[0] !== 'image') {
        await this.overlayService.toast({
          message: 'tipo de arquivo não pode ser enviado por esse campo :('
        });
        return;
      }
      this.fileName = file.name;
      this.arquivos = file;
      this.uploadFile(this.arquivos);
      this.novaFoto = true;

    } catch (error) {
      console.error(error);
    }
  }

  

  async uploadFileTo(file: Object) {

    let idUser = (this.usuarioService.id === '') ? this.usuarioId : this.usuarioService.id;

    const ref2 = this.storage.ref(`/AdmnistradorFoto${idUser}/${this.fileName}`);
    const task2 = ref2.put(file);

    try {

      task2.snapshotChanges().pipe(
        finalize(async () => {

          this.downloadUrl = ref2.getDownloadURL();
          this.liberaArquivo = true;
          this.liberaAlterar = true;
          this.downloadUrl.subscribe(async r => {
            this.usuarioService.init();
            await this.usuarioService.update({
              id: idUser,
              nome: this.usuarioForm.get('nome').value,
              email: this.usuarioForm.get('email').value,
              senha: this.senha_banco,
              foto: r,
              nomeFoto: this.fileName
            });
          });
        })
      ).subscribe();

    } catch (error) {
      alert(error);
    }


  }

  deletePicture() {
    const ref = this.storage.ref(`foto${this.fileName}`);;
    const task = ref.delete();
  }

  deletePicturePasta() {
    let idUser = (this.usuarioService.id === '') ? this.usuarioId : this.usuarioService.id;

    const ref = this.storage.ref(`/AdmnistradorFoto${idUser}/`);
    ref.child(`${this.fotoAntigo}`).delete();
  }

 

  clearField(){   
      this.campoValidacaoSenha = this.usuarioForm.get('senha').value; 
      this.usuarioForm.get('senha').reset();         
  }

  verificarSenha(){
    if(!this.usuarioForm.get('senha').value) {
        this.usuarioForm.get('senha').setValue(this.campoValidacaoSenha);    
    }
  }
 
  retornaDataNascimento(data: string): string {

    if (data.length > 10) {
      //2019-10-04T08:45:55.822-03:00
      let ano: string = data.substring(0, 4);
      let mes: string = data.substring(5, 7);
      let dia: string = data.substring(8, 10);

      return `${dia}/${mes}/${ano}`;
    }
    else {
      return this.retornaDataMMDDYYYY(data);
    }
  }

  retornaDataMMDDYYYY(data: string): string {
    if (data.length === 10) {
      //04/03/2001
      let ano: string = data.substring(6);
      let mes: string = data.substring(3, 5);
      let dia: string = data.substring(0, 2);

      return `${mes}/${dia}/${ano}`;
    }
    else {
      return 'error data';
    }
  }

}
