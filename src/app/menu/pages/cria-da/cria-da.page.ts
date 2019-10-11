import { Component, OnInit } from '@angular/core';
import { OverlayService } from 'src/app/core/services/overlay.service';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { NavController } from '@ionic/angular';
import { finalize, take } from 'rxjs/operators';
import { AngularFireStorage } from '@angular/fire/storage';
import { Observable } from 'rxjs';
import { DaService } from 'src/app/core/services/da.service';
import { ClienteService } from 'src/app/core/services/cliente.service';
import { Cliente } from '../../models/cliente.model';
import { trigger, state, transition, style, animate } from '@angular/animations';
import { UsuarioService } from 'src/app/core/services/usuario.service';



@Component({
  selector: 'app-cria-da',
  templateUrl: './cria-da.page.html',
  styleUrls: ['./cria-da.page.scss'],
  animations: [
    trigger('tamanhoArquivo', [
      state('semArquivo', style({ 'height': '67px'})),
      state('comArquivo', style({ 'height': '210px'})),
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
      private declaracaoAmbientalService: DaService,
      private clienteService: ClienteService,
      private usuarioService: UsuarioService,
      private storage: AngularFireStorage  ) {}

    // metodo que é chamado quando a pagina é carregada
    ngOnInit() {
      this.criaFormulario();
      if (this.usuarioService.admin) {
        this.clienteService.initCliente();
        this.clienteService.getAll().subscribe((r: Cliente[]) => {
          for (let i = 0; i < r.length; i++) {
              this.clientes[i] = r[i];
          }
        });
      }
      else {
        this.clienteService.init();
        this.clienteService.getAll().subscribe((r: Cliente[]) => {
          for (let i = 0; i < r.length; i++) {
              this.clientes[i] = r[i];
          }
        });
      }

      console.log(this.clientes);
      this.clienteService.id = '';
      this.acao();
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

    async cadastraListaGlobal(id: string) {
      this.declaracaoAmbientalService.initDA();
      const declaracaoAmbiental = await this.declaracaoAmbientalService.createGlobal(this.declaracaoAmbientalForm.value, id);
    }

    async AtualizaListaGlobal() {
      this.declaracaoAmbientalService.initDA();
      const atualizarFoto = await this.declaracaoAmbientalService.update({
        id: this.declaracaoAmbientalId,
        descricao: this.declaracaoAmbientalForm.get('descricao').value,
        dataDeVencimento: this.declaracaoAmbientalForm.get('dataDeVencimento').value,
        clienteId: this.declaracaoAmbientalForm.get('idCliente').value
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
          this.declaracaoAmbientalService.init();
          const declaracaoAmbiental = await this.declaracaoAmbientalService.create(this.declaracaoAmbientalForm.value);
          this.cadastraListaGlobal(this.declaracaoAmbientalService.id);

          this.deletePicture();

          this.uploadFileTo(this.arquivos);

        } else {
          this.deletePicture();

          this.uploadFileToUpdate(this.arquivos);

          this.AtualizaListaGlobal();
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

    async openGalery(event: FileList){
      try {
        const file = event.item(0);
          if (file.type.split('/')[0] === 'image') {
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

        const ref2 = this.storage.ref(`/users/${this.declaracaoAmbientalService.usuarioId}/DeclaracaoAmbiental/${this.declaracaoAmbientalService.id}/arquivos/${this.fileName}`);
        const task2 = ref2.put(file);

        task2.snapshotChanges().pipe(
          finalize(async () => {

            this.downloadUrl = ref2.getDownloadURL();
            this.liberaArquivo = true;

            this.downloadUrl.subscribe(async r => {
              this.declaracaoAmbientalService.init();
              const atualizarFoto = await this.declaracaoAmbientalService.update({
                id: this.declaracaoAmbientalService.id,
                descricao: this.declaracaoAmbientalForm.get('descricao').value,
                dataDeVencimento: this.declaracaoAmbientalForm.get('dataDeVencimento').value,
                clienteId: this.declaracaoAmbientalForm.get('idCliente').value,
                arquivo: r
              });
            });
          })
        ).subscribe();
    }

    async uploadFileToUpdate(file: Object){

      const ref2 = this.storage.ref(`/users/${this.declaracaoAmbientalService.usuarioId}/DeclaracaoAmbiental/${this.declaracaoAmbientalService.id}/arquivos/${this.fileName}`);
      const task2 = ref2.put(file);

      task2.snapshotChanges().pipe(
        finalize(async () => {

          this.downloadUrl = ref2.getDownloadURL();
          this.liberaArquivo = true;

          this.downloadUrl.subscribe(async r => {
            this.declaracaoAmbientalService.init();
            const atualizarFoto = await this.declaracaoAmbientalService.update({
              id: this.declaracaoAmbientalId,
              descricao: this.declaracaoAmbientalForm.get('descricao').value,
              dataDeVencimento: this.declaracaoAmbientalForm.get('dataDeVencimento').value,
              clienteId: this.declaracaoAmbientalForm.get('idCliente').value,
              arquivo: r
            });
          });
        })
      ).subscribe();
    }

    deletePicture(){
      const ref = this.storage.ref(`${this.fileName}`);
      const task = ref.delete();
    }


  }
