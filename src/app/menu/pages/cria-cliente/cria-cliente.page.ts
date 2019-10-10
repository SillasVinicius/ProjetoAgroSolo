import { Component, OnInit } from '@angular/core';
import { OverlayService } from 'src/app/core/services/overlay.service';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { NavController, Platform } from '@ionic/angular';
import { finalize, take } from 'rxjs/operators';
import { ClienteService } from 'src/app/core/services/cliente.service';
import { AngularFireStorage } from '@angular/fire/storage';
import { Observable } from 'rxjs';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { File } from '@ionic-native/file/ngx';



@Component({
  selector: 'app-cria-cliente',
  templateUrl: './cria-cliente.page.html',
  styleUrls: ['./cria-cliente.page.scss']
})
export class CriaClientePage implements OnInit {
  // Cliente
  clienteForm: FormGroup;
  clienteId: string = undefined;

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
    private clienteService: ClienteService,
    private storage: AngularFireStorage,
    private camera: Camera,
    private platform: Platform,
    private file: File
  ) {}

  // metodo que é chamado quando a pagina é carregada
  ngOnInit() {
    this.criaFormulario();
    this.clienteService.init();
    this.clienteService.id = '';
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
      const ref = this.storage.ref(`${this.clienteService.usuarioId}.jpg`);;
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

      const ref2 = this.storage.ref(`/users/${this.clienteService.usuarioId}/cliente/${this.clienteService.id}/imagem.jpg`);
      const task2 = ref2.put(blob);

      task2.snapshotChanges().pipe(
        finalize(async () => {

          this.downloadUrl = ref2.getDownloadURL();
          this.liberaArquivo = true;
          this.liberaAlterar = true;

          this.downloadUrl.subscribe(async r => {
            this.clienteService.init();
            const atualizarFoto = await this.clienteService.update({
              id: this.clienteService.id,
              cpf: this.clienteForm.get('cpf').value,
              nome: this.clienteForm.get('nome').value,
              foto: r,
              patrimonio: this.clienteForm.get('patrimonio').value,
              pdtvAgro: this.clienteForm.get('pdtvAgro').value
            });
          });
        })
      ).subscribe();
  }

  async uploadPictureToUpdate(blob: Blob){

      const ref2 = this.storage.ref(`/users/${this.clienteService.usuarioId}/cliente/${this.clienteService.id}/imagem.jpg`);
      const task2 = ref2.put(blob);

      task2.snapshotChanges().pipe(
        finalize(async () => {

          this.downloadUrl = ref2.getDownloadURL();
          this.liberaArquivo = true;
          this.liberaAlterar = true;

          this.downloadUrl.subscribe(async r => {
            this.clienteService.init();
            const cliente = await this.clienteService.update({
              id: this.clienteId,
              cpf: this.clienteForm.get('cpf').value,
              nome: this.clienteForm.get('nome').value,
              foto: r,
              patrimonio: this.clienteForm.get('patrimonio').value,
              pdtvAgro: this.clienteForm.get('pdtvAgro').value
            });
          });
        })
      ).subscribe();
  }

  deletePicture(){
    const ref = this.storage.ref(`${this.clienteService.usuarioId}.jpg`);
    const task = ref.delete();
  }

  // Cria formulários
  criaFormulario(): void {
    this.clienteForm = this.formBuilder.group({
      nome: this.formBuilder.control('', [Validators.required, Validators.minLength(3)]),
      cpf: this.formBuilder.control('', [
        Validators.required,
        Validators.minLength(14),
        Validators.maxLength(18)
      ]),
      patrimonio: this.formBuilder.control('', [
        Validators.required,
        Validators.minLength(3)
      ]),
      pdtvAgro: this.formBuilder.control('', [
        Validators.required,
        Validators.minLength(3)
      ])
    });
  }

  // metodos get que pegam o valor do input no formulário
  get cpf(): FormControl {
    return this.clienteForm.get('cpf') as FormControl;
  }
  get pdtvAgro(): FormControl {
    return this.clienteForm.get('pdtvAgro') as FormControl;
  }
  get nome(): FormControl {
    return this.clienteForm.get('nome') as FormControl;
  }
  get patrimonio(): FormControl {
    return this.clienteForm.get('patrimonio') as FormControl;
  }

  // verifica se a acao é de criação ou atualização
  acao(): void {
    const clienteId = this.route.snapshot.paramMap.get('id');
    if (!clienteId) {
      this.pageTitle = 'Cadastrar Cliente';
      this.botaoTitle = 'CADASTRAR';
      this.toastMessage = 'Criando...';
      return;
    }
    this.clienteId = clienteId;
    this.pageTitle = 'Atualizar Cliente';
    this.botaoTitle = 'ATUALIZAR';
    this.toastMessage = 'Atualizando...';
    this.clienteService
      .get(clienteId)
      .pipe(take(1))
      .subscribe(({ nome, cpf, patrimonio, pdtvAgro}) => {
        this.clienteForm.get('nome').setValue(nome),
          this.clienteForm.get('cpf').setValue(cpf),
          this.clienteForm.get('patrimonio').setValue(patrimonio),
          this.clienteForm.get('pdtvAgro').setValue(pdtvAgro)
      });
  }

  async cadastraListaGlobal(id: string) {
    this.clienteService.initCliente();
    const cliente = await this.clienteService.createGlobal(this.clienteForm.value, id);
  }

  async AtualizaListaGlobal() {
    this.clienteService.initCliente();
    const cliente = await this.clienteService.update({
      id: this.clienteId,
      cpf: this.clienteForm.get('cpf').value,
      nome: this.clienteForm.get('nome').value,
      patrimonio: this.clienteForm.get('patrimonio').value,
      pdtvAgro: this.clienteForm.get('pdtvAgro').value
    });
  }

  // método que envia os dados do formulário para o banco de dados
  async onSubmit(): Promise<void> {
    const loading = await this.overlayService.loading({
      message: this.toastMessage
    });
    try {
      const cliente = '';
      if (!this.clienteId) {
        this.clienteService.init();
        const cliente = await this.clienteService.create(this.clienteForm.value);
        this.cadastraListaGlobal(this.clienteService.id);

        this.deletePicture();

        this.uploadPictureTo(this.imageBlob);




      } else {

        this.deletePicture();

        this.uploadPictureToUpdate(this.imageBlob);

        this.AtualizaListaGlobal();


      }
      console.log('Cliente Criado', cliente);
      this.navCtrl.navigateBack('/menu/cliente');
    } catch (error) {
      await this.overlayService.toast({
        message: error.message
      });
      console.log('Erro ao criar cliente: ', error);
    } finally {
      loading.dismiss();
    }
  }

}
