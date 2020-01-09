import { Component, OnInit } from '@angular/core';
import { OverlayService } from 'src/app/core/services/overlay.service';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { NavController } from '@ionic/angular';
import { finalize, take } from 'rxjs/operators';
import { ClienteService } from 'src/app/core/services/cliente.service';
import { AngularFireStorage } from '@angular/fire/storage';
import { Observable } from 'rxjs';
import { trigger, state, transition, style, animate } from '@angular/animations';
import { UsuarioService } from 'src/app/core/services/usuario.service';


//caso de ruim, deletar esses imports
import { DocumentViewer, DocumentViewerOptions } from '@ionic-native/document-viewer/ngx';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';
import { Platform } from '@ionic/angular';
import { DadosPessoais } from '../../models/dadosPessoais.model';
import { DadosPessoaisService } from 'src/app/core/services/dados-pessoais.service';



@Component({
  selector: 'app-cria-cliente',
  templateUrl: './cria-cliente.page.html',
  styleUrls: ['./cria-cliente.page.scss'],
  animations: [
    trigger('tamanhoArquivo', [
      state('semArquivo', style({ 'height': '100px'})),
      state('comArquivo', style({ 'height': '250px'})),
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
export class CriaClientePage implements OnInit {
  impostoDeRenda$: Observable<DadosPessoais[]>;
  cnh$: Observable<DadosPessoais[]>;
 
 
 
  // Cliente
  clienteForm: FormGroup;
  clienteId: string = undefined;
  admin: boolean = false;
  update: boolean = false;

  // Validacao
  botaoTitle = '...';
  pageTitle = '...';
  toastMessage = '...';
  liberaArquivo = false;
  liberaAlterar = false;

  // FOTOS
  public uploadPercent: Observable<number>;
  public downloadUrl: Observable<string>;
  public urlFoto: string;
  arquivos: Object;
  files2: Observable<any[]>;
  fileName = '';
  novaFoto = false;
  fotoAntigo: any;

  // Dependencias
  constructor(
    private dpService: DadosPessoaisService,
    private iab: InAppBrowser,
    private document: DocumentViewer,
    private platform: Platform,

    private formBuilder: FormBuilder,
    private overlayService: OverlayService,
    private navCtrl: NavController,
    private route: ActivatedRoute,
    private clienteService: ClienteService,
    private storage: AngularFireStorage,
    private usuarioService: UsuarioService,
  ) {}

  // metodo que é chamado quando a pagina é carregada
  async ngOnInit() {
    this.criaFormulario();
    if (this.usuarioService.admin) {
      this.clienteService.initCliente();
      console.log('this.clienteService.initCliente();');
      this.admin = true;
    }
    else {
      this.clienteService.init();
      console.log('this.clienteService.init();');
      this.admin = false;
    }

    //deletar caso de ruim
    const loading = await this.overlayService.loading();
      this.dpService.initImpostoDeRenda();
      this.impostoDeRenda$ = this.dpService.getAll();
      this.impostoDeRenda$.pipe(take(1)).subscribe(() => loading.dismiss());

      const loading2 = await this.overlayService.loading();
      this.dpService.initCnh();
      this.cnh$ = this.dpService.getAll();
      this.cnh$.pipe(take(1)).subscribe(() => loading2.dismiss());

    this.acao();
  }

  async openGalery(event: FileList){
    try {
      const file = event.item(0);
        if (file.type.split('/')[0] !== 'image') {
          await this.overlayService.toast({
            message: 'tipo de arquivo não pode ser enviado por esse campo :('
          });
          return;
        }
      this.fileName = file.name;
      this.arquivos = file;
      this.uploadFile(this.arquivos);
      this.novaFoto = true;

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

      let idCliente = (this.clienteService.id === '') ? this.clienteId : this.clienteService.id;

      const ref2 = this.storage.ref(`/cliente${idCliente}/${this.fileName}`);
      const task2 = ref2.put(file);

      task2.snapshotChanges().pipe(
        finalize(async () => {

          this.downloadUrl = ref2.getDownloadURL();
          this.liberaArquivo = true;
          this.liberaAlterar = true;

          this.downloadUrl.subscribe(async r => {
            this.clienteService.initCliente();
            await this.clienteService.update({
              id: idCliente,
              cpf: this.clienteForm.get('cpf').value,
              nome: this.clienteForm.get('nome').value,
              foto: r,
              nomeFoto: this.fileName,
              patrimonio: this.clienteForm.get('patrimonio').value,
              pdtvAgro: this.clienteForm.get('pdtvAgro').value,
              informacoesAdicionais: this.clienteForm.get('informacoesAdicionais').value,
              rg: this.clienteForm.get('rg').value,
              dataNascimento: this.clienteForm.get('dataNascimento').value,
              telefone: this.clienteForm.get('telefone').value,
              email: this.clienteForm.get('email').value,
              senha: this.clienteForm.get('senha').value,
            });
          });
        })
      ).subscribe();
  }

  deletePicture(){
    const ref = this.storage.ref(`${this.fileName}`);
    const task = ref.delete();
  }

  deletePicturePasta(){
    let idCliente =  (this.clienteService.id === '') ? this.clienteId : this.clienteService.id;

    const ref = this.storage.ref(`/cliente${idCliente}/`);
    ref.child(`${this.fotoAntigo}`).delete();
  }

  // Cria formulários
  criaFormulario(): void {
    this.clienteForm = this.formBuilder.group({
      nome: this.formBuilder.control('', [Validators.required, Validators.minLength(3)]),
      cpf: this.formBuilder.control('', [
        Validators.required,
        Validators.minLength(14),
        Validators.maxLength(18)
      ]),
      rg: this.formBuilder.control('', [
        Validators.required,
        Validators.minLength(1),
      ]),
      telefone: this.formBuilder.control('', [
        Validators.required,
        Validators.minLength(14),
        Validators.maxLength(15)
      ]),
      dataNascimento: this.formBuilder.control('', [
        Validators.required,
      ]),
      email: this.formBuilder.control('', [
        Validators.required,
        Validators.email
      ]),
      senha: this.formBuilder.control('', [
        Validators.required,
        Validators.minLength(6),
      ]),
      patrimonio: this.formBuilder.control('', [
        Validators.required,
        Validators.minLength(3)
      ]),
      pdtvAgro: this.formBuilder.control('', [
        Validators.required,
        Validators.minLength(3)
      ]),
      informacoesAdicionais: this.formBuilder.control('', [Validators.minLength(0),Validators.maxLength(400)])
    });
  }

  // metodos get que pegam o valor do input no formulário
  get cpf(): FormControl {
    return this.clienteForm.get('cpf') as FormControl;
  }
  get pdtvAgro(): FormControl {
    return this.clienteForm.get('pdtvAgro') as FormControl;
  }
  get nome(): FormControl {
    return this.clienteForm.get('nome') as FormControl;
  }
  get rg(): FormControl {
    return this.clienteForm.get('rg') as FormControl;
  }
  get telefone(): FormControl {
    return this.clienteForm.get('telefone') as FormControl;
  }
  get dataNascimento(): FormControl {
    return this.clienteForm.get('dataNascimento') as FormControl;
  }
  get email(): FormControl {
    return this.clienteForm.get('email') as FormControl;
  }
  get senha(): FormControl {
    return this.clienteForm.get('senha') as FormControl;
  }
  get patrimonio(): FormControl {
    return this.clienteForm.get('patrimonio') as FormControl;
  }
  get informacoesAdicionais(): FormControl {
    return this.clienteForm.get('informacoesAdicionais') as FormControl;
  }

  // verifica se a acao é de criação ou atualização
  acao(): void {
    const clienteId = this.route.snapshot.paramMap.get('id');
    if (!clienteId) {
      this.update = false;
      this.pageTitle = 'Cadastrar Cliente';
      this.botaoTitle = 'CADASTRAR';
      this.toastMessage = 'Criando...';
      return;
    }
    this.update = true;
    this.clienteId = clienteId;
    this.pageTitle = 'Atualizar Cliente';
    this.botaoTitle = 'ATUALIZAR';
    this.toastMessage = 'Atualizando...';
    this.liberaArquivo = true;
    this.clienteService
      .get(clienteId)
      .pipe(take(1))
      .subscribe(({ nome, cpf, patrimonio, pdtvAgro, informacoesAdicionais, rg, telefone, dataNascimento, email, senha, foto, nomeFoto}) => {
        this.clienteForm.get('nome').setValue(nome),
          this.clienteForm.get('cpf').setValue(cpf),
          this.clienteForm.get('patrimonio').setValue(patrimonio),
          this.clienteForm.get('pdtvAgro').setValue(pdtvAgro),
          this.clienteForm.get('informacoesAdicionais').setValue(informacoesAdicionais),
          this.clienteForm.get('rg').setValue(rg),
          this.clienteForm.get('telefone').setValue(telefone),
          this.clienteForm.get('dataNascimento').setValue(dataNascimento),
          this.clienteForm.get('email').setValue(email),
          this.clienteForm.get('senha').setValue(senha),
          this.urlFoto = foto;
          this.fileName = nomeFoto;
          this.fotoAntigo = nomeFoto;
      });
  }

  async cadastraListaGlobal(id: string) {
    this.clienteService.initCliente();
    const cliente = await this.clienteService.createGlobal(this.clienteForm.value, id);
  }

  async AtualizaListaGlobal() {
    this.clienteService.initCliente();
    await this.clienteService.update({
      id: this.clienteId,
      cpf: this.clienteForm.get('cpf').value,
      nome: this.clienteForm.get('nome').value,
      patrimonio: this.clienteForm.get('patrimonio').value,
      pdtvAgro: this.clienteForm.get('pdtvAgro').value,
      informacoesAdicionais: this.clienteForm.get('informacoesAdicionais').value,
      rg: this.clienteForm.get('rg').value,
      telefone: this.clienteForm.get('telefone').value,
      dataNascimento: this.clienteForm.get('dataNascimento').value,
      email: this.clienteForm.get('email').value,
      senha: this.clienteForm.get('senha').value,
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
        this.clienteService.initCliente();
        const cliente = await this.clienteService.create(this.clienteForm.value);
        this.cadastraListaGlobal(this.clienteService.id);
        this.deletePicture();
        this.uploadFileTo(this.arquivos);
      } else {

        if (this.novaFoto) {
          if(this.fotoAntigo !== "") {
            this.deletePicturePasta();
            // deleta a foto temporaria que foi feito upload no servidor
            this.deletePicture();
          }
          this.uploadFileTo(this.arquivos);
          this.novaFoto = false;
        } else {
          this.AtualizaListaGlobal();
        }

      }
      console.log('Cliente Criado', cliente);
      this.navCtrl.navigateBack('/menu/cliente');
    } catch (error) {
      await this.overlayService.toast({
        message: error.message
      });
      console.log('Erro ao criar cliente: ', error);
    } finally {
      loading.dismiss();
    }
  }








  //deletar caso de ruim
  openLink(link: string){
    if (this.platform.is("mobile")) {
      const options: DocumentViewerOptions = {
        title: 'My PDF'
      }
      this.document.viewDocument(`${link}`, 'application/pdf', options)
    }
    else {
      this.iab.create(`${link}`, `_system`);
    }
    console.log(this.platform.is("mobile"));
  }

  iniciar(): void {
    this.dpService.init();
  }

  async openGaleryImpostoDeRendaCreate(event: FileList){
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
      this.uploadFileToImpostoDeRenda(file);

    }catch(error){
      console.error(error);
    }
  }

  async openGaleryImpostoDeRendaUpdate(event: FileList, id?: string){
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
      this.uploadFileToImpostoDeRendaUpdate(file, id);

    }catch(error){
      console.error(error);
    }
  }

  async openGaleryCnhCreate(event: FileList){
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
      this.uploadFileToCnh(file);

    }catch(error){
      console.error(error);
    }
  }

  async openGaleryCnhUpdate(event: FileList, id?: string){
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
      this.uploadFileToCnhUpdate(file, id);

    }catch(error){
      console.error(error);
    }
  }

  async uploadFileToImpostoDeRenda(file: Object){

      const ref2 = this.storage.ref(`/users/${this.usuarioService.id}/dadosPessoais/1/impostoDeRenda/${this.fileName}`);
      const task2 = ref2.put(file);

      task2.snapshotChanges().pipe(
        finalize(async () => {

          this.downloadUrl = ref2.getDownloadURL();

          this.downloadUrl.subscribe(async r => {
            this.dpService.initImpostoDeRenda();
            const addImpostoDeRenda = await this.dpService.create({
              id: this.dpService.usuarioId,
              impostoDeRenda: r
            });
          });
        })
      ).subscribe();
  }

  async uploadFileToImpostoDeRendaUpdate(file: Object, id?: string){

    const ref2 = this.storage.ref(`/users/${this.usuarioService.id}/dadosPessoais/1/impostoDeRenda/${this.fileName}`);
    const task2 = ref2.put(file);

      task2.snapshotChanges().pipe(
        finalize(async () => {

          this.downloadUrl = ref2.getDownloadURL();

          if (this.dpService.id) {
            this.downloadUrl.subscribe(async r => {
              this.dpService.initImpostoDeRenda();
              const updateImpostoDeRenda = await this.dpService.update({
                id: this.dpService.id,
                impostoDeRenda: r
              });
            });
          }
          else {
            this.downloadUrl.subscribe(async r => {
              this.dpService.initImpostoDeRenda();
              const updateImpostoDeRenda = await this.dpService.update({
                id: id,
                impostoDeRenda: r
              });
            });
          }


        })
      ).subscribe();
  }

  async uploadFileToCnh(file: Object){

      const ref2 = this.storage.ref(`/users/${this.usuarioService.id}/dadosPessoais/1/cnh/${this.fileName}`);
      const task2 = ref2.put(file);

      task2.snapshotChanges().pipe(
        finalize(async () => {

          this.downloadUrl = ref2.getDownloadURL();

          this.downloadUrl.subscribe(async r => {
            this.dpService.initCnh();
            const addCnh= await this.dpService.create({
              id: this.dpService.usuarioId,
              cnh: r
            });
          });
        })
      ).subscribe();
  }

  async uploadFileToCnhUpdate(file: Object, id?: string){

    const ref2 = this.storage.ref(`/users/${this.usuarioService.id}/dadosPessoais/1/cnh/${this.fileName}`);
    const task2 = ref2.put(file);

      task2.snapshotChanges().pipe(
        finalize(async () => {

          this.downloadUrl = ref2.getDownloadURL();

          if (this.dpService.id) {
            this.downloadUrl.subscribe(async r => {
              this.dpService.initCnh();
              const updateCnh = await this.dpService.update({
                id: this.dpService.id,
                cnh: r
              });
            });
          }
          else {
            this.downloadUrl.subscribe(async r => {
              this.dpService.initCnh();
              const updateCnh = await this.dpService.update({
                id: id,
                cnh: r
              });
            });
          }


        })
      ).subscribe();
  }


}
