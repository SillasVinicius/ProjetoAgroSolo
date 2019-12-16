import { Component, OnInit } from '@angular/core';
import { OverlayService } from 'src/app/core/services/overlay.service';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { NavController } from '@ionic/angular';
import { finalize, take } from 'rxjs/operators';
import { AngularFireStorage } from '@angular/fire/storage';
import { Observable } from 'rxjs';
//import { LaService } from 'src/app/core/services/la.service';
import { ClienteService } from 'src/app/core/services/cliente.service';
import { Cliente } from '../../models/cliente.model';
import { trigger, state, transition, style, animate } from '@angular/animations';
import { UsuarioService } from 'src/app/core/services/usuario.service';
import { CreditoService } from 'src/app/core/services/credito.service';


@Component({
  selector: 'app-cria-la',
  templateUrl: './cria-la.page.html',
  styleUrls: ['./cria-la.page.scss'],
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
export class CreditoPage implements OnInit {


      // Crédito Financeiro
      creditoForm: FormGroup;
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
      arquivos: Object;
      files2: Observable<any[]>;
      fileName = '';


      constructor(
        private formBuilder: FormBuilder,
        private overlayService: OverlayService,
        private navCtrl: NavController,
        private route: ActivatedRoute,
        //private creditoService: LaService,
        private clienteService: ClienteService,
        private usuarioService: UsuarioService,
        private storage: AngularFireStorage,
        private creditoService: CreditoService  ) {}

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

        console.log(this.clientes);
        this.clienteService.id = '';
        this.acao();
      }
      // Cria formulários
      criaFormulario(): void {
        this.creditoForm = this.formBuilder.group({          
          dataAprovacaoCredito: this.formBuilder.control('', [Validators.required, Validators.minLength(10)]),
          dataExpiracaoCredito: this.formBuilder.control('', [Validators.required, Validators.minLength(10), Validators.maxLength(10)]),
          valorCredito: this.formBuilder.control('', [Validators.required]),
          Cliente: this.formBuilder.control('', [Validators.required])
        });
      }

      // metodos get que pegam o valor do input no formulário
      get dataAprovacaoCredito(): FormControl {
        return this.creditoForm.get('dataAprovacaoCredito') as FormControl;
      }
      get dataExpiracaoCredito(): FormControl {
        return this.creditoForm.get('dataExpiracaoCredito') as FormControl;
      }
      get valorCredito(): FormControl {
        return this.creditoForm.get('valorCredito') as FormControl;
      }
      get cliente(): FormControl {
        return this.creditoForm.get('Cliente') as FormControl;
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
          .subscribe(({ dataAprovacaoCredito, dataExpiracaoCredito, valorCredito, cliente  }) => {
            this.creditoForm.get('dataAprovacaoCredito').setValue(dataAprovacaoCredito),
              this.creditoForm.get('dataExpiracaoCredito').setValue(dataExpiracaoCredito),
              this.creditoForm.get('valorCredito').setValue(valorCredito),
              this.creditoForm.get('idCliente').setValue(cliente)
          });
      }

      async cadastraListaGlobal(id: string) {
        this.creditoService.initLA();
        const credito = await this.creditoService.createGlobal(this.creditoForm.value, id);
      }

      async AtualizaListaGlobal() {
        this.creditoService.initLA();
        const atualizarFoto = await this.creditoService.update({
          id: this.creditoId,
          dataAprovacaoCredito: this.creditoForm.get('dataAprovacaoCredito').value,
          dataExpiracaoCredito: this.creditoForm.get('dataExpiracaoCredito').value,
          valorCredito: this.creditoForm.get('valorCredito').value,
          cliente: this.creditoForm.get('Cliente').value
        });
      }

      // método que envia os dados do formulário para o banco de dados
      async onSubmit(): Promise<void> {
        const loading = await this.overlayService.loading({
          message: this.toastMessage
        });
        try {
          const credito = '';
          if (!this.creditoId) {

            this.creditoService.init();

            const credito = await this.creditoService.create(this.creditoForm.value);

            this.cadastraListaGlobal(this.creditoService.id);          

            this.uploadFileTo(this.arquivos);

          } else {

            // this.deletePicture();
            //
            // this.uploadFileToUpdate(this.arquivos);

            this.creditoService.init();
            const atualizar = await this.creditoService.update({
              id: this.creditoId,
              dataAprovacaoCredito: this.creditoForm.get('dataAprovacaoCredito').value,
              dataExpiracaoCredito: this.creditoForm.get('dataExpiracaoCredito').value,
              valorCredito: this.creditoForm.get('valorCredito').value,
              cliente: this.creditoForm.get('Cliente').value
            });

            this.AtualizaListaGlobal();

          }
          console.log('Cadastro Financeiro Criado', credito);
          this.navCtrl.navigateBack('/menu/ambiental/credito');
        } catch (error) {
          await this.overlayService.toast({
            message: error.message
          });
          console.log('Erro ao criar Crédito Financeiro: ', error);
        } finally {
          loading.dismiss();
        }
      }        

      async uploadFileTo(file: Object){

          const ref2 = this.storage.ref(`/users/${this.creditoService.usuarioId}/credito/${this.creditoService.id}/arquivos/${this.fileName}`);
          const task2 = ref2.put(file);

          task2.snapshotChanges().pipe(
            finalize(async () => {

              this.downloadUrl = ref2.getDownloadURL();
              this.liberaArquivo = true;

              this.downloadUrl.subscribe(async r => {
                this.creditoService.init();
                const atualizarFoto = await this.creditoService.update({
                  id: this.creditoService.id,
                  dataAprovacaoCredito: this.creditoForm.get('dataAprovacaoCredito').value,
                  dataExpiracaoCredito: this.creditoForm.get('dataDeVencimento').value,
                  valorCredito: this.creditoForm.get('valorCredito').value,
                  cliente: this.creditoForm.get('Cliente').value,
                  arquivo: r
                });
              });
            })
          ).subscribe();
      }  


    }
