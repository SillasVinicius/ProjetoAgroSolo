import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Credito } from '../../models/credito.model';
import { NavController, ModalController } from '@ionic/angular';
import { CreditoService } from 'src/app/core/services/credito.service';
import { OverlayService } from 'src/app/core/services/overlay.service';
import { UsuarioService } from 'src/app/core/services/usuario.service';
import { ClienteService } from 'src/app/core/services/cliente.service';
import { Cliente } from '../../models/cliente.model';
import { take } from 'rxjs/operators';
import { AngularFireStorage } from '@angular/fire/storage';
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
pdfMake.vfs = pdfFonts.pdfMake.vfs;
import { RelatorioCreditoPage } from "../relatorio-credito/relatorio-credito.page";

@Component({
  selector: 'app-lista-credito',
  templateUrl: './lista-credito.page.html',
  styleUrls: ['./lista-credito.page.scss'],
})
export class ListaCreditoPage implements OnInit {


  cadastrosDeCreditos$: Observable<Credito[]>;
  clientes$: Observable<Cliente[]>;
  pdfObject: any;

  constructor(
    private navCtrl: NavController,
    private creditoService: CreditoService,
    private overlayService: OverlayService,
    private clienteService: ClienteService,
    private storage: AngularFireStorage,
    private ModalController: ModalController,
    private usuarioService: UsuarioService
  ) {}

  listCred: Array<any> = [];
  listaCreditoPrincipal: Array<any> = [];

  async ngOnInit(): Promise<void> {
    const loading = await this.overlayService.loading();
    if (this.usuarioService.admin) {
      this.creditoService.initCredito();
      this.cadastrosDeCreditos$ = this.creditoService.getAll();
      this.cadastrosDeCreditos$.pipe(take(1)).subscribe(() => loading.dismiss());

      this.cadastrosDeCreditos$.forEach(Creds => {
        this.listaCreditoPrincipal = [];
        Creds.forEach(Cred => {
          if (Cred.clienteId != "") {
            this.clientes$ = this.clienteService.initClienteId(Cred.clienteId);
            this.clientes$.subscribe(async (r: Cliente[]) => {
              Cred['nomeCliente'] = r[0].nome;
            });
            this.listaCreditoPrincipal.push(Cred);                       
          }
        });
      });
      
    }
    else {
      this.cadastrosDeCreditos$ = this.creditoService.buscaCreditoClientes(this.usuarioService.id);
      this.cadastrosDeCreditos$.pipe(take(1)).subscribe(() => loading.dismiss());
    }
  }

  atualizar(credito: Credito): void {
    this.navCtrl.navigateForward(`/menu/ambiental/UpdateCadastroCreditoFinanceiro/${credito.id}`);
  }

  async deletar(credito: Credito): Promise<void> {
    await this.overlayService.alert({
      message: `Você realmente deseja deletar o crédito de valor R$ "${credito.valorCredito}"?`,
      buttons: [
        {
          text: 'Sim',
          handler: async () => {
            const ref = this.storage.ref(`/credito${credito.id}/`);
            ref.child(`${credito.nomeArquivo}`).delete();
            await this.creditoService.init();
            await this.creditoService.delete(credito);
            await this.creditoService.initCredito();
            await this.creditoService.delete(credito);
            await this.overlayService.toast({
              message: `Crédito de R$"${credito.valorCredito}" excluido!`
            });
          }
        },
        'Não'
      ]
    });
  }

  async openModal() {
    const modal = await this.ModalController.create({
      component: RelatorioCreditoPage
    })
    modal.present();
  }  

}
