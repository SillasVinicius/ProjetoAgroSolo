import { Component, OnInit } from '@angular/core';
import { OverlayService } from 'src/app/core/services/overlay.service';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { NavController, Platform } from '@ionic/angular';
import { finalize, take, tap } from 'rxjs/operators';
import { ClienteService } from 'src/app/core/services/cliente.service';
import { AngularFireStorage, AngularFireUploadTask } from '@angular/fire/storage';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
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
  numberPattern = /^[0-9]*$/;
  botaoTitle = '...';
  pageTitle = '...';
  toastMessage = '...';
  liberaArquivo = false;
  liberaAlterar = false;

  // FOTOS
  public uploadPercent: Observable<number>;
  public downloadUrl: Observable<string>;
  public urlFoto: string;
  arquivos: FileList;
  files: Observable<any[]>;
  task: AngularFireUploadTask;
  percentage: Observable<number>;
  snapshot: Observable<any>;
  UploadedFileURL: Observable<string>;
  images: Observable<MyData[]>;
  imagesBlob: Observable<Blob[]>;
  fileName = '';
  fileSize: number;
  isUploading: boolean;
  isUploaded: boolean;
  image: MyData;
  imageBlob: Blob;
  nomeFoto: string;
  private imageCollection: AngularFirestoreCollection<MyData>;
  private imageCollectionBlob: AngularFirestoreCollection<Blob>;

  // ARQUIVOS
  arquivos2: FileList;
  files2: Observable<any[]>;
  task2: AngularFireUploadTask;
  percentage2: Observable<number>;
  snapshot2: Observable<any>;
  UploadedFileURL2: Observable<string>;
  images2: Observable<MyData[]>;
  fileName2 = '';
  fileSize2: number;
  isUploading2: boolean;
  isUploaded2: boolean;
  image2: MyData;
  nomeFoto2: string;
  private imageCollection2: AngularFirestoreCollection<MyData>;

  // Dependencias
  constructor(
    private formBuilder: FormBuilder,
    private overlayService: OverlayService,
    private navCtrl: NavController,
    private route: ActivatedRoute,
    private clienteService: ClienteService,
    private storage: AngularFireStorage,
    private database: AngularFirestore,
    private camera: Camera,
    private platform: Platform,
    private file: File
  ) {
    this.isUploading = false;
    this.isUploaded = false;
    this.isUploading2 = false;
    this.isUploaded2 = false;
  }

  // metodo que é chamado quando a pagina é carregada
  ngOnInit() {
    this.criaFormulario();
    this.acao();
    this.clienteService.init();
    this.clienteService.id = '';
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

  private mudaUrlFoto(url: string){
    this.urlFoto = url;
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
        Validators.pattern(this.numberPattern),
        Validators.minLength(11),
        Validators.maxLength(11)
      ]),
      patrimonio: this.formBuilder.control('', [
        Validators.required,
        Validators.pattern(this.numberPattern),
        Validators.minLength(3),
        Validators.maxLength(15)
      ]),
      pdtvAgro: this.formBuilder.control('', [
        Validators.required,
        Validators.pattern(this.numberPattern),
        Validators.minLength(3),
        Validators.maxLength(15)
      ]),
      foto: this.formBuilder.control('', [])
    });
  }

  // metodos get que pegam o valor do input no formulário
  get cpf(): FormControl {
    return this.clienteForm.get('cpf') as FormControl;
  }
  get foto(): FormControl {
    return this.clienteForm.get('foto') as FormControl;
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
      .subscribe(({ nome, cpf, patrimonio, pdtvAgro, foto }) => {
        this.clienteForm.get('nome').setValue(nome),
          this.clienteForm.get('cpf').setValue(cpf),
          this.clienteForm.get('patrimonio').setValue(patrimonio),
          this.clienteForm.get('pdtvAgro').setValue(pdtvAgro),
          this.clienteForm.get('foto').setValue(foto);
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
        // tslint:disable-next-line: no-shadowed-variable
        const cliente = await this.clienteService.create(this.clienteForm.value);

        this.deletePicture();

        this.uploadPictureTo(this.imageBlob);


      } else {
        // tslint:disable-next-line: no-shadowed-variable
        const cliente = await this.clienteService.update({
          id: this.clienteId,
          cpf: this.clienteForm.get('cpf').value,
          nome: this.clienteForm.get('nome').value,
          patrimonio: this.clienteForm.get('patrimonio').value,
          pdtvAgro: this.clienteForm.get('pdtvAgro').value
        });
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

  // Imagens - inicio
  // Faz o upload de uma imagem
  async uploadFile(event: FileList) {
    this.arquivos = event;
    const file = event.item(0);
    if (file.type.split('/')[0] !== 'image') {
      await this.overlayService.toast({
        message: 'tipo de arquivo não suportado :('
      });
      return;
    }

    this.isUploading = true;
    this.isUploaded = false;
    this.liberaArquivo = true;
    this.fileName = file.name;
    if (this.clienteService.id !== '') {
      const path = `/users/${this.clienteService.usuarioId}/cliente/${
        this.clienteService.id
      }/imagens/${file.name}`;
      const customMetadata = { app: 'Image Upload' };
      const fileRef = this.storage.ref(path);
      this.task = this.storage.upload(path, file, { customMetadata });
      this.percentage = this.task.percentageChanges();
      this.snapshot = this.task.snapshotChanges().pipe(
        finalize(() => {
          this.UploadedFileURL = fileRef.getDownloadURL();
          this.UploadedFileURL.subscribe(
            resp => {
              this.addImagetoDB({
                name: file.name,
                filepath: resp,
                size: this.fileSize
              });
              this.isUploading = false;
              this.isUploaded = true;
            },
            error => {
              console.error(error);
            }
          );
        }),
        tap(snap => {
          this.fileSize = snap.totalBytes;
        })
      );
      this.image = {
        name: this.fileName,
        size: file.size,
        filepath: path
      };
    }
  }

  // adiciona a imagem no banco de dados
  addImagetoDB(image: MyData) {
    const id = this.database.createId();
    this.imageCollection
      .doc(id)
      .set(image)
      .then(resp => {
        console.log(resp);
      })
      .catch(error => {
        console.log('error ' + error);
      });
  }

  // define as variáveis necessárias para realizar o upload de imagens pro banco de dados
  iniciaUploadFotos() {
    this.isUploading = false;
    this.isUploaded = false;
    this.imageCollection = this.database.collection<MyData>(
      `/users/${this.clienteService.usuarioId}/cliente/${this.clienteService.id}/imagens`
    );
    this.images = this.imageCollection.valueChanges();
  }

  // executa todos os metodós para realizar upload de fotos
  adicionaFoto(): void {
    this.iniciaUploadFotos();
    this.uploadFile(this.arquivos);
    this.iniciaUploadFotos();
    this.clienteService.setCollectionFoto(this.clienteService.id);
    this.clienteService.collection.doc(this.image.name).set(this.image);
  }

  // Imagens - fim
  // Arquivos - início
  // Faz o upload de um arquivo
  async uploadFile2(event2: FileList) {
    this.arquivos2 = event2;
    const file2 = event2.item(0);
    if (file2.type.split('/')[0] === 'image') {
      await this.overlayService.toast({
        message: 'tipo de arquivo não pode ser enviado por esse campo :('
      });
      return;
    }

    this.isUploading2 = true;
    this.isUploaded2 = false;

    this.fileName2 = file2.name;
    if (this.clienteService.id !== '') {
      const path2 = `/users/${this.clienteService.usuarioId}/cliente/${
        this.clienteService.id
      }/arquivos/${new Date().getTime()}_${file2.name}`;
      const customMetadata = { app: 'File Upload' };
      const fileRef2 = this.storage.ref(path2);
      this.task2 = this.storage.upload(path2, file2, { customMetadata });
      this.percentage2 = this.task2.percentageChanges();
      this.snapshot2 = this.task2.snapshotChanges().pipe(
        finalize(() => {
          this.UploadedFileURL2 = fileRef2.getDownloadURL();
          this.UploadedFileURL2.subscribe(
            resp2 => {
              this.addImagetoDB2({
                name: file2.name,
                filepath: resp2,
                size: this.fileSize2
              });
              this.isUploading2 = false;
              this.isUploaded2 = true;
            },
            error2 => {
              console.error(error2);
            }
          );
        }),
        tap(snap2 => {
          this.fileSize2 = snap2.totalBytes;
        })
      );
      this.image2 = {
        name: this.fileName2,
        size: file2.size,
        filepath: path2
      };
    }
  }

  // adiciona um arquivo no banco de dados
  addImagetoDB2(image2: MyData) {
    const id2 = this.database.createId();
    this.imageCollection2
      .doc(id2)
      .set(image2)
      .then(resp2 => {
        console.log(resp2);
      })
      .catch(error2 => {
        console.log('error ' + error2);
      });
  }

  // define as variáveis necessárias para realizar o upload de imagens pro banco de dados
  iniciaUploadFotos2() {
    this.isUploading2 = false;
    this.isUploaded2 = false;
    this.imageCollection2 = this.database.collection<MyData>(
      `/users/${this.clienteService.usuarioId}/cliente/${this.clienteService.id}/arquivos`
    );
    this.images2 = this.imageCollection2.valueChanges();
  }

  // executa todos os metodós para realizar upload de fotos
  adicionaFoto2(): void {
    this.iniciaUploadFotos2();
    this.uploadFile2(this.arquivos2);
    this.iniciaUploadFotos2();
    this.clienteService.setCollectionArquivo(this.clienteService.id);
    this.clienteService.collection.doc(this.image2.name).set(this.image2);
  }
  // Arquivos - fim
}

export interface MyData {
  name: string;
  filepath: string;
  size: number;
}
