import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { OverlayService } from 'src/app/core/services/overlay.service';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { CriaClienteService } from 'src/app/core/services/cria-cliente.service';
import { NavController, AlertController } from '@ionic/angular';
import { Camera, CameraOptions, PictureSourceType } from '@ionic-native/Camera/ngx';
import {
  ActionSheetController,
  ToastController,
  Platform,
  LoadingController
} from '@ionic/angular';
import { File, FileEntry } from '@ionic-native/File/ngx';
import { HttpClient } from '@angular/common/http';
import { WebView } from '@ionic-native/ionic-webview/ngx';
import { Storage } from '@ionic/storage';
import { FilePath } from '@ionic-native/file-path/ngx';

import { finalize, take, tap } from 'rxjs/operators';
import { ClienteService } from 'src/app/core/services/cliente.service';

import { AngularFireStorage, AngularFireUploadTask } from '@angular/fire/storage';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { DataService } from 'src/app/core/services/data.service';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';
import { UsuarioService } from 'src/app/core/services/usuario.service';

const STORAGE_KEY = 'my_images';
@Component({
  selector: 'app-cria-cliente',
  templateUrl: './cria-cliente.page.html',
  styleUrls: ['./cria-cliente.page.scss']
})
export class CriaClientePage implements OnInit {
  clienteForm: FormGroup;
  numberPattern = /^[0-9]*$/;
  botaoTitle = '...';
  pageTitle = '...';
  toastMessage = '...';
  clienteId: string = undefined;

  files: Observable<any[]>;
  // Upload Task
  task: AngularFireUploadTask;

  // Progress in percentage
  percentage: Observable<number>;

  // Snapshot of uploading file
  snapshot: Observable<any>;

  // Uploaded File URL
  UploadedFileURL: Observable<string>;

  //Uploaded Image List
  images: Observable<MyData[]>;

  //File details
  fileName: string = '';
  fileSize: number;

  //Status check
  isUploading: boolean;
  isUploaded: boolean;

  private imageCollection: AngularFirestoreCollection<MyData>;

  constructor(
    private formBuilder: FormBuilder,
    private overlayService: OverlayService,
    private navCtrl: NavController,
    private criaClienteService: CriaClienteService,
    private route: ActivatedRoute,
    private camera: Camera,
    private file: File,
    private http: HttpClient,
    private webview: WebView,
    private actionSheetController: ActionSheetController,
    private toastController: ToastController,
    private plt: Platform,
    private loadingController: LoadingController,
    private ref: ChangeDetectorRef,
    private filePath: FilePath,
    private clienteService: ClienteService,
    private storage: AngularFireStorage,
    private database: AngularFirestore,
    private dataProvider: DataService,
    private alertCtrl: AlertController,
    private toastCtrl: ToastController,
    private iab: InAppBrowser
  ) {
    this.isUploading = false;
    this.isUploaded = false;
    //Set collection where our documents/ images info will save
    this.imageCollection = database.collection<MyData>('freakyImages');
    this.images = this.imageCollection.valueChanges();

    //this.files = this.dataProvider.getFiles();
  }

