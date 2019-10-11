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
export class CriaOutorgaPage implements OnInit {

  // outorga
  outorgaForm: FormGroup;
  outorgaId: string = undefined;

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
    private outorgaService: OutorgaService,
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
    this.outorgaForm = this.formBuilder.group({
      descricao: this.formBuilder.control('', [Validators.required, Validators.minLength(3)]),
      dataDeVencimento: this.formBuilder.control('', [Validators.required, Validators.minLength(10),
        Validators.maxLength(10)]),
      idCliente: this.formBuilder.control('', [Validators.required])
    });
  }

  // metodos get que pegam o valor do input no formulário
  get descricao(): FormControl {
    return this.outorgaForm.get('descricao') as FormControl;
  }
  get dataDeVencimento(): FormControl {
    return this.outorgaForm.get('dataDeVencimento') as FormControl;
  }

  get idCliente(): FormControl {
    return this.outorgaForm.get('idCliente') as FormControl;
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
      .subscribe(({ descricao, dataDeVencimento, clienteId  }) => {
        this.outorgaForm.get('descricao').setValue(descricao),
          this.outorgaForm.get('dataDeVencimento').setValue(dataDeVencimento)
          this.outorgaForm.get('idCliente').setValue(clienteId)
      });
  }

  async cadastraListaGlobal(id: string) {
    this.outorgaService.initOutorga();
    const outorga = await this.outorgaService.createGlobal(this.outorgaForm.value, id);
  }

  async AtualizaListaGlobal() {
    this.outorgaService.initOutorga();
    const atualizarFoto = await this.outorgaService.update({
      id: this.outorgaId,
      descricao: this.outorgaForm.get('descricao').value,
      dataDeVencimento: this.outorgaForm.get('dataDeVencimento').value,
      clienteId: this.outorgaForm.get('idCliente').value
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

        this.deletePicture();

        this.uploadFileTo(this.arquivos);

      } else {

        this.deletePicture();

        this.uploadFileToUpdate(this.arquivos);

        this.AtualizaListaGlobal();
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

      const ref2 = this.storage.ref(`/users/${this.outorgaService.usuarioId}/outorga/${this.outorgaService.id}/arquivos/${this.fileName}`);
      const task2 = ref2.put(file);

      task2.snapshotChanges().pipe(
        finalize(async () => {

          this.downloadUrl = ref2.getDownloadURL();
          this.liberaArquivo = true;

          this.downloadUrl.subscribe(async r => {
            this.outorgaService.init();
            const atualizarFoto = await this.outorgaService.update({
              id: this.outorgaService.id,
              descricao: this.outorgaForm.get('descricao').value,
              dataDeVencimento: this.outorgaForm.get('dataDeVencimento').value,
              clienteId: this.outorgaForm.get('idCliente').value,
              arquivo: r
            });
          });
        })
      ).subscribe();
  }

  async uploadFileToUpdate(file: Object){

    const ref2 = this.storage.ref(`/users/${this.outorgaService.usuarioId}/outorga/${this.outorgaService.id}/arquivos/${this.fileName}`);
    const task2 = ref2.put(file);

    task2.snapshotChanges().pipe(
      finalize(async () => {

        this.downloadUrl = ref2.getDownloadURL();
        this.liberaArquivo = true;

        this.downloadUrl.subscribe(async r => {
          this.outorgaService.init();
          const atualizarFoto = await this.outorgaService.update({
            id: this.outorgaId,
            descricao: this.outorgaForm.get('descricao').value,
            dataDeVencimento: this.outorgaForm.get('dataDeVencimento').value,
            clienteId: this.outorgaForm.get('idCliente').value,
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
