import { Component, OnInit } from '@angular/core';
import { OverlayService } from 'src/app/core/services/overlay.service';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { CriaClienteService } from 'src/app/core/services/cria-cliente.service';
import { NavController, LoadingController, ToastController } from '@ionic/angular';
import { Crop } from '@ionic-native/crop/ngx';
import { ImagePicker } from '@ionic-native/image-picker/ngx';
import {
  FileTransfer,
  FileUploadOptions,
  FileTransferObject
} from '@ionic-native/file-transfer/ngx';
import { Camera, CameraOptions } from '@ionic-native/camera';

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
  clienteId: string = undefined;
  fileUrl: any = null;
  respData: any;
  imageURI: any;
  imageFileName: any;

  constructor(
    private formBuilder: FormBuilder,
    private overlayService: OverlayService,
    private navCtrl: NavController,
    private criaClienteService: CriaClienteService,
    private route: ActivatedRoute,
    private imagePicker: ImagePicker,
    private crop: Crop,
    private transfer: FileTransfer,
    public loadingCtrl: LoadingController,
    public toastCtrl: ToastController
  ) {}

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
      foto: this.formBuilder.control('', []),
      testeArquivo: this.formBuilder.control('', [])
    });

    this.inicio();
  }

  inicio(): void {
    const clienteId = this.route.snapshot.paramMap.get('id');
    if (!clienteId) {
      this.pageTitle = 'Cadastrar Cliente';
      this.botaoTitle = 'CADASTRAR';
      return;
    }
    this.clienteId = clienteId;
    this.pageTitle = 'Atualizar Cliente';
    this.botaoTitle = 'ATUALIZAR';
    this.criaClienteService
      .get(clienteId)
      .then(
        (result: any) => (
          this.clienteForm.get('nome').setValue(result.nome),
          this.clienteForm.get('cpf').setValue(result.cpf),
          this.clienteForm.get('pdtvAgro').setValue(result.pdtvAgro),
          this.clienteForm.get('patrimonio').setValue(result.patrimonio)
        )
      );
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

  async criaCliente() {
    const loading = await this.overlayService.loading({
      message: 'Criando...'
    });
    // tslint:disable-next-line: max-line-length
    await this.criaClienteService
      .criaCliente(
        this.pegaId.value,
        this.nome.value,
        this.cpf.value,
        this.patrimonio.value,
        this.pdtvAgro.value,
        this.foto.value
      )
      .then((result: any) => {
        this.overlayService.toast({ message: 'Cliente Criado com Sucesso!' });
        this.navCtrl.navigateBack('/menu');
      })
      .catch((error: any) => {
        this.overlayService.toast({ message: error.message });
      });

    loading.dismiss();
  }
  async atualizaCliente(cliente: any) {
    const loading = await this.overlayService.loading({
      message: 'Atualizando...'
    });
    // tslint:disable-next-line: max-line-length
    await this.criaClienteService
      .atualizaCliente(cliente)
      .then((result: any) => {
        this.overlayService.toast({ message: 'Cliente Atualizado com Sucesso!' });
        this.navCtrl.navigateBack('/menu');
      })
      .catch((error: any) => {
        this.overlayService.toast({ message: error.message });
      });

    loading.dismiss();
  }

  async onSubmit(): Promise<void> {
    if (!this.clienteId) {
      this.criaCliente();
    } else {
      this.atualizaCliente({
        id: this.clienteId,
        nome: this.clienteForm.get('nome').value,
        cpf: this.clienteForm.get('cpf').value,
        patrimonio: this.clienteForm.get('patrimonio').value,
        pdtvAgro: this.clienteForm.get('pdtvAgro').value,
        foto: this.clienteForm.get('foto').value
      });
    }
  }

  cropUpload() {
    this.imagePicker.getPictures({ maximumImagesCount: 1, outputType: 0 }).then(
      results => {
        // tslint:disable-next-line: prefer-for-of
        for (let i = 0; i < results.length; i++) {
          console.log('Image URI: ' + results[i]);
          this.crop.crop(results[i], { quality: 100 }).then(
            newImage => {
              console.log('new image path is: ' + newImage);
              const fileTransfer: FileTransferObject = this.transfer.create();
              const uploadOpts: FileUploadOptions = {
                fileKey: 'file',
                fileName: newImage.substr(newImage.lastIndexOf('/') + 1)
              };

              fileTransfer.upload(newImage, 'http://localhost:3001/cliente', uploadOpts).then(
                data => {
                  console.log(data);
                  this.respData = JSON.parse(data.response);
                  console.log(this.respData);
                  this.fileUrl = this.respData.fileUrl;
                },
                err => {
                  console.log(err);
                }
              );
            },
            error => console.error('Error cropping image', error)
          );
        }
      },
      err => {
        console.log(err);
      }
    );
  }
  uploadFile() {
    const fileTransfer: FileTransferObject = this.transfer.create();

    const options: FileUploadOptions = {
      fileKey: 'ionicfile',
      fileName: 'ionicfile',
      chunkedMode: false,
      mimeType: 'image/jpeg',
      headers: {}
    };

    fileTransfer.upload(this.imageURI, 'http://localhost:3001/cliente', options).then(
      data => {
        console.log(data + ' Uploaded Successfully');
        this.imageFileName = 'http://192.168.0.7:8080/static/images/ionicfile.jpg';
      },
      err => {
        console.log(err);
      }
    );
  }
}
