import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { take } from 'rxjs/operators';
import { NavController, ModalController } from '@ionic/angular';
import { OverlayService } from 'src/app/core/services/overlay.service';
import { DeclaracaoAmbiental } from '../../models/da.model';
import { DaService } from 'src/app/core/services/da.service';
import { UsuarioService } from 'src/app/core/services/usuario.service';
import { Cliente } from '../../models/cliente.model';
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
pdfMake.vfs = pdfFonts.pdfMake.vfs;
import { RelatorioDaPage } from "../relatorio-da/relatorio-da.page";


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
    private usuarioService: UsuarioService
  ) {}

  listaDa: Array<any> = [];
  listaDaCliente: Array<any> = [];
  async ngOnInit(): Promise<void> {
    const loading = await this.overlayService.loading();
    if (this.usuarioService.admin) {
      this.daService.initDA();
      this.das$ = this.daService.getAll();
      this.das$.pipe(take(1)).subscribe(() => loading.dismiss());

      this.das$.forEach(Das => {
        this.listaDaCliente = [];
        Das.forEach(Da => {
          if(Da.clienteId != "") {
            this.clientes$ = this.clienteService.initClienteId(Da.clienteId);
            this.clientes$.subscribe(async (r: Cliente[]) => {
            Da['nomeCliente'] = r[0].nome;
          });
          this.listaDaCliente.push(Da);
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

  async deletar(da: DeclaracaoAmbiental): Promise<void> {
    await this.overlayService.alert({
      message: `Você realmente deseja deletar a Declaracao Ambiental "${da.descricao}"?`,
      buttons: [
        {
          text: 'Sim',
          handler: async () => {
            await this.daService.init();
            await this.daService.delete(da);
            await this.daService.initDA();
            await this.daService.delete(da);
            await this.overlayService.toast({
              message: `Declaracao Ambiental "${da.descricao}" excluida!`
            });
          }
        },
        'Não'
      ]
    });
  }

  async openModal() {
    const modal = await this.ModalController.create({
      component: RelatorioDaPage
    })
    modal.present();
  } 

}
