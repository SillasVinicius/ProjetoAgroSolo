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
    admin: boolean = false;
    update: boolean = false;
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
    public urlArquivo: string;
    arquivos: Object;
    files2: Observable<any[]>;
    fileName = '';
    novoArquivo = false;
    arquivoAntigo: any;

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
        this.clienteService.init();
        this.clienteService.getAll().subscribe((r: Cliente[]) => {
          for (let i = 0; i < r.length; i++) {
              this.clientes[i] = r[i];
          }
        });
        this.admin = true;
      }
      else {
        this.clienteService.init();
        this.clienteService.getAll().subscribe((r: Cliente[]) => {
          for (let i = 0; i < r.length; i++) {
              this.clientes[i] = r[i];
          }
        });
        this.admin = false;
      }

      this.clienteService.id = '';
      this.acao();
    }

    // Cria formulários
    criaFormulario(): void {
      this.declaracaoAmbientalForm = this.formBuilder.group({
        descricao: this.formBuilder.control('', [Validators.required, Validators.minLength(3)]),
        dataDeVencimento: this.formBuilder.control('', [Validators.required, Validators.minLength(10),
          Validators.maxLength(10)]),
          clienteId: this.formBuilder.control('', [Validators.required])
      });
    }

    // metodos get que pegam o valor do input no formulário
    get descricao(): FormControl {
      return this.declaracaoAmbientalForm.get('descricao') as FormControl;
    }
    get dataDeVencimento(): FormControl {
      return this.declaracaoAmbientalForm.get('dataDeVencimento') as FormControl;
    }

    get clienteId(): FormControl {
      return this.declaracaoAmbientalForm.get('clienteId') as FormControl;
    }

    // verifica se a acao é de criação ou atualização
    acao(): void {
      const declaracaoAmbientalId = this.route.snapshot.paramMap.get('id');
      if (!declaracaoAmbientalId) {
        this.update = false;
        this.pageTitle = 'Cadastrar Declaração Ambiental';
        this.botaoTitle = 'CADASTRAR';
        this.toastMessage = 'Criando...';
        return;
      }
      this.update = true;
      this.declaracaoAmbientalId = declaracaoAmbientalId;
      this.pageTitle = 'Atualizar Declaração Ambiental';
      this.botaoTitle = 'ATUALIZAR';
      this.toastMessage = 'Atualizando...';
      this.declaracaoAmbientalService
        .get(declaracaoAmbientalId)
        .pipe(take(1))
        .subscribe(({ descricao, dataDeVencimento, clienteId, arquivo, nomeArquivo  }) => {
          this.declaracaoAmbientalForm.get('descricao').setValue(descricao);
            this.declaracaoAmbientalForm.get('dataDeVencimento').setValue(dataDeVencimento); 
            this.declaracaoAmbientalForm.get('clienteId').setValue(clienteId);
            this.liberaArquivo = true;
            this.urlArquivo = arquivo;
            this.fileName = nomeArquivo;
            this.arquivoAntigo = nomeArquivo;

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
        clienteId: this.declaracaoAmbientalForm.get('clienteId').value
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
          this.declaracaoAmbientalService.initDA();
          const declaracaoAmbiental = await this.declaracaoAmbientalService.create(this.declaracaoAmbientalForm.value);
          this.cadastraListaGlobal(this.declaracaoAmbientalService.id);

          this.uploadFileTo(this.arquivos);

        } else {
          
          if (this.novoArquivo) {
            this.deletePicture();
            this.uploadFileTo(this.arquivos);
            this.novoArquivo = false;

          } else {
            this.AtualizaListaGlobal();
         }
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
        this.liberaArquivo = true;
        this.novoArquivo = true;

      }catch(error){
        console.error(error);
      }
    }

    async uploadFileTo(file: Object){

      let idDa = (this.declaracaoAmbientalService.id === '') ? this.declaracaoAmbientalId : this.declaracaoAmbientalService.id;

        const ref2 = this.storage.ref(`/DeclaracaoAmbiental${idDa}/${this.fileName}`);
        const task2 = ref2.put(file);

        task2.snapshotChanges().pipe(
          finalize(async () => {

            this.downloadUrl = ref2.getDownloadURL();
            this.liberaArquivo = true;

            this.downloadUrl.subscribe(async r => {
              this.declaracaoAmbientalService.initDA();
              const atualizarFoto = await this.declaracaoAmbientalService.update({
                id: this.declaracaoAmbientalService.id,
                descricao: this.declaracaoAmbientalForm.get('descricao').value,
                dataDeVencimento: this.declaracaoAmbientalForm.get('dataDeVencimento').value,
                clienteId: this.declaracaoAmbientalForm.get('clienteId').value,
                arquivo: r,
                nomeArquivo: this.fileName
              });
            });
          })
        ).subscribe();
    }

    deletePicture(){

      let idDa = (this.declaracaoAmbientalService.id === '') ? this.declaracaoAmbientalId : this.declaracaoAmbientalService.id;

      const ref = this.storage.ref(`/DeclaracaoAmbiental${idDa}/`);
      ref.child(`${this.arquivoAntigo}`).delete();
    }


  }
