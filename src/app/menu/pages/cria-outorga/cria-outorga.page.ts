import { Component, OnInit } from '@angular/core';
import { OverlayService } from 'src/app/core/services/overlay.service';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { NavController } from '@ionic/angular';
import { finalize, take, tap } from 'rxjs/operators';
import { AngularFireStorage, AngularFireUploadTask } from '@angular/fire/storage';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { OutorgaService } from 'src/app/core/services/outorga.service';

@Component({
  selector: 'app-cria-outorga',
  templateUrl: './cria-outorga.page.html',
  styleUrls: ['./cria-outorga.page.scss'],
})
export class CriaOutorgaPage implements OnInit {

  // Cliente
  outorgaForm: FormGroup;
  outorgaId: string = undefined;

  // Validacao
  numberPattern = /^[0-9]*$/;
  botaoTitle = '...';
  pageTitle = '...';
  toastMessage = '...';
  liberaArquivo = false;

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
    private outorgaService: OutorgaService,
    private storage: AngularFireStorage,
    private database: AngularFirestore
  ) {
    this.isUploading2 = false;
    this.isUploaded2 = false;
  }

  // metodo que é chamado quando a pagina é carregada
  ngOnInit() {
    this.criaFormulario();
    this.acao();
    this.outorgaService.init();
    this.outorgaService.id = '';
  }

  // Cria formulários
  criaFormulario(): void {
    this.outorgaForm = this.formBuilder.group({
      descricao: this.formBuilder.control('', [Validators.required, Validators.minLength(3)]),
      dataDeVencimento: this.formBuilder.control('', [Validators.required, Validators.minLength(10),
        Validators.maxLength(10)])
    });
  }

  // metodos get que pegam o valor do input no formulário
  get descricao(): FormControl {
    return this.outorgaForm.get('descricao') as FormControl;
  }
  get dataDeVencimento(): FormControl {
    return this.outorgaForm.get('dataDeVencimento') as FormControl;
  }

  // verifica se a acao é de criação ou atualização
  acao(): void {
    const outorgaId = this.route.snapshot.paramMap.get('id');
    if (!outorgaId) {
      this.pageTitle = 'Cadastrar Outorga';
      this.botaoTitle = 'CADASTRAR';
      this.toastMessage = 'Criando...';
      return;
    }
    this.outorgaId = outorgaId;
    this.pageTitle = 'Atualizar Outorga';
    this.botaoTitle = 'ATUALIZAR';
    this.toastMessage = 'Atualizando...';
    this.outorgaService
      .get(outorgaId)
      .pipe(take(1))
      .subscribe(({ descricao, dataDeVencimento  }) => {
        this.outorgaForm.get('descricao').setValue(descricao),
          this.outorgaForm.get('dataDeVencimento').setValue(dataDeVencimento)
      });
  }

  // método que envia os dados do formulário para o banco de dados
  async onSubmit(): Promise<void> {
    const loading = await this.overlayService.loading({
      message: this.toastMessage
    });
    try {
      const outorga = '';
      if (!this.outorgaId) {
        // tslint:disable-next-line: no-shadowed-variable
        const outorga = await this.outorgaService.create(this.outorgaForm.value);
        // this.adicionaFoto();
        this.adicionaFoto2();
      } else {
        // tslint:disable-next-line: no-shadowed-variable
        const outorga = await this.outorgaService.update({
          id: this.outorgaId,
          descricao: this.outorgaForm.get('descricao').value,
          dataDeVencimento: this.outorgaForm.get('dataDeVencimento').value
        });
      }
      console.log('Outorga Criada', outorga);
      this.navCtrl.navigateBack('/menu/outorga');
    } catch (error) {
      await this.overlayService.toast({
        message: error.message
      });
      console.log('Erro ao criar Outorga: ', error);
    } finally {
      loading.dismiss();
    }
  }

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
    this.liberaArquivo = true;
    if (this.outorgaService.id !== '') {
      const path2 = `/users/${this.outorgaService.usuarioId}/outorga/${
        this.outorgaService.id
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
      `/users/${this.outorgaService.usuarioId}/cliente/${this.outorgaService.id}/arquivos`
    );
    this.images2 = this.imageCollection2.valueChanges();
  }

  // executa todos os metodós para realizar upload de fotos
  adicionaFoto2(): void {
    this.iniciaUploadFotos2();
    this.uploadFile2(this.arquivos2);
    this.outorgaService.setCollectionArquivo(this.outorgaService.id);
    this.outorgaService.collection.doc(this.image2.name).set(this.image2);
  }
  // Arquivos - fim
}

export interface MyData {
  name: string;
  filepath: string;
  size: number;
}
