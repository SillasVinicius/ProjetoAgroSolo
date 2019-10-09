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


@Component({
  selector: 'app-cria-car',
  templateUrl: './cria-car.page.html',
  styleUrls: ['./cria-car.page.scss'],
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
        private cadastroRuralAmbientalService: CarService,
        private clienteService: ClienteService,
        private storage: AngularFireStorage  ) {}

      // metodo que é chamado quando a pagina é carregada
      ngOnInit() {
        this.criaFormulario();
        this.clienteService.init();
        this.clienteService.getAll().subscribe((r: Cliente[]) => {
          for (let i = 0; i < r.length; i++) {
              this.clientes[i] = r[i];
          }
        });
        console.log(this.clientes);
        this.clienteService.id = '';
        this.acao();
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
            const cadastroRuralAmbiental = await this.cadastroRuralAmbientalService.create(this.cadastroRuralAmbientalForm.value);

            this.deletePicture();

            this.uploadFileTo(this.arquivos);
          } else {
            this.deletePicture();

            this.uploadFileToUpdate(this.arquivos);
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

          const ref2 = this.storage.ref(`/users/${this.cadastroRuralAmbientalService.usuarioId}/CadastroRuralAmbiental/${this.cadastroRuralAmbientalService.id}/arquivos/${this.fileName}`);
          const task2 = ref2.put(file);

          task2.snapshotChanges().pipe(
            finalize(async () => {

              this.downloadUrl = ref2.getDownloadURL();
              this.liberaArquivo = true;

              this.downloadUrl.subscribe(async r => {
                this.cadastroRuralAmbientalService.init();
                const atualizarFoto = await this.cadastroRuralAmbientalService.update({
                  id: this.cadastroRuralAmbientalService.id,
                  descricao: this.cadastroRuralAmbientalForm.get('descricao').value,
                  clienteId: this.cadastroRuralAmbientalForm.get('idCliente').value,
                  arquivo: r
                });
              });
            })
          ).subscribe();
      }

      async uploadFileToUpdate(file: Object){

        const ref2 = this.storage.ref(`/users/${this.cadastroRuralAmbientalService.usuarioId}/CadastroRuralAmbiental/${this.cadastroRuralAmbientalService.id}/arquivos/${this.fileName}`);
        const task2 = ref2.put(file);

        task2.snapshotChanges().pipe(
          finalize(async () => {

            this.downloadUrl = ref2.getDownloadURL();
            this.liberaArquivo = true;

            this.downloadUrl.subscribe(async r => {
              this.cadastroRuralAmbientalService.init();
              const atualizarFoto = await this.cadastroRuralAmbientalService.update({
                id: this.cadastroRuralAmbientalId,
                descricao: this.cadastroRuralAmbientalForm.get('descricao').value,
                clienteId: this.cadastroRuralAmbientalForm.get('idCliente').value,
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
