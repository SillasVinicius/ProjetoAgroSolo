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

@Component({
  selector: 'app-cria-usuario',
  templateUrl: './cria-usuario.page.html',
  styleUrls: ['./cria-usuario.page.scss'],
})
export class CriaUsuarioPage implements OnInit {

  // Cliente
  usuarioForm: FormGroup;
  usuarioId: string = undefined;

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
  imagesBlob: Observable<Blob[]>;
  imageBlob: Blob;

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
    private file: File
  ) {}

  // metodo que é chamado quando a pagina é carregada
  ngOnInit() {
    this.criaFormulario();
    this.usuarioService.init();
    this.usuarioService.id = '';
    this.acao();
  }


    async openGalery(){
      const options: CameraOptions = {
        quality: 100,
        destinationType: this.camera.DestinationType.FILE_URI,
        sourceType: this.camera.PictureSourceType.PHOTOLIBRARY,
        correctOrientation: true
      };

      try {
        const fileUrl: string = await this.camera.getPicture(options);
        let file: string;

        if (this.platform.is('ios')) {
          file = fileUrl.split('/').pop();
        } else {
          file= fileUrl.substring(fileUrl.lastIndexOf('/') + 1, fileUrl.indexOf('?'));
        }

        const path: string = fileUrl.substring(0, fileUrl.lastIndexOf('/'));

        const buffer: ArrayBuffer = await this.file.readAsArrayBuffer(path, file);

        const blob: Blob = new Blob([buffer], {type: "image/jpeg"});

        this.imageBlob = blob;

        this.uploadPicture(blob);

      }catch(error){
        console.error(error);
      }
    }

    async uploadPicture(blob: Blob){
        const ref = this.storage.ref(`${this.usuarioId}.jpg`);;
        const task = ref.put(blob);

        this.uploadPercent = task.percentageChanges();
        task.snapshotChanges().pipe(
          finalize(async () => {
            const loading = await this.overlayService.loading({
              message: "Carregando Foto..."
            });

            this.downloadUrl = ref.getDownloadURL();
            this.liberaArquivo = true;
            this.liberaAlterar = true;

            loading.dismiss();
          })
        ).subscribe();
    }

    async uploadPictureTo(blob: Blob){

        const ref2 = this.storage.ref(`/users/${this.usuarioId}/fotoPerfil/imagem.jpg`);
        const task2 = ref2.put(blob);

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
                cpf: this.usuarioForm.get('cpf').value,
                dataNascimento: this.retornaDataNascimento(this.usuarioForm.get('dataNascimento').value),
                rg: this.usuarioForm.get('rg').value,
                email: this.usuarioForm.get('email').value,
                senha: this.usuarioForm.get('senha').value,
                telefone: this.usuarioForm.get('telefone').value,
                foto: r
              });
              });
            })
          ).subscribe();

        }catch(error){
          alert(error);
        }


    }

    async uploadPictureToUpdate(blob: Blob){

        const ref2 = this.storage.ref(`/users/${this.usuarioId}/fotoPerfil/imagem.jpg`);
        const task2 = ref2.put(blob);

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
              cpf: this.usuarioForm.get('cpf').value,
              dataNascimento: this.retornaDataNascimento(this.usuarioForm.get('dataNascimento').value),
              rg: this.usuarioForm.get('rg').value,
              email: this.usuarioForm.get('email').value,
              senha: this.usuarioForm.get('senha').value,
              telefone: this.usuarioForm.get('telefone').value,
              foto: r
            });
            });
          })
        ).subscribe();
    }

    deletePicture(){
      const ref = this.storage.ref(`${this.usuarioId}.jpg`);;
      const task = ref.delete();
    }

  // Cria formulários
  // Cria formulários
  criaFormulario(): void {
    this.usuarioForm = this.formBuilder.group({
      senha: this.formBuilder.control('', [Validators.required, Validators.minLength(6)]),
      email: this.formBuilder.control('', [Validators.required, Validators.email]),
      nome: this.formBuilder.control('', [Validators.required, Validators.minLength(3)]),
      rg: this.formBuilder.control('', [
        Validators.required,
        Validators.minLength(8),
        Validators.maxLength(8)
      ]),
      cpf: this.formBuilder.control('', [
        Validators.required,
        Validators.minLength(14),
        Validators.maxLength(18)
      ]),
      dataNascimento: this.formBuilder.control('', [
        Validators.required
      ]),
      telefone: this.formBuilder.control('', [
        Validators.required,
        Validators.minLength(14),
        Validators.maxLength(15)
      ]),
      admin: this.formBuilder.control(false, [])
    });
  }

  // metodos get que pegam o valor do input no formulário
  get cpf(): FormControl {
    return this.usuarioForm.get('cpf') as FormControl;
  }
  get senha(): FormControl {
    return this.usuarioForm.get('senha') as FormControl;
  }
  get nome(): FormControl {
    return this.usuarioForm.get('nome') as FormControl;
  }
  get rg(): FormControl {
    return this.usuarioForm.get('rg') as FormControl;
  }
  get email(): FormControl {
    return this.usuarioForm.get('email') as FormControl;
  }
  get telefone(): FormControl {
    return this.usuarioForm.get('telefone') as FormControl;
  }
  get dataNascimento(): FormControl {
    return this.usuarioForm.get('dataNascimento') as FormControl;
  }

  // verifica se a acao é de criação ou atualização
  acao(): void {
    const usuarioId = this.route.snapshot.paramMap.get('id');
    if (!usuarioId) {
      this.pageTitle = 'Cadastrar Usuário';
      this.botaoTitle = 'CADASTRAR';
      this.toastMessage = 'Criando...';
      return;
    }
    this.usuarioId = usuarioId;
    this.pageTitle = 'Atualizar Usuário';
    this.botaoTitle = 'ATUALIZAR';
    this.toastMessage = 'Atualizando...';
    this.usuarioService
      .get(usuarioId)
      .pipe(take(1))
      .subscribe(({ nome, cpf, email, dataNascimento, rg, senha, telefone }) => {
        this.usuarioForm.get('cpf').setValue(cpf),
          this.usuarioForm.get('senha').setValue(senha),
          this.usuarioForm.get('nome').setValue(nome),
          this.usuarioForm.get('rg').setValue(rg),
          this.usuarioForm.get('email').setValue(email),
          this.usuarioForm.get('telefone').setValue(telefone),
          this.usuarioForm.get('dataNascimento').setValue(this.retornaDataMMDDYYYY(dataNascimento))
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
        this.usuarioForm.get('dataNascimento').setValue(this.retornaDataNascimento(this.usuarioForm.get('dataNascimento').value));
        const usuario = await this.usuarioService.create(this.usuarioForm.value);

        this.deletePicture();

        this.uploadPictureTo(this.imageBlob);


      } else {

        this.deletePicture();

        this.uploadPictureToUpdate(this.imageBlob);


      }
      console.log('Usuário Criado', usuario);
      this.navCtrl.navigateBack('/menu/usuario');
    } catch (error) {
      await this.overlayService.toast({
        message: error.message
      });
      console.log('Erro ao criar cliente: ', error);
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
