import { Component, OnInit } from '@angular/core';
import { OverlayService } from 'src/app/core/services/overlay.service';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { NavController } from '@ionic/angular';
import { finalize, take } from 'rxjs/operators';
import { AngularFireStorage } from '@angular/fire/storage';
import { Observable } from 'rxjs';
import { ClienteService } from 'src/app/core/services/cliente.service';
import { Cliente } from '../../models/cliente.model';
import { trigger, state, transition, style, animate } from '@angular/animations';
import { UsuarioService } from 'src/app/core/services/usuario.service';
import { CreditoService } from 'src/app/core/services/credito.service';


@Component({
  selector: 'credito',
  templateUrl: './credito.page.html',
  styleUrls: ['./credito.page.scss'],
  animations: [
    trigger('tamanhoArquivo', [
      state('semArquivo', style({ 'height': '67px' })),
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
export class CreditoPage implements OnInit {


  // Crédito Financeiro
  cadastroCreditoFinanceiro: FormGroup;
  creditoId: string = undefined;
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

  //validação de data
  dt_aprovacao: string;
  dt_expiracao: string;


  constructor(
    private formBuilder: FormBuilder,
    private overlayService: OverlayService,
    private navCtrl: NavController,
    private route: ActivatedRoute,
    private creditoService: CreditoService,
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
    this.cadastroCreditoFinanceiro = this.formBuilder.group({
      descricao: this.formBuilder.control('', [Validators.required, Validators.minLength(3)]),
      dataAprovacaoCredito: this.formBuilder.control('', [Validators.required, Validators.minLength(10), Validators.maxLength(10)]),
      dataExpiracaoCredito: this.formBuilder.control('', [Validators.required, Validators.minLength(10), Validators.maxLength(10)]),
      valorCredito: this.formBuilder.control('', [
        Validators.required,
        Validators.minLength(3)
      ]),
      clienteId: this.formBuilder.control('', [Validators.required])
    });
  }  

  // metodos get que pegam o valor do input no formulário
  get descricao(): FormControl {
    return this.cadastroCreditoFinanceiro.get('descricao') as FormControl;
  }
  get dataAprovacaoCredito(): FormControl {
    return this.cadastroCreditoFinanceiro.get('dataAprovacaoCredito') as FormControl;
  }
  get dataExpiracaoCredito(): FormControl {
    return this.cadastroCreditoFinanceiro.get('dataExpiracaoCredito') as FormControl;
  }
  get valorCredito(): FormControl {
    return this.cadastroCreditoFinanceiro.get('valorCredito') as FormControl;
  }
  get clienteId(): FormControl {
    return this.cadastroCreditoFinanceiro.get('clienteId') as FormControl;
  }
  

  // verifica se a acao é de criação ou atualização
  acao(): void {
    const creditoId = this.route.snapshot.paramMap.get('id');
    if (!creditoId) {
      this.update = false;
      this.pageTitle = 'Cadastrar Crédito Financeiro';
      this.botaoTitle = 'CADASTRAR';
      this.toastMessage = 'Criando...';
      return;
    }
    this.update = true;
    this.creditoId = creditoId;
    this.pageTitle = 'Atualizar Cadastro Financeiro';
    this.botaoTitle = 'ATUALIZAR';
    this.toastMessage = 'Atualizando...';
    this.creditoService
      .get(creditoId)
      .pipe(take(1))
      .subscribe(({ descricao, dataAprovacaoCredito, dataExpiracaoCredito, valorCredito, clienteId, arquivo, nomeArquivo }) => {
        this.cadastroCreditoFinanceiro.get('dataAprovacaoCredito').setValue(dataAprovacaoCredito),
        this.cadastroCreditoFinanceiro.get('dataExpiracaoCredito').setValue(dataExpiracaoCredito),
        this.cadastroCreditoFinanceiro.get('valorCredito').setValue(valorCredito),
        this.cadastroCreditoFinanceiro.get('descricao').setValue(descricao),
        this.cadastroCreditoFinanceiro.get('clienteId').setValue(clienteId),
        this.liberaArquivo = true;
        this.urlArquivo = arquivo;
        this.fileName = nomeArquivo;
        this.arquivoAntigo = nomeArquivo;
      });
  }

  async cadastraListaGlobal(id: string) {
    this.creditoService.init();
    await this.creditoService.createGlobal(this.cadastroCreditoFinanceiro.value, id);
  }

  async AtualizaListaGlobal() {
    this.creditoService.init();
    await this.creditoService.update({
      id: this.creditoId,
      dataAprovacaoCredito: this.cadastroCreditoFinanceiro.get('dataAprovacaoCredito').value,
      dataExpiracaoCredito: this.cadastroCreditoFinanceiro.get('dataExpiracaoCredito').value,
      valorCredito: this.cadastroCreditoFinanceiro.get('valorCredito').value,
      clienteId: this.cadastroCreditoFinanceiro.get('clienteId').value,
      descricao: this.cadastroCreditoFinanceiro.get('descricao').value
    });
  }

  async obter_dt_aprovacao_credito(dt_aprovacao: string)
  {
    this.dt_aprovacao = dt_aprovacao;
  }

  async obter_dt_expiracao_credito(dt_expiracao: string)
  {
    this.dt_expiracao = dt_expiracao;
  }

  // método que envia os dados do formulário para o banco de dados
  async onSubmit(): Promise<void> {    

    const loading = await this.overlayService.loading({
      message: this.toastMessage
    });

    if(this.dt_aprovacao > this.dt_expiracao){
      await this.overlayService.toast({
        message: "Data de Aprovação não pode ser maior que a Data de Expiração!"
        });
        loading.dismiss();
        return;      
    }

    try {
      const cadastroCredito = '';
      if (!this.creditoId) {

        this.creditoService.init();

        const cadastroCredito = await this.creditoService.create(this.cadastroCreditoFinanceiro.value);

        this.cadastraListaGlobal(this.creditoService.id);

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
      console.log('Cadastro Financeiro Criado', cadastroCredito);
      await this.overlayService.toast({
        message: "Cadastro Financeiro Criado"
      });
      this.navCtrl.navigateBack('/menu/ambiental/listaCreditoFinanceiro');
    } catch (error) {
      await this.overlayService.toast({
        message: error.message
      });
      console.log('Erro ao criar Crédito Financeiro: ', error);
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

    let idCredito = (this.creditoService.id === '') ? this.creditoId : this.creditoService.id;

    const ref2 = this.storage.ref(`/CreditoFinaceiro${idCredito}/${this.fileName}`);
    const task2 = ref2.put(file);

    task2.snapshotChanges().pipe(
      finalize(async () => {

        this.downloadUrl = ref2.getDownloadURL();
        this.liberaArquivo = true;

        this.downloadUrl.subscribe(async r => {
          this.creditoService.init();
          await this.creditoService.update({
            id: idCredito,
            dataAprovacaoCredito: this.cadastroCreditoFinanceiro.get('dataAprovacaoCredito').value,
            dataExpiracaoCredito: this.cadastroCreditoFinanceiro.get('dataExpiracaoCredito').value,
            valorCredito: this.cadastroCreditoFinanceiro.get('valorCredito').value,
            clienteId: this.cadastroCreditoFinanceiro.get('clienteId').value,
            descricao: this.cadastroCreditoFinanceiro.get('descricao').value,
            arquivo: r,
            nomeArquivo: this.fileName
          });
        });
      })
    ).subscribe();
  }

  deleteFile() {
    let idCredito = (this.creditoService.id === '') ? this.creditoId : this.creditoService.id;

    const ref = this.storage.ref(`/CreditoFinaceiro${idCredito}/`);
    ref.child(`${this.arquivoAntigo}`).delete();
  }

}
