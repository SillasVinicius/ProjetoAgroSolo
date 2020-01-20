import { Component, OnInit } from '@angular/core';
import { OverlayService } from 'src/app/core/services/overlay.service';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { NavController, Platform } from '@ionic/angular';
import { finalize, take, tap } from 'rxjs/operators';
import { AngularFireStorage, AngularFireUploadTask } from '@angular/fire/storage';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { File } from '@ionic-native/file/ngx';
import { UsuarioService } from 'src/app/core/services/usuario.service';
import { trigger, state, transition, style, animate } from '@angular/animations';
import { ClienteService } from 'src/app/core/services/cliente.service';
import { Cliente } from 'src/app/menu/models/cliente.model';
import { Usuario } from 'src/app/autentificacao/pages/login/model/usuario.model';

@Component({
  selector: 'app-altera-usuario',
  templateUrl: './altera-usuario.page.html',
  styleUrls: ['./altera-usuario.page.scss'],
  animations: [
    trigger('tamanhoArquivo', [
      state('semArquivo', style({ 'height': '100px'})),
      state('comArquivo', style({ 'height': '250px'})),
      transition('antes => depois', [style({ transition: '0.2s' }), animate('100ms 0s ease-in')]),
      transition('depois => antes', [style({ transition: '0.2s' }), animate('100ms 0s ease-in')])
    ]), 
    trigger('marginBotao', [
      state('semArquivo', style({ 'margin-top': '2px'})),
      state('comArquivo', style({ 'margin-top': '30px'})),
      transition('antes => depois', [style({ transition: '0.1s' }), animate('100ms 0s ease-in')]),
      transition('depois => antes', [style({ transition: '0.1s' }), animate('100ms 0s ease-in')])
    ]),
  ]
})
export class AlteraUsuarioPage implements OnInit {

  // Alterar Perfil
  updateUsuarioForm: FormGroup;
  updateUsuarioId: string = undefined;

  // Validacao
  numberPattern = /^[0-9]*$/;
  liberaArquivo = false;
  liberaAlterar = false;


  //FOTOS
  public uploadPercent: Observable<number>;
  public downloadUrl: Observable<string>;
  public urlFoto: string;
  arquivos: Object;
  files2: Observable<any[]>;
  fileName = '';

  //Validação de email;
  clientes : Cliente [] = [];
  usuarios : Usuario [] = [];
  validar_email_existe : boolean;
  email_atual: string;


  // Dependencias
  constructor(
    private formBuilder: FormBuilder,
    private overlayService: OverlayService,
    private navCtrl: NavController,
    private route: ActivatedRoute,
    private usuarioService: UsuarioService,
    private storage: AngularFireStorage,
    private database: AngularFirestore,
    private camera: Camera,
    private platform: Platform,
    private file: File,
    private clienteService: ClienteService
  ){}

  
  // metodo que é chamado quando a pagina é carregada
  ngOnInit() {
    this.criaFormulario();
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

  retornaDataNascimento(data: string): string {

    if (data.length > 10) {
      //2019-10-04T08:45:55.822-03:00
      let ano: string = data.substring(0,4);
      let mes: string = data.substring(5,7);
      let dia: string = data.substring(8,10);

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
      let mes: string = data.substring(3,5);
      let dia: string = data.substring(0,2);

      return `${mes}/${dia}/${ano}`;
    }
    else {
      return 'error data';
    }
  }

  async openGalery(event: FileList){
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
      this.uploadFile(file);

    }catch(error){
      console.error(error);
    }
  }

  async uploadFile(file: Object){
      const ref = this.storage.ref(`${this.fileName}`);
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

  async uploadFileTo(file: Object){

      const ref2 = this.storage.ref(`/users/${this.updateUsuarioId}/fotoPerfil/${this.fileName}`);
      const task2 = ref2.put(file);

      task2.snapshotChanges().pipe(
        finalize(async () => {

          this.downloadUrl = ref2.getDownloadURL();
          this.liberaArquivo = true;
          this.liberaAlterar = true;

          this.downloadUrl.subscribe(async r => {
            this.usuarioService.init();
            const usuario = await this.usuarioService.update({
            id: this.updateUsuarioId,
            nome: this.updateUsuarioForm.get('nome').value,
            email: this.updateUsuarioForm.get('email').value,
            senha: this.updateUsuarioForm.get('senha').value,

            foto: r
          });
          });
        })
      ).subscribe();
  }

  deletePicture(){
    const ref = this.storage.ref(`${this.fileName}`);
    const task = ref.delete();
  }

  // Cria formulários
  criaFormulario(): void {
    this.updateUsuarioForm = this.formBuilder.group({
      senha: this.formBuilder.control('', [Validators.required, Validators.minLength(6)]),
      email: this.formBuilder.control('', [Validators.required, Validators.email]),
      nome: this.formBuilder.control('', [Validators.required, Validators.minLength(3)])

    });
  }

  // atualização
  acao(): void {
    const updateUsuarioId = this.route.snapshot.paramMap.get('id');
    this.updateUsuarioId = updateUsuarioId;
    this.usuarioService
      .get(updateUsuarioId)
      .pipe(take(1))
      .subscribe(({ nome, email, senha }) => {

          this.updateUsuarioForm.get('senha').setValue(senha),
          this.updateUsuarioForm.get('nome').setValue(nome),
          this.updateUsuarioForm.get('email').setValue(email)


      });

      this.email_atual = this.updateUsuarioForm.get('email').value;
  }

  // metodos get que pegam o valor do input no formulário
  
  get senha(): FormControl {
    return this.updateUsuarioForm.get('senha') as FormControl;
  }
  get nome(): FormControl {
    return this.updateUsuarioForm.get('nome') as FormControl;
  }
  get email(): FormControl {
    return this.updateUsuarioForm.get('email') as FormControl;
  }


  // método que envia os dados do formulário para o banco de dados
  async onSubmit(): Promise<void> {
    
    const loading = await this.overlayService.loading({
      message: 'Alterando Perfil...'
    });


    try {
      
      this.deletePicture();

      this.uploadFileTo(this.arquivos);

      this.navCtrl.navigateBack('/login');
      this.usuarioService.logado = false;
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