  async addFile() {
    let inputAlert = await this.alertCtrl.create({
      message: 'Store new information',
      inputs: [
        {
          name: 'info',
          placeholder: 'Lorem ipsum dolor...'
        }
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel'
        },
        {
          text: 'Store',
          handler: data => {
            this.uploadInformation(data.info);
          }
        }
      ]
    });
    inputAlert.present();
  }

  async uploadInformation(text) {
    let upload = this.dataProvider.uploadToStorage(text);

    // Perhaps this syntax might change, it's no error here!
    upload.then().then(res => {
      this.dataProvider.storeInfoToDatabase(res.metadata).then(async () => {
        let toast = await this.toastCtrl.create({
          message: 'New File added!',
          duration: 3000
        });
        toast.present();
      });
    });
  }

  async deleteFile(file) {
    this.dataProvider.deleteFile(file).subscribe(async () => {
      let toast = await this.toastCtrl.create({
        message: 'File removed!',
        duration: 3000
      });
      toast.present();
    });
  }

  viewFile(url) {
    this.iab.create(url);
  }

  uploadFile(event: FileList) {
    // The File object
    const file = event.item(0);

    // Validation for Images Only
    if (file.type.split('/')[0] !== 'image') {
      console.error('unsupported file type :( ');
      return;
    }

    this.isUploading = true;
    this.isUploaded = false;

    this.fileName = file.name;

    // The storage path
    const path = `freakyStorage/${new Date().getTime()}_${file.name}`;

    // Totally optional metadata
    const customMetadata = { app: 'Freaky Image Upload Demo' };

    //File reference
    const fileRef = this.storage.ref(path);

    // The main task
    this.task = this.storage.upload(path, file, { customMetadata });

    // Get file progress percentage
    this.percentage = this.task.percentageChanges();
    this.snapshot = this.task.snapshotChanges().pipe(
      finalize(() => {
        // Get uploaded file storage path
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
  }

  addImagetoDB(image: MyData) {
    //Create an ID for document
    const id = this.database.createId();

    //Set document id with value in database
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

  ngOnInit() {
    this.clienteForm = this.formBuilder.group({
      id: this.formBuilder.control('' + this.id(), []),
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

    this.inicio();
  }

  inicio(): void {
    // const clienteId = this.route.snapshot.paramMap.get('id');
    // if (!clienteId) {
    //   this.pageTitle = 'Cadastrar Cliente';
    //   this.botaoTitle = 'CADASTRAR';
    //   return;
    // }
    // this.clienteId = clienteId;
    // this.pageTitle = 'Atualizar Cliente';
    // this.botaoTitle = 'ATUALIZAR';
    // this.criaClienteService
    //   .get(clienteId)
    //   .then(
    //     (result: any) => (
    //       this.clienteForm.get('nome').setValue(result.nome),
    //       this.clienteForm.get('cpf').setValue(result.cpf),
    //       this.clienteForm.get('pdtvAgro').setValue(result.pdtvAgro),
    //       this.clienteForm.get('patrimonio').setValue(result.patrimonio)
    //     )
    //   );

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
  get pegaId(): FormControl {
    return this.clienteForm.get('id') as FormControl;
  }

  id(): number {
    return Math.floor(Math.random() * 89999 + 10000);
  }

  // async criaCliente() {
  //   const loading = await this.overlayService.loading({
  //     message: 'Criando...'
  //   });
  //   // tslint:disable-next-line: max-line-length
  //   await this.criaClienteService
  //     .criaCliente(
  //       this.pegaId.value,
  //       this.nome.value,
  //       this.cpf.value,
  //       this.patrimonio.value,
  //       this.pdtvAgro.value,
  //       this.foto.value
  //     )
  //     .then(() => {
  //       this.overlayService.toast({ message: 'Cliente Criado com Sucesso!' });
  //       this.navCtrl.navigateBack('/menu');
  //     })
  //     .catch((error: any) => {
  //       this.overlayService.toast({ message: error.message });
  //     });

  //   loading.dismiss();
  // }
  // async atualizaCliente(cliente: any) {
  //   const loading = await this.overlayService.loading({
  //     message: 'Atualizando...'
  //   });
  //   // tslint:disable-next-line: max-line-length
  //   await this.criaClienteService
  //     .atualizaCliente(cliente)
  //     .then(() => {
  //       this.overlayService.toast({ message: 'Cliente Atualizado com Sucesso!' });
  //       this.navCtrl.navigateBack('/menu');
  //     })
  //     .catch((error: any) => {
  //       this.overlayService.toast({ message: error.message });
  //     });

  //   loading.dismiss();
  // }

  async onSubmit(): Promise<void> {
    const loading = await this.overlayService.loading({
      message: this.toastMessage
    });
    try {
      const cliente = !this.clienteId
        ? await this.clienteService.create(this.clienteForm.value)
        : await this.clienteService.update({
            id: this.clienteId,
            cpf: this.clienteForm.get('cpf').value,
            nome: this.clienteForm.get('nome').value,
            foto: '',
            patrimonio: this.clienteForm.get('patrimonio').value,
            pdtvAgro: this.clienteForm.get('pdtvAgro').value
          });
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
    // if (!this.clienteId) {
    //   this.criaCliente();
    // } else {
    //   this.atualizaCliente({
    //     id: this.clienteId,
    //     nome: this.clienteForm.get('nome').value,
    //     cpf: this.clienteForm.get('cpf').value,
    //     patrimonio: this.clienteForm.get('patrimonio').value,
    //     pdtvAgro: this.clienteForm.get('pdtvAgro').value,
    //     foto: this.clienteForm.get('foto').value
    //   });
    // }
  }
}

export interface MyData {
  name: string;
  filepath: string;
  size: number;
}
