import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { take } from 'rxjs/operators';
import { NavController, ModalController } from '@ionic/angular';
import { OverlayService } from 'src/app/core/services/overlay.service';
import { LicencaAmbiental } from '../../models/la.model';
import { LaService } from 'src/app/core/services/la.service';
import { UsuarioService } from 'src/app/core/services/usuario.service';
import { Cliente } from '../../models/cliente.model';
import { ClienteService } from 'src/app/core/services/cliente.service';
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
pdfMake.vfs = pdfFonts.pdfMake.vfs;
import { RelatorioLaPage } from "../relatorio-la/relatorio-la.page";

@Component({
  selector: 'app-lista-la',
  templateUrl: './lista-la.page.html',
  styleUrls: ['./lista-la.page.scss'],
})
export class ListaLAPage implements OnInit {

  licencasAmbientais$: Observable<LicencaAmbiental[]>;
  clientes$: Observable<Cliente[]>;
  pdfObject: any;

  constructor(
    private navCtrl: NavController,
    private licencaAmbientalService: LaService,
    private ModalController: ModalController,
    private overlayService: OverlayService,
    private usuarioService: UsuarioService,
    private clienteService: ClienteService
  ) {}


  listaLa: Array<any> = [];
  listaLaCliente: Array<any> = [];

  async ngOnInit(): Promise<void> {
    const loading = await this.overlayService.loading();
    if (this.usuarioService.admin) {
      this.licencaAmbientalService.initLA();
      this.licencasAmbientais$ = this.licencaAmbientalService.getAll();
      this.licencasAmbientais$.pipe(take(1)).subscribe(() => loading.dismiss());

      this.licencasAmbientais$.forEach(La => {
        this.listaLaCliente = [];
        La.forEach(la => {
          if(la.clienteId != ""){
          this.clientes$ = this.clienteService.initClienteId(la.clienteId);
          this.clientes$.subscribe(async (r: Cliente[]) => {
            la['nomeCliente'] = r[0].nome;
          });
          this.listaLaCliente.push(la);
        }
        });
      });

      
    }
    else {
      this.licencasAmbientais$ = this.licencaAmbientalService.buscaLaClientes(this.usuarioService.id);
      this.licencasAmbientais$.pipe(take(1)).subscribe(() => loading.dismiss());
    }

  }

  atualizar(licencaAmbiental: LicencaAmbiental): void {
    this.navCtrl.navigateForward(`/menu/ambiental/UpdateLicencaAmbiental/${licencaAmbiental.id}`);
  }

  visualizar(licencaAmbiental: LicencaAmbiental): void {
    console.log("testseat");
    this.navCtrl.navigateForward(`/menu/ambiental/VisualizarLA/${licencaAmbiental.id}`);
  }

  async deletar(licencaAmbiental: LicencaAmbiental): Promise<void> {
    await this.overlayService.alert({
      message: `Você realmente deseja deletar a licenca ambiental "${licencaAmbiental.descricao}"?`,
      buttons: [
        {
          text: 'Sim',
          handler: async () => {
            await this.licencaAmbientalService.init();
            await this.licencaAmbientalService.delete(licencaAmbiental);
            await this.licencaAmbientalService.initLA();
            await this.licencaAmbientalService.delete(licencaAmbiental);
            await this.overlayService.toast({
              message: `licenca ambiental "${licencaAmbiental.descricao}" excluida!`
            });
          }
        },
        'Não'
      ]
    });
  }

  async openModal() {
    const modal = await this.ModalController.create({
      component: RelatorioLaPage
    })
    modal.present();
  } 


}
