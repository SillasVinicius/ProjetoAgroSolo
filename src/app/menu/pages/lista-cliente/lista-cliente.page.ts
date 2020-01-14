import {Component, OnInit }from '@angular/core'; 
import {Observable }from 'rxjs'; 
import {Cliente }from '../../models/cliente.model'; 
import {take }from 'rxjs/operators'; 
import {NavController, ModalController }from '@ionic/angular'; 
import {ClienteService }from 'src/app/core/services/cliente.service'; 
import {OverlayService }from 'src/app/core/services/overlay.service'; 
import {UsuarioService }from 'src/app/core/services/usuario.service'; 
import {RelatorioClientePage }from "../relatorio-cliente/relatorio-cliente.page"; 
import {AngularFireStorage }from '@angular/fire/storage';
import {OutorgaService }from 'src/app/core/services/outorga.service'; 
import {Outorga }from '../../models/outorga.model';
import { LicencaAmbiental } from '../../models/la.model';
import { LaService } from 'src/app/core/services/la.service';
import { DeclaracaoAmbiental } from '../../models/da.model';
import { DaService } from 'src/app/core/services/da.service';
import { CarService } from 'src/app/core/services/car.service';
import { CadastroAmbientalRural } from '../../models/car.model';
import { CreditoService } from 'src/app/core/services/credito.service';
import { Credito } from 'src/app/menu/models/credito.model';

@Component( {
  selector:'app-lista-cliente', 
  templateUrl:'./lista-cliente.page.html', 
  styleUrls:['./lista-cliente.page.scss']
})
export class ListaClientePage implements OnInit {
  clientes$:Observable < Cliente[] > ; 
  pdfObject:any; 
  constructor(
    private navCtrl: NavController, 
    private ModalController: ModalController, 
    private clienteService: ClienteService, 
    private overlayService: OverlayService, 
    private usuarioService: UsuarioService, 
    private storage: AngularFireStorage, 
    private outorgaService: OutorgaService,
    private laService: LaService,
    private daService: DaService,
    private carService: CarService,
    private creditoService: CreditoService
  ) {}

  outorgas$: Observable <Outorga[]>;
  la$: Observable <LicencaAmbiental[]>;
  da$: Observable <DeclaracaoAmbiental[]>;
  cadastrosAmbientaisRurais$: Observable<CadastroAmbientalRural[]>;
  creditoFinanceiro$: Observable<Credito[]>;


  listaCliente:Array < any >  = []; 
  async ngOnInit():Promise < void >  {
    const loading = await this.overlayService.loading(); 
    if (this.usuarioService.admin) {
      this.clienteService.init(); 
      this.clientes$ = this.clienteService.getAll(); 
      this.clientes$.pipe(take(1)).subscribe(() => loading.dismiss()); 
    }
    else {
      this.clientes$ = this.clienteService.initClienteId(this.usuarioService.id); 
      this.clientes$.pipe(take(1)).subscribe(() => loading.dismiss()); 
    }
  }

  atualizar(cliente:Cliente):void {
    this.navCtrl.navigateForward(`/menu/updateCliente/${cliente.id}`); 
  }

  async deletar(cliente:Cliente):Promise < void >  {
    await this.overlayService.alert( {
      message:`Você realmente deseja deletar o cliente "${cliente.nome}"?`, 
      buttons:[ {
          text:'Sim', 
          handler:async () =>  {
            //deletar as outorgas vinculados ao cliente
            this.outorgaService.init();
            await this.deletarOutorgasCliente(cliente);
            //deletar licença ambiental
            this.laService.init();
            await this.deletarLicencaAmbientalCliente(cliente);
            //deletar declaração ambiental
            this.daService.init();
            await this.deletarDeclacaoAmbientalCliente(cliente);
            //deletar cadastro de lincença ambiental
            this.carService.init();
            await this.deletarCadastroAmbientalRuralCliente(cliente);
            //deletar os creditos financeiros cadastrados para o cliente
            this.creditoService.init();
            await this.deletarCreditoFinanceiroCliente(cliente);

            await this.clienteService.init(); 
            await this.clienteService.delete(cliente); 
            //deletando os arquivos vinculado ao cliente
            await this.deletarArquivoFotoCliente(cliente);

            await this.overlayService.toast( {
              message:`Cliente "${cliente.nome}" excluido ! `
            }); 
          }
        }, 
        'Não'
      ]
    }); 
  }

