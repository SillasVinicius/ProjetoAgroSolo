import { Component, OnInit } from '@angular/core';
import { OverlayService } from 'src/app/core/services/overlay.service';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { NavController } from '@ionic/angular';
import { finalize, take } from 'rxjs/operators';
import { AngularFireStorage } from '@angular/fire/storage';
import { Observable } from 'rxjs';
import { CarService } from 'src/app/core/services/car.service';
import { ClienteService } from 'src/app/core/services/cliente.service';
import { Cliente } from '../../models/cliente.model';
import { trigger, state, transition, style, animate } from '@angular/animations';
import { UsuarioService } from 'src/app/core/services/usuario.service';


@Component({
  selector: 'app-cria-car',
  templateUrl: './cria-car.page.html',
  styleUrls: ['./cria-car.page.scss'],
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
export class CriaCarPage implements OnInit {


  // cadastro Rural Ambiental
  cadastroRuralAmbientalForm: FormGroup;
  cadastroRuralAmbientalId: string = undefined;
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
    private cadastroRuralAmbientalService: CarService,
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
    this.cadastroRuralAmbientalForm = this.formBuilder.group({
      descricao: this.formBuilder.control('', [Validators.required, Validators.minLength(3)]),
      clienteId: this.formBuilder.control('', [Validators.required])
    });
  }

  // metodos get que pegam o valor do input no formulário
  get descricao(): FormControl {
    return this.cadastroRuralAmbientalForm.get('descricao') as FormControl;
  }
  get clienteId(): FormControl {
    return this.cadastroRuralAmbientalForm.get('clienteId') as FormControl;
  }

  // verifica se a acao é de criação ou atualização
  acao(): void {
    const declaracaoAmbientalId = this.route.snapshot.paramMap.get('id');
    if (!declaracaoAmbientalId) {
      this.update = false;
      this.pageTitle = 'Cadastrar C.A.R';
      this.botaoTitle = 'CADASTRAR';
      this.toastMessage = 'Criando...';
      return;
    }
    this.update = true;
    this.cadastroRuralAmbientalId = declaracaoAmbientalId;
    this.pageTitle = 'Atualizar C.A.R';
    this.botaoTitle = 'ATUALIZAR';
    this.toastMessage = 'Atualizando...';
    this.cadastroRuralAmbientalService
      .get(declaracaoAmbientalId)
      .pipe(take(1))
      .subscribe(({ descricao, clienteId, arquivo, nomeArquivo }) => {
        this.cadastroRuralAmbientalForm.get('descricao').setValue(descricao);
        this.cadastroRuralAmbientalForm.get('clienteId').setValue(clienteId);
        this.liberaArquivo = true;
        this.urlArquivo = arquivo;
        this.fileName = nomeArquivo;
        this.arquivoAntigo = nomeArquivo;
      });
  }

  async cadastraListaGlobal(id: string) {
    this.cadastroRuralAmbientalService.init();
    await this.cadastroRuralAmbientalService.createGlobal(this.cadastroRuralAmbientalForm.value, id);
  }

  async AtualizaListaGlobal() {
    this.cadastroRuralAmbientalService.init();
    await this.cadastroRuralAmbientalService.update({
      id: this.cadastroRuralAmbientalId,
      descricao: this.cadastroRuralAmbientalForm.get('descricao').value,
      clienteId: this.cadastroRuralAmbientalForm.get('clienteId').value
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
        this.cadastroRuralAmbientalService.init();

        const cadastroRuralAmbiental = await this.cadastroRuralAmbientalService.create(this.cadastroRuralAmbientalForm.value);
        this.cadastraListaGlobal(this.cadastroRuralAmbientalService.id);

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

    let idCar = (this.cadastroRuralAmbientalService.id === '') ? this.cadastroRuralAmbientalId : this.cadastroRuralAmbientalService.id;

    const ref2 = this.storage.ref(`/CadastroRuralAmbiental${idCar}/${this.fileName}`);
    const task2 = ref2.put(file);

    task2.snapshotChanges().pipe(
      finalize(async () => {

        this.downloadUrl = ref2.getDownloadURL();
        this.liberaArquivo = true;

        this.downloadUrl.subscribe(async r => {
          this.cadastroRuralAmbientalService.init();
          await this.cadastroRuralAmbientalService.update({
            id: idCar,
            descricao: this.cadastroRuralAmbientalForm.get('descricao').value,
            clienteId: this.cadastroRuralAmbientalForm.get('clienteId').value,
            arquivo: r,
            nomeArquivo: this.fileName
          });
        });
      })
    ).subscribe();
  }

  deletePicture() {

    let idCar = (this.cadastroRuralAmbientalService.id === '') ? this.cadastroRuralAmbientalId : this.cadastroRuralAmbientalService.id;

    const ref = this.storage.ref(`/CadastroRuralAmbiental${idCar}/`);
    ref.child(`${this.arquivoAntigo}`).delete();
  }

}
