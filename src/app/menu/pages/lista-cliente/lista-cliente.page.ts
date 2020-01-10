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
    private daService: DaService
  ) {}

  outorgas$: Observable <Outorga[]>;
  la$: Observable <LicencaAmbiental[]>;
  da$: Observable <DeclaracaoAmbiental[]>;


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
            await this.deletarOutorgasCliente(cliente);
            //deletar licença ambiental
            await this.deletarLicencaAmbientalCliente(cliente);
            //deletar declaração ambiental
            await this.deletarDeclacaoAmbientalCliente(cliente);

           /* await this.clienteService.init(); 
            await this.clienteService.delete(cliente); 
            //deletando os arquivos vinculado ao cliente
            await this.deletarArquivoFotoCliente(cliente); */

            await this.overlayService.toast( {
              message:`Cliente "${cliente.nome}" excluido ! `
            }); 
          }
        }, 
        'Não'
      ]
    }); 
  }

  async deletarOutorgasCliente(cliente: Cliente) {
    this.outorgas$ = this.outorgaService.buscaOutorgasClientes(cliente.id); 
    this.outorgas$.forEach(outorgas =>  {
      if (outorgas.length > 0) {
        outorgas.forEach(outorga => {
          if (outorga.id !== undefined && outorga.id !== '') {
            this.deletarArquivoOutorga(outorga);
            this.outorgaService.init();
            this.outorgaService.delete(outorga);
          }
        });
      }
    }); 
  }

  async deletarLicencaAmbientalCliente(cliente: Cliente) {
    this.la$ = this.laService.buscaLaClientes(cliente.id); 
    this.la$.forEach(las =>  {
      if (las.length > 0) {
        las.forEach(la => {
          if (la.id !== undefined && la.id !== '') {
            this.deletarArquivoLicencaAmbiental(la);
            this.laService.init();
            this.laService.delete(la);
          }
        });
      }
    }); 
  }

 async deletarDeclacaoAmbientalCliente(cliente: Cliente) {
    this.da$ = this.daService.buscaDeclaracoesClientes(cliente.id); 
    this.da$.forEach(das =>  {
      if (das.length > 0) {
        das.forEach(da => {
          if (da.id !== undefined && da.id !== '') {
            this.deletarArquivoDeclaracaoAmbiental(da);
            this.daService.init();
            this.daService.delete(da);
          }
        });
      }
    }); 
  }

  /*async deletarOutorgasCliente(cliente: Cliente) {
    this.outorgas$ = this.outorgaService.buscaOutorgasClientes(cliente.id); 
    this.outorgas$.forEach(outorgas =>  {
      if (outorgas.length > 0) {
        outorgas.forEach(outorga => {
          if (outorga.id !== undefined && outorga.id !== '') {
            this.deletarArquivoOutorga(outorga);
            this.outorgaService.init();
            this.outorgaService.delete(outorga);
          }
        });
      }
    }); 
  }

  async deletarOutorgasCliente(cliente: Cliente) {
    this.outorgas$ = this.outorgaService.buscaOutorgasClientes(cliente.id); 
    this.outorgas$.forEach(outorgas =>  {
      if (outorgas.length > 0) {
        outorgas.forEach(outorga => {
          if (outorga.id !== undefined && outorga.id !== '') {
            this.deletarArquivoOutorga(outorga);
            this.outorgaService.init();
            this.outorgaService.delete(outorga);
          }
        });
      }
    }); 
  }*/

  deletarArquivoFotoCliente(cliente: Cliente) {
    const ref = this.storage.ref(`/cliente${cliente.id}/`); 
    ref.child(`${cliente.nomeFoto}`).delete(); 
  }

  // deleta arquivos das ortogas
  deletarArquivoOutorga(outorga: Outorga) {
    const ref = this.storage.ref(`/outorga${outorga.id}`);
    ref.child(`${outorga.nomeArquivo}`).delete();
  }
  
  //deleta arquvios da licença ambiental
  deletarArquivoLicencaAmbiental(la: LicencaAmbiental) {
    const ref = this.storage.ref(`/LicencaAmbiental${la.id}`);
    ref.child(`${la.nomeArquivo}`).delete();
  }

  deletarArquivoDeclaracaoAmbiental(da: DeclaracaoAmbiental) {
    const ref = this.storage.ref(`/DeclaracaoAmbiental${da.id}`);
    ref.child(`${da.nomeArquivo}`).delete();
  }

  /*deletarArquivoOutorga(outorga: Outorga) {
    const ref = this.storage.ref(`/outorga${outorga.id}`);
    ref.child(`${outorga.nomeArquivo}`).delete();
  }

  deletarArquivoOutorga(outorga: Outorga) {
    const ref = this.storage.ref(`/outorga${outorga.id}`);
    ref.child(`${outorga.nomeArquivo}`).delete();
  }*/

  async openModal() {
    const modal = await this.ModalController.create( {
      component:RelatorioClientePage
    })
    modal.present(); 
  }
}
