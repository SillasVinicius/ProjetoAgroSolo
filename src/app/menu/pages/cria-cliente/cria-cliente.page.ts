import { Component, OnInit } from '@angular/core';
import { OverlayService } from 'src/app/core/services/overlay.service';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { NavController } from '@ionic/angular';
import { finalize, take, tap } from 'rxjs/operators';
import { ClienteService } from 'src/app/core/services/cliente.service';
import { AngularFireStorage, AngularFireUploadTask } from '@angular/fire/storage';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { Observable } from 'rxjs';

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

  // FOTOS
  arquivos: FileList;
  files: Observable<any[]>;
  task: AngularFireUploadTask;
  percentage: Observable<number>;
  snapshot: Observable<any>;
  UploadedFileURL: Observable<string>;
  images: Observable<MyData[]>;
  fileName = '';
  fileSize: number;
  isUploading: boolean;
  isUploaded: boolean;
  image: MyData;
  nomeFoto: string;
  private imageCollection: AngularFirestoreCollection<MyData>;

  // ARQUIVOS
  arquivoss: FileList;
  filesArquivo: Observable<any[]>;
  taskArquivo: AngularFireUploadTask;
  percentageArquivo: Observable<number>;
  snapshotArquivo: Observable<any>;
  UploadedFileURLArquivo: Observable<string>;
  fileNameArquivo = '';
  fileSizeArquivo: number;
  isUploadingArquivo: boolean;
  isUploadedArquivo: boolean;
  arquivo: MyData;
  filess: Observable<MyData[]>;
  nomeArquivo: string;
  private fileCollection: AngularFirestoreCollection<MyData>;

  // Dependencias
  constructor(
    private formBuilder: FormBuilder,
    private overlayService: OverlayService,
    private navCtrl: NavController,
    private route: ActivatedRoute,
    private clienteService: ClienteService,
    private storage: AngularFireStorage,
    private database: AngularFirestore
  ) {
    this.isUploading = false;
    this.isUploaded = false;
    this.isUploadingArquivo = false;
    this.isUploadedArquivo = false;
  }

  ngOnInit() {
    this.criaFormulario();
    this.acao();
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
        this.adicionaFoto();
      } else {
        // tslint:disable-next-line: no-shadowed-variable
        const cliente = await this.clienteService.update({
          id: this.clienteId,
          cpf: this.clienteForm.get('cpf').value,
          nome: this.clienteForm.get('nome').value,
          foto: '',
          patrimonio: this.clienteForm.get('patrimonio').value,
          pdtvAgro: this.clienteForm.get('pdtvAgro').value
        });
      }
      console.log('Cliente Criado', cliente);
      this.navCtrl.navigateBack('/menu');
    } catch (error) {
      await this.overlayService.toast({
        message: error.message
      });
      console.log('Erro ao criar cliente: ', error);
    } finally {
      loading.dismiss();
    }
  }

  // Faz o upload de uma imagem
  uploadFile(event: FileList) {
    this.arquivos = event;
    const file = event.item(0);
    if (file.type.split('/')[0] !== 'image') {
      console.error('unsupported file type :( ');
      return;
    }

    this.isUploading = true;
    this.isUploaded = false;

    this.fileName = file.name;
    if (this.clienteService.id !== '') {
      const path = `/users/${this.clienteService.usuarioId}/cliente/${
        this.clienteService.id
      }/imagens/${new Date().getTime()}_${file.name}`;
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
}

export interface MyData {
  name: string;
  filepath: string;
  size: number;
}
