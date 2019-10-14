import { Component, OnInit } from '@angular/core';
import { OverlayService } from 'src/app/core/services/overlay.service';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { NavController, Platform } from '@ionic/angular';
import { finalize, take } from 'rxjs/operators';
import { ClienteService } from 'src/app/core/services/cliente.service';
import { AngularFireStorage } from '@angular/fire/storage';
import { Observable } from 'rxjs';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { File } from '@ionic-native/file/ngx';
import { trigger, state, transition, style, animate } from '@angular/animations';



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
  // Cliente
  clienteForm: FormGroup;
  clienteId: string = undefined;

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

  // Dependencias
  constructor(
    private formBuilder: FormBuilder,
    private overlayService: OverlayService,
    private navCtrl: NavController,
    private route: ActivatedRoute,
    private clienteService: ClienteService,
    private storage: AngularFireStorage,
    private camera: Camera,
    private platform: Platform,
    private file: File
  ) {}

  // metodo que é chamado quando a pagina é carregada
  ngOnInit() {
    this.criaFormulario();
    this.clienteService.init();
    this.clienteService.id = '';
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

      const ref2 = this.storage.ref(`/users/${this.clienteService.usuarioId}/cliente/${this.clienteService.id}/imagem.jpg`);
      const task2 = ref2.put(file);

      task2.snapshotChanges().pipe(
        finalize(async () => {

          this.downloadUrl = ref2.getDownloadURL();
          this.liberaArquivo = true;
          this.liberaAlterar = true;

          this.downloadUrl.subscribe(async r => {
            this.clienteService.init();
            const atualizarFoto = await this.clienteService.update({
              id: this.clienteService.id,
              cpf: this.clienteForm.get('cpf').value,
              nome: this.clienteForm.get('nome').value,
              foto: r,
              patrimonio: this.clienteForm.get('patrimonio').value,
              pdtvAgro: this.clienteForm.get('pdtvAgro').value
            });
          });
        })
      ).subscribe();
  }

  async uploadFileToUpdate(file: Object){

      const ref2 = this.storage.ref(`/users/${this.clienteService.usuarioId}/cliente/${this.clienteService.id}/imagem.jpg`);
      const task2 = ref2.put(file);

      task2.snapshotChanges().pipe(
        finalize(async () => {

          this.downloadUrl = ref2.getDownloadURL();
          this.liberaArquivo = true;
          this.liberaAlterar = true;

          this.downloadUrl.subscribe(async r => {
            this.clienteService.init();
            const cliente = await this.clienteService.update({
              id: this.clienteId,
              cpf: this.clienteForm.get('cpf').value,
              nome: this.clienteForm.get('nome').value,
              foto: r,
              patrimonio: this.clienteForm.get('patrimonio').value,
              pdtvAgro: this.clienteForm.get('pdtvAgro').value
            });
          });
        })
      ).subscribe();
  }

  deletePicture(){
    const ref = this.storage.ref(`${this.fileName}`);
    const task = ref.delete();
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
      patrimonio: this.formBuilder.control('', [
        Validators.required,
        Validators.minLength(3)
      ]),
      pdtvAgro: this.formBuilder.control('', [
        Validators.required,
        Validators.minLength(3)
      ])
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
  get patrimonio(): FormControl {
    return this.clienteForm.get('patrimonio') as FormControl;
  }

  // verifica se a acao é de criação ou atualização
  acao(): void {
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
      .subscribe(({ nome, cpf, patrimonio, pdtvAgro}) => {
        this.clienteForm.get('nome').setValue(nome),
          this.clienteForm.get('cpf').setValue(cpf),
          this.clienteForm.get('patrimonio').setValue(patrimonio),
          this.clienteForm.get('pdtvAgro').setValue(pdtvAgro)
      });
  }

  async cadastraListaGlobal(id: string) {
    this.clienteService.initCliente();
    const cliente = await this.clienteService.createGlobal(this.clienteForm.value, id);
  }

  async AtualizaListaGlobal() {
    this.clienteService.initCliente();
    const cliente = await this.clienteService.update({
      id: this.clienteId,
      cpf: this.clienteForm.get('cpf').value,
      nome: this.clienteForm.get('nome').value,
      patrimonio: this.clienteForm.get('patrimonio').value,
      pdtvAgro: this.clienteForm.get('pdtvAgro').value
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
        this.clienteService.init();
        const cliente = await this.clienteService.create(this.clienteForm.value);
        this.cadastraListaGlobal(this.clienteService.id);

        this.deletePicture();

        this.uploadFileTo(this.arquivos);




      } else {

        this.deletePicture();

        this.uploadFileToUpdate(this.arquivos);

        this.AtualizaListaGlobal();


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

}
