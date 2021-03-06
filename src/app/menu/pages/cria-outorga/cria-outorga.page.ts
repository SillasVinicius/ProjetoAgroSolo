import { Component, OnInit } from '@angular/core';
import { OverlayService } from 'src/app/core/services/overlay.service';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { NavController } from '@ionic/angular';
import { finalize, take } from 'rxjs/operators';
import { AngularFireStorage } from '@angular/fire/storage';
import { Observable } from 'rxjs';
import { OutorgaService } from 'src/app/core/services/outorga.service';
import { ClienteService } from 'src/app/core/services/cliente.service';
import { Cliente } from '../../models/cliente.model';
import { trigger, state, transition, style, animate } from '@angular/animations';
import { UsuarioService } from 'src/app/core/services/usuario.service';

@Component({
  selector: 'app-cria-outorga',
  templateUrl: './cria-outorga.page.html',
  styleUrls: ['./cria-outorga.page.scss'],
  animations: [
    trigger('tamanhoArquivo', [
      state('semArquivo', style({ 'height': '100px' })),
      state('comArquivo', style({ 'height': '210px' })),
      transition('antes => depois', [style({ transition: '0.2s' }), animate('100ms 0s ease-in')]),
      transition('depois => antes', [style({ transition: '0.2s' }), animate('100ms 0s ease-in')])
    ]),
    trigger('marginBotao', [
      state('semArquivo', style({ 'margin-top': '2px' })),
      state('comArquivo', style({ 'margin-top': '30px' })),
      transition('antes => depois', [style({ transition: '0.1s' }), animate('100ms 0s ease-in')]),
      transition('depois => antes', [style({ transition: '0.1s' }), animate('100ms 0s ease-in')])
    ]),
  ]
})
export class CriaOutorgaPage implements OnInit {

  // outorga
  outorgaForm: FormGroup;
  outorgaId: string = undefined;
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
    private outorgaService: OutorgaService,
    private clienteService: ClienteService,
    private usuarioService: UsuarioService,
    private storage: AngularFireStorage) { }

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
    this.outorgaForm = this.formBuilder.group({
      descricao: this.formBuilder.control('', [Validators.required, Validators.minLength(3)]),
      dataDeVencimento: this.formBuilder.control('', [Validators.required, Validators.minLength(10),
      Validators.maxLength(10)]),
      clienteId: this.formBuilder.control('', [Validators.required])
    });
  }

  // metodos get que pegam o valor do input no formulário
  get descricao(): FormControl {
    return this.outorgaForm.get('descricao') as FormControl;
  }
  get dataDeVencimento(): FormControl {
    return this.outorgaForm.get('dataDeVencimento') as FormControl;
  }

  get clienteId(): FormControl {
    return this.outorgaForm.get('clienteId') as FormControl;
  }

  // verifica se a acao é de criação ou atualização
  acao(): void {
    const outorgaId = this.route.snapshot.paramMap.get('id');
    if (!outorgaId) {
      this.update = false;
      this.pageTitle = 'Cadastrar Outorga';
      this.botaoTitle = 'CADASTRAR';
      this.toastMessage = 'Criando...';
      return;
    }
    this.update = true;
    this.outorgaId = outorgaId;
    this.pageTitle = 'Atualizar Outorga';
    this.botaoTitle = 'ATUALIZAR';
    this.toastMessage = 'Atualizando...';
    this.outorgaService
      .get(outorgaId)
      .pipe(take(1))
      .subscribe(({ descricao, dataDeVencimento, clienteId, arquivo, nomeArquivo }) => {
        this.outorgaForm.get('descricao').setValue(descricao);
        this.outorgaForm.get('dataDeVencimento').setValue(dataDeVencimento);
        this.outorgaForm.get('clienteId').setValue(clienteId);
        this.liberaArquivo = true;
        this.urlArquivo = arquivo;
        this.fileName = nomeArquivo;
        this.arquivoAntigo = nomeArquivo;
      });
  }

  async cadastraListaGlobal(id: string) {
    this.outorgaService.init();
    const outorga = await this.outorgaService.createGlobal(this.outorgaForm.value, id);
  }

  async AtualizaListaGlobal() {
    this.outorgaService.init();
    const atualizarFile = await this.outorgaService.update({
      id: this.outorgaId,
      descricao: this.outorgaForm.get('descricao').value,
      dataDeVencimento: this.outorgaForm.get('dataDeVencimento').value,
      clienteId: this.outorgaForm.get('clienteId').value
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
        this.outorgaService.init();
        const outorga = await this.outorgaService.create(this.outorgaForm.value);
        this.cadastraListaGlobal(this.outorgaService.id);

        this.uploadFileTo(this.arquivos);

      } else {

        if (this.novoArquivo) {
          if (this.arquivoAntigo !== '') {
            this.deleteFile();
          }
          this.uploadFileTo(this.arquivos);
          this.novoArquivo = false;
        } else {
          this.AtualizaListaGlobal();
        }
      }
      console.log('Outorga Criada', outorga);
      await this.overlayService.toast({
        message: "Outorga Criada"
      });
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

  async openGalery(event: FileList) {
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

    } catch (error) {
      console.error(error);
    }
  }



  async uploadFileTo(file: Object) {

    let idOutorga = (this.outorgaService.id === '') ? this.outorgaId : this.outorgaService.id;

    const ref2 = this.storage.ref(`/outorga${idOutorga}/${this.fileName}`);
    const task2 = ref2.put(file);

    task2.snapshotChanges().pipe(
      finalize(async () => {

        this.downloadUrl = ref2.getDownloadURL();
        this.liberaArquivo = true;

        this.downloadUrl.subscribe(async r => {
          this.outorgaService.init();
          await this.outorgaService.update({
            id: idOutorga,
            descricao: this.outorgaForm.get('descricao').value,
            dataDeVencimento: this.outorgaForm.get('dataDeVencimento').value,
            clienteId: this.outorgaForm.get('clienteId').value,
            arquivo: r,
            nomeArquivo: this.fileName
          });
        });
      })
    ).subscribe();
  }

  deleteFile() {

    let idOutorga = (this.outorgaService.id === '') ? this.outorgaId : this.outorgaService.id;

    const ref = this.storage.ref(`/outorga${idOutorga}`);
    ref.child(`${this.arquivoAntigo}`).delete();
  }

}
