import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { take } from 'rxjs/operators';
import { NavController, ModalController } from '@ionic/angular';
import { OverlayService } from 'src/app/core/services/overlay.service';
import { DeclaracaoAmbiental } from '../../models/da.model';
import { DaService } from 'src/app/core/services/da.service';
import { UsuarioService } from 'src/app/core/services/usuario.service';
import { Cliente } from '../../models/cliente.model';
import { ClienteService } from 'src/app/core/services/cliente.service';
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
pdfMake.vfs = pdfFonts.pdfMake.vfs;
import { RelatorioDaPage } from "../relatorio-da/relatorio-da.page";
import { AngularFireStorage } from '@angular/fire/storage';


@Component({
  selector: 'app-lista-da',
  templateUrl: './lista-da.page.html',
  styleUrls: ['./lista-da.page.scss'],
})
export class ListaDAPage implements OnInit {

  das$: Observable<DeclaracaoAmbiental[]>;
  clientes$: Observable<Cliente[]>;
  pdfObject: any;

  constructor(
    private navCtrl: NavController,
    private daService: DaService,
    private overlayService: OverlayService,
    private ModalController: ModalController,
    private usuarioService: UsuarioService,
    private clienteService: ClienteService,
    private storage: AngularFireStorage
  ) {}

  listaDa: Array<any> = [];
  listaDaCliente: Array<any> = [];
  async ngOnInit(): Promise<void> {
    const loading = await this.overlayService.loading();
    if (this.usuarioService.admin) {
      this.daService.init();
      this.das$ = this.daService.getAll();
      this.das$.pipe(take(1)).subscribe(() => loading.dismiss());

      this.das$.forEach(das => {
        this.listaDaCliente = [];
        das.forEach(da => {
          if(da.clienteId !== "" && da.clienteId !== undefined) {
            this.clientes$ = this.clienteService.initClienteId(da.clienteId);
            this.clientes$.subscribe(async (r: Cliente[]) => {
              da['nomeCliente'] = (r.length > 0) ? r[0].nome : 'Cliente excluído';
            });
            this.listaDaCliente.push(da);
        }
        });
      }); 

    }
    else {
      this.das$ =  this.daService.buscaDeclaracoesClientes(this.usuarioService.id);
      this.das$.pipe(take(1)).subscribe(() => loading.dismiss());
    }

  }

  atualizar(da: DeclaracaoAmbiental): void {
    this.navCtrl.navigateForward(`menu/ambiental/UpdateDeclaracaoAmbiental/${da.id}`);
  }

  viewDa(da: DeclaracaoAmbiental): void {
    this.navCtrl.navigateForward(`menu/ambiental/viewDa/${da.id}/view`);
  }

  async deletar(da: DeclaracaoAmbiental): Promise<void> {
    await this.overlayService.alert({
      message: `Você realmente deseja deletar a Declaracao Ambiental do Cliente: ${da.nomeCliente} - ${da.descricao}?`,
      buttons: [
        {
          text: 'Sim',
          handler: async () => {
            //deletar arquvios da declaração ambiental
            await this.deletarArquivoDeclaracaoAmbiental(da);
            await this.daService.init();
            await this.daService.delete(da);
            await this.overlayService.toast({
              message: `Declaracao Ambiental do Cliente: ${da.nomeCliente} - ${da.descricao} excluida!`
            });
          }
        },
        'Não'
      ]
    });
  }

  deletarArquivoDeclaracaoAmbiental(da: DeclaracaoAmbiental) {
    const ref = this.storage.ref(`/DeclaracaoAmbiental${da.id}`);
    ref.child(`${da.nomeArquivo}`).delete();
  }

  async openModal() {
    const modal = await this.ModalController.create({
      component: RelatorioDaPage
    })
    modal.present();
  } 

}