  //busca todas as outorgas existentes para o cliente e deletas as mesmas
  async deletarOutorgasCliente(cliente: Cliente) {
    let executar = true; // evita que o processo seja executado duas vezes para o mesmo registro
    this.outorgas$ = this.outorgaService.buscaOutorgasClientes(cliente.id); 
    this.outorgas$.forEach(outorgas =>  {
      if (outorgas.length > 0) {
        outorgas.forEach(outorga => {
          if (outorga.id !== undefined && outorga.id !== '' && executar) {
            this.deletarArquivoOutorga(outorga);
            this.outorgaService.delete(outorga);
          }
        });
        executar = false;
      }
    }); 
  }

  //busca todas as licenças ambientais existentes para o cliente e deletas as mesmas
  async deletarLicencaAmbientalCliente(cliente: Cliente) {
    let executar = true; // evita que o processo seja executado duas vezes para o mesmo registro
    this.la$ = this.laService.buscaLaClientes(cliente.id); 
    this.la$.forEach(las =>  {
      if (las.length > 0) {
        las.forEach(la => {
          if (la.id !== undefined && la.id !== '' && executar) {
            this.deletarArquivoLicencaAmbiental(la);
            this.laService.delete(la);
          }
        });
        executar = false;
      }
    }); 
  }

 //busca todas as declarações existentes para o cliente e deletas as mesmas
 async deletarDeclacaoAmbientalCliente(cliente: Cliente) {
    let executar = true; // evita que o processo seja executado duas vezes para o mesmo registro
    this.da$ = this.daService.buscaDeclaracoesClientes(cliente.id); 
    this.da$.forEach(das =>  {
      if (das.length > 0) {
        das.forEach(da => {
          if (da.id !== undefined && da.id !== '' && executar) {
            this.deletarArquivoDeclaracaoAmbiental(da);
            this.daService.delete(da);
          }
        });
        executar = false;
      }
    }); 
  }

 //busca todas os cadastros ambientais do cliente
 async deletarCadastroAmbientalRuralCliente(cliente: Cliente) {
    let executar = true; // evita que o processo seja executado duas vezes para o mesmo registro
    this.cadastrosAmbientaisRurais$ = this.carService.buscaCarClientes(cliente.id);    
    this.cadastrosAmbientaisRurais$.forEach(cars =>  {
      if (cars.length > 0) {
        cars.forEach(car => {
          if (car.id !== undefined && car.id !== '' && executar) {
            this.deletarArquivoAmbientalRural(car);
            this.carService.delete(car);
          }
        });
        executar = false;
      }
    }); 
  }

  async deletarCreditoFinanceiroCliente(cliente: Cliente) {
    let executar = true;
    this.creditoFinanceiro$ = this.creditoService.buscaCreditoClientes(cliente.id); 
    this.creditoFinanceiro$.forEach(creditos =>  {
      if (creditos.length > 0) {
        creditos.forEach(credito => {
          if (credito.id !== undefined && credito.id !== '' && executar) {
            this.deletarArquivoCreditoFinanceiro(credito);
            this.creditoService.delete(credito);
          }
        });
        executar = false;
      }
    }); 
  }

  deletarArquivoFotoCliente(cliente: Cliente) {
    const ref = this.storage.ref(`/cliente${cliente.id}/`); 
    ref.child(`${cliente.nomeFoto}`).delete(); 
  }

  // deleta arquivos das ortogas
  deletarArquivoOutorga(outorga: Outorga) {
    const ref = this.storage.ref(`/outorga${outorga.id}/`);
    ref.child(`${outorga.nomeArquivo}`).delete();
  }
  
  //deleta arquvios da licença ambiental
  deletarArquivoLicencaAmbiental(la: LicencaAmbiental) {
    const ref = this.storage.ref(`/LicencaAmbiental${la.id}/`);
    ref.child(`${la.nomeArquivo}`).delete();
  }

  //deleta arquivos da declaração ambiental
  deletarArquivoDeclaracaoAmbiental(da: DeclaracaoAmbiental) {
    const ref = this.storage.ref(`/DeclaracaoAmbiental${da.id}/`);
    ref.child(`${da.nomeArquivo}`).delete();
  }

  deletarArquivoAmbientalRural(car: CadastroAmbientalRural) {
    const ref = this.storage.ref(`/CadastroRuralAmbiental${car.id}/`);
    ref.child(`${car.nomeArquivo}`).delete();
  }

  deletarArquivoCreditoFinanceiro(credito: Credito) {
    const ref = this.storage.ref(`/CreditoFinaceiro${credito.id}/`);
    ref.child(`${credito.nomeArquivo}`).delete();
  }

  async openModal() {
    const modal = await this.ModalController.create( {
      component:RelatorioClientePage
    })
    modal.present(); 
  }
}
