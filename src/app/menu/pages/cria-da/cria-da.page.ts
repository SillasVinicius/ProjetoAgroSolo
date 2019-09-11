import { Component, OnInit } from '@angular/core';
import { OverlayService } from 'src/app/core/services/overlay.service';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { NavController } from '@ionic/angular';
import { finalize, take, tap } from 'rxjs/operators';
import { AngularFireStorage, AngularFireUploadTask } from '@angular/fire/storage';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { DaService } from 'src/app/core/services/da.service';
import { ClienteService } from 'src/app/core/services/cliente.service';
import { Cliente } from '../../models/cliente.model';

@Component({
  selector: 'app-cria-da',
  templateUrl: './cria-da.page.html',
  styleUrls: ['./cria-da.page.scss'],
})
export class CriaDaPage implements OnInit {


    // Declaração Ambiental
    declaracaoAmbientalForm: FormGroup;
    declaracaoAmbientalId: string = undefined;

    //cliente

    clientes: Cliente[] = [];
    selCliente: string;

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
      private declaracaoAmbientalService: DaService,
      private clienteService: ClienteService,
      private storage: AngularFireStorage,
      private database: AngularFirestore
    ) {
      this.isUploading2 = false;
      this.isUploaded2 = false;
      this.clienteService.init();
      this.clienteService.getAll().subscribe((r: Cliente[]) => {

        for (let i = 0; i < r.length; i++) {
            this.clientes[i] = r[i];
        }

    });

    console.log(this.clientes);
    }

    // metodo que é chamado quando a pagina é carregada
    ngOnInit() {
      this.criaFormulario();
      this.acao();
      this.declaracaoAmbientalService.init();
      this.declaracaoAmbientalService.id = '';
    }

    // Cria formulários
    criaFormulario(): void {
      this.declaracaoAmbientalForm = this.formBuilder.group({
        descricao: this.formBuilder.control('', [Validators.required, Validators.minLength(3)]),
        dataDeVencimento: this.formBuilder.control('', [Validators.required, Validators.minLength(10),
          Validators.maxLength(10)]),
        idCliente: this.formBuilder.control('', [Validators.required])
      });
    }

    // metodos get que pegam o valor do input no formulário
    get descricao(): FormControl {
      return this.declaracaoAmbientalForm.get('descricao') as FormControl;
    }
    get dataDeVencimento(): FormControl {
      return this.declaracaoAmbientalForm.get('dataDeVencimento') as FormControl;
    }

    get idCliente(): FormControl {
      return this.declaracaoAmbientalForm.get('idCliente') as FormControl;
    }

    // verifica se a acao é de criação ou atualização
    acao(): void {
      const declaracaoAmbientalId = this.route.snapshot.paramMap.get('id');
      if (!declaracaoAmbientalId) {
        this.pageTitle = 'Cadastrar Declaração Ambiental';
        this.botaoTitle = 'CADASTRAR';
        this.toastMessage = 'Criando...';
        return;
      }
      this.declaracaoAmbientalId = declaracaoAmbientalId;
      this.pageTitle = 'Atualizar Declaração Ambiental';
      this.botaoTitle = 'ATUALIZAR';
      this.toastMessage = 'Atualizando...';
      this.declaracaoAmbientalService
        .get(declaracaoAmbientalId)
        .pipe(take(1))
        .subscribe(({ descricao, dataDeVencimento, clienteId  }) => {
          this.declaracaoAmbientalForm.get('descricao').setValue(descricao),
            this.declaracaoAmbientalForm.get('dataDeVencimento').setValue(dataDeVencimento)
            this.declaracaoAmbientalForm.get('idCliente').setValue(clienteId)
        });
    }

    // método que envia os dados do formulário para o banco de dados
    async onSubmit(): Promise<void> {
      const loading = await this.overlayService.loading({
        message: this.toastMessage
      });
      try {
        const declaracaoAmbiental = '';
        if (!this.declaracaoAmbientalId) {
          // tslint:disable-next-line: no-shadowed-variable
          const declaracaoAmbiental = await this.declaracaoAmbientalService.create(this.declaracaoAmbientalForm.value);
          // this.adicionaFoto();
          this.adicionaFoto2();
        } else {
          // tslint:disable-next-line: no-shadowed-variable
          const declaracaoAmbiental = await this.declaracaoAmbientalService.update({
            id: this.declaracaoAmbientalId,
            descricao: this.declaracaoAmbientalForm.get('descricao').value,
            dataDeVencimento: this.declaracaoAmbientalForm.get('dataDeVencimento').value,
            clienteId: this.declaracaoAmbientalForm.get('idCliente').value,
          });
        }
        console.log('declaracao Ambiental Criada', declaracaoAmbiental);
        this.navCtrl.navigateBack('/menu/ambiental/DeclaracaoAmbiental');
      } catch (error) {
        await this.overlayService.toast({
          message: error.message
        });
        console.log('Erro ao criar declaraÇão Ambiental: ', error);
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
      if (this.declaracaoAmbientalService.id !== '') {
        const path2 = `/users/${this.declaracaoAmbientalService.usuarioId}/DeclaracaoAmbiental/${
          this.declaracaoAmbientalService.id
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
        `/users/${this.declaracaoAmbientalService.usuarioId}/cliente/${this.declaracaoAmbientalService.id}/arquivos`
      );
      this.images2 = this.imageCollection2.valueChanges();
    }

    // executa todos os metodós para realizar upload de fotos
    adicionaFoto2(): void {
      this.iniciaUploadFotos2();
      this.uploadFile2(this.arquivos2);
      this.declaracaoAmbientalService.setCollectionArquivo(this.declaracaoAmbientalService.id);
      this.declaracaoAmbientalService.collection.doc(this.image2.name).set(this.image2);
    }
    // Arquivos - fim


    teste() {

      console.log(this.selCliente);
    }
  }

  export interface MyData {
    name: string;
    filepath: string;
    size: number;
  }
