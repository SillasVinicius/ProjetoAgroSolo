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

@Component({
  selector: 'app-cria-usuario',
  templateUrl: './cria-usuario.page.html',
  styleUrls: ['./cria-usuario.page.scss'],
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
  ) {}

  // metodo que é chamado quando a pagina é carregada
  ngOnInit() {
    this.criaFormulario();

    if (this.usuarioService.admin) {
      this.usuarioService.init();
      console.log('this.usuarioService.init();');
      this.admin = true;
    }
    else {
      this.usuarioService.init();
      console.log('this.usuarioService.init();');
      this.admin = false;
    }

    this.acao();
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

        const ref2 = this.storage.ref(`/users/${this.usuarioService.id}/usuario/${this.usuarioService.id}/${this.fileName}`);
        const task2 = ref2.put(file);

        try{

          task2.snapshotChanges().pipe(
            finalize(async () => {

              this.downloadUrl = ref2.getDownloadURL();
              this.liberaArquivo = true;
              this.liberaAlterar = true;

              this.downloadUrl.subscribe(async r => {
                this.usuarioService.init();
                const usuario = await this.usuarioService.update({
                id: this.usuarioService.id,
                nome: this.usuarioForm.get('nome').value,
                email: this.usuarioForm.get('email').value,
                senha: this.usuarioForm.get('senha').value,
                foto: r
              });
              });
            })
          ).subscribe();

        }catch(error){
          alert(error);
        }


    }

    async uploadFileToUpdate(file: Object){

        const ref2 = this.storage.ref(`/users/${this.usuarioService.id}/usuario/${this.usuarioService.id}/${this.fileName}`);
        const task2 = ref2.put(file);

        task2.snapshotChanges().pipe(
          finalize(async () => {

            this.downloadUrl = ref2.getDownloadURL();
            this.liberaArquivo = true;
            this.liberaAlterar = true;

            this.downloadUrl.subscribe(async r => {
              this.usuarioService.init();
              const usuario = await this.usuarioService.update({
              id: this.usuarioId,
              nome: this.usuarioForm.get('nome').value,
              email: this.usuarioForm.get('email').value,
              senha: this.usuarioForm.get('senha').value,
              foto: r
            });
            });
          })
        ).subscribe();
    }

    deletePicture(){
      const ref = this.storage.ref(`${this.fileName}`);;
      const task = ref.delete();
    }

  // Cria formulários
  // Cria formulários
  criaFormulario(): void {
    this.usuarioForm = this.formBuilder.group({
      senha: this.formBuilder.control('', [Validators.required, Validators.minLength(6)]),
      email: this.formBuilder.control('', [Validators.required, Validators.email]),
      nome: this.formBuilder.control('', [Validators.required, Validators.minLength(3)]),
      admin: this.formBuilder.control(false, [])
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



  // verifica se a acao é de criação ou atualização
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
    this.usuarioService
      .get(usuarioId)
      .pipe(take(1))
      .subscribe(({ nome, email, senha }) => {
          this.usuarioForm.get('senha').setValue(senha),
          this.usuarioForm.get('nome').setValue(nome),
          this.usuarioForm.get('email').setValue(email)
      });
  }


  async cadastraListaGlobal(id: string) {
    this.usuarioService.init();
    const usuario = await this.usuarioService.createGlobal(this.usuarioForm.value, id);
  }

  async AtualizaListaGlobal() {
    this.usuarioService.init();
    const usuario = await this.usuarioService.update({
      id: this.usuarioId,
      nome: this.usuarioForm.get('nome').value,
      senha: this.usuarioForm.get('senha').value,
      email: this.usuarioForm.get('email').value,
    });
  }


  // método que envia os dados do formulário para o banco de dados
  async onSubmit(): Promise<void> {
    const loading = await this.overlayService.loading({
      message: this.toastMessage
    });
    try {
      const usuario = '';
      if (!this.usuarioId) {
        const usuario = await this.usuarioService.create(this.usuarioForm.value);
        this.deletePicture();
        this.uploadFileTo(this.arquivos);
      } else {

        //this.deletePicture();

        //this.uploadPictureToUpdate(this.imageBlob);



      }
      console.log('Administrador Criado', usuario);
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

}
