import { Component, OnInit } from '@angular/core';
import { OverlayService } from 'src/app/core/services/overlay.service';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { NavController } from '@ionic/angular';
import { finalize, take, tap } from 'rxjs/operators';
import { AngularFireStorage, AngularFireUploadTask } from '@angular/fire/storage';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { CarService } from 'src/app/core/services/car.service';
import { ClienteService } from 'src/app/core/services/cliente.service';
import { Cliente } from '../../models/cliente.model';

@Component({
  selector: 'app-cria-car',
  templateUrl: './cria-car.page.html',
  styleUrls: ['./cria-car.page.scss'],
})
export class CriaCarPage implements OnInit {


      // cadastro Rural Ambiental
      cadastroRuralAmbientalForm: FormGroup;
      cadastroRuralAmbientalId: string = undefined;

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
        private cadastroRuralAmbientalService: CarService,
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
        this.cadastroRuralAmbientalService.init();
        this.cadastroRuralAmbientalService.id = '';
      }

      // Cria formulários
      criaFormulario(): void {
        this.cadastroRuralAmbientalForm = this.formBuilder.group({
          descricao: this.formBuilder.control('', [Validators.required, Validators.minLength(3)]),
          idCliente: this.formBuilder.control('', [Validators.required])
        });
      }

      // metodos get que pegam o valor do input no formulário
      get descricao(): FormControl {
        return this.cadastroRuralAmbientalForm.get('descricao') as FormControl;
      }
      get idCliente(): FormControl {
        return this.cadastroRuralAmbientalForm.get('idCliente') as FormControl;
      }

      // verifica se a acao é de criação ou atualização
      acao(): void {
        const declaracaoAmbientalId = this.route.snapshot.paramMap.get('id');
        if (!declaracaoAmbientalId) {
          this.pageTitle = 'Cadastrar C.A.R';
          this.botaoTitle = 'CADASTRAR';
          this.toastMessage = 'Criando...';
          return;
        }
        this.cadastroRuralAmbientalId = declaracaoAmbientalId;
        this.pageTitle = 'Atualizar C.A.R';
        this.botaoTitle = 'ATUALIZAR';
        this.toastMessage = 'Atualizando...';
        this.cadastroRuralAmbientalService
          .get(declaracaoAmbientalId)
          .pipe(take(1))
          .subscribe(({ descricao, clienteId  }) => {
            this.cadastroRuralAmbientalForm.get('descricao').setValue(descricao),
              this.cadastroRuralAmbientalForm.get('idCliente').setValue(clienteId)
          });
      }

      // método que envia os dados do formulário para o banco de dados
      async onSubmit(): Promise<void> {
        const loading = await this.overlayService.loading({
          message: this.toastMessage
        });
        try {
          const cadastroRuralAmbiental = '';
          if (!this.cadastroRuralAmbientalId) {
            // tslint:disable-next-line: no-shadowed-variable
            const cadastroRuralAmbiental = await this.cadastroRuralAmbientalService.create(this.cadastroRuralAmbientalForm.value);
            // this.adicionaFoto();
            this.adicionaFoto2();
          } else {
            // tslint:disable-next-line: no-shadowed-variable
            const cadastroRuralAmbiental = await this.cadastroRuralAmbientalService.update({
              id: this.cadastroRuralAmbientalId,
              descricao: this.cadastroRuralAmbientalForm.get('descricao').value,
              clienteId: this.cadastroRuralAmbientalForm.get('idCliente').value
            });
          }
          console.log('Cadastro Ambiental Rural Criado', cadastroRuralAmbiental);
          this.navCtrl.navigateBack('/menu/ambiental/CadastroAmbientalRural');
        } catch (error) {
          await this.overlayService.toast({
            message: error.message
          });
          console.log('Erro ao criar declaração Ambiental: ', error);
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
        if (this.cadastroRuralAmbientalService.id !== '') {
          const path2 = `/users/${this.cadastroRuralAmbientalService.usuarioId}/CadastroAmbientalRural/${
            this.cadastroRuralAmbientalService.id
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
          `/users/${this.cadastroRuralAmbientalService.usuarioId}/cliente/${this.cadastroRuralAmbientalService.id}/arquivos`
        );
        this.images2 = this.imageCollection2.valueChanges();
      }

      // executa todos os metodós para realizar upload de fotos
      adicionaFoto2(): void {
        this.iniciaUploadFotos2();
        this.uploadFile2(this.arquivos2);
        this.cadastroRuralAmbientalService.setCollectionArquivo(this.cadastroRuralAmbientalService.id);
        this.cadastroRuralAmbientalService.collection.doc(this.image2.name).set(this.image2);
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
