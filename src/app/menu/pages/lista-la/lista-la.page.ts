import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { take } from 'rxjs/operators';
import { NavController, ModalController } from '@ionic/angular';
import { OverlayService } from 'src/app/core/services/overlay.service';
import { LicencaAmbiental } from '../../models/la.model';
import { LaService } from 'src/app/core/services/la.service';
import { UsuarioService } from 'src/app/core/services/usuario.service';
import { Cliente } from '../../models/cliente.model';
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
pdfMake.vfs = pdfFonts.pdfMake.vfs;
import { RelatorioLaPage } from "../relatorio-la/relatorio-la.page";
import { ClienteService } from 'src/app/core/services/cliente.service';
import {AngularFireStorage }from '@angular/fire/storage';

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
    private clienteService: ClienteService,
    private storage: AngularFireStorage
  ) {}


  listaLa: Array<any> = [];
  listaLaCliente: Array<any> = [];  
  async ngOnInit(): Promise<void> {
    const loading = await this.overlayService.loading();
    if (this.usuarioService.admin) {
      this.licencaAmbientalService.init();
      this.licencasAmbientais$ = this.licencaAmbientalService.getAll();
      this.licencasAmbientais$.pipe(take(1)).subscribe(() => loading.dismiss());

      this.licencasAmbientais$.forEach(La => {
          this.listaLaCliente = [];
          La.forEach(la => {
            if(la.clienteId !== "" && la.clienteId !== undefined){
              this.clientes$ = this.clienteService.initClienteId(la.clienteId);
              this.clientes$.subscribe(async (r: Cliente[]) => {
                la['nomeCliente'] = (r.length > 0) ? r[0].nome : 'Cliente excluído';
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

  viewLa(licencaAmbiental: LicencaAmbiental): void {
    this.navCtrl.navigateForward(`/menu/ambiental/viewLa/${licencaAmbiental.id}/view`);
  }

  async deletar(licencaAmbiental: LicencaAmbiental): Promise<void> {
    await this.overlayService.alert({
      message: `Você realmente deseja deletar a licenca ambiental do Cliente: ${licencaAmbiental.nomeCliente} - ${licencaAmbiental.descricao}?`,
      buttons: [
        {
          text: 'Sim',
          handler: async () => {
            await this.deletarArquivoLicencaAmbiental(licencaAmbiental);
            await this.licencaAmbientalService.init();
            await this.licencaAmbientalService.delete(licencaAmbiental);
            await this.overlayService.toast({
              message: `licenca ambiental do Cliente ${licencaAmbiental.nomeCliente} - ${licencaAmbiental.descricao} excluida!`
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

  //deleta arquvios da licença ambiental
  deletarArquivoLicencaAmbiental(licencaAmbiental: LicencaAmbiental) {
    const ref = this.storage.ref(`/LicencaAmbiental${licencaAmbiental.id}`);
    ref.child(`${licencaAmbiental.nomeArquivo}`).delete();
  }

}