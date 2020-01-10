import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { take } from 'rxjs/operators';
import { NavController, ModalController } from '@ionic/angular';
import { OverlayService } from 'src/app/core/services/overlay.service';
import { Outorga } from '../../models/outorga.model';
import { OutorgaService } from 'src/app/core/services/outorga.service';
import { UsuarioService } from 'src/app/core/services/usuario.service';
import { Cliente } from '../../models/cliente.model';
import { ClienteService } from 'src/app/core/services/cliente.service';
import { RelatorioOutorgaPage } from "../relatorio-outorga/relatorio-outorga.page";
import { AngularFireStorage } from '@angular/fire/storage';

@Component({
  selector: 'app-lista-outorga',
  templateUrl: './lista-outorga.page.html',
  styleUrls: ['./lista-outorga.page.scss'],
})
export class ListaOutorgaPage implements OnInit {

  Outorga = [];

  outorgas$: Observable<Outorga[]>;
  clientes$: Observable<Cliente[]>;
  pdfObject: any;

  constructor(
    private navCtrl: NavController,
    private ModalController: ModalController,
    private outorgaService: OutorgaService,
    private overlayService: OverlayService,
    private usuarioService: UsuarioService,
    private clienteService: ClienteService,
    private storage: AngularFireStorage
  ) {}

  listaOutorga: Array<any> = [];
  listaClientesOutorgas: Array<any> = [];

  async ngOnInit(): Promise<void> {
    const loading = await this.overlayService.loading();
    if (this.usuarioService.admin) {
      this.outorgaService.init();
      this.outorgas$ = this.outorgaService.getAll();
      this.outorgas$.pipe(take(1)).subscribe(() => loading.dismiss());
      
      this.outorgas$.forEach(Outs => {
        this.listaClientesOutorgas = [];
        Outs.forEach(Out => {
          if(Out.clienteId !== "" && Out.clienteId !== undefined){
            this.clientes$ = this.clienteService.initClienteId(Out.clienteId);
            this.clientes$.subscribe(async (r: Cliente[]) => {
              Out['nomeCliente'] = (r.length > 0) ? r[0].nome : 'Cliente excluído';
            });
            this.listaClientesOutorgas.push(Out);
          }            
        });
      });      
    }
    else {
      this.outorgas$ = this.outorgaService.buscaOutorgasClientes(this.usuarioService.id);
      this.outorgas$.pipe(take(1)).subscribe(() => loading.dismiss());
    }
  }

  atualizar(outorga: Outorga): void {
    this.navCtrl.navigateForward(`/menu/updateOutorga/${outorga.id}`);
  }


  async deletar(outorga: Outorga): Promise<void> {
    await this.overlayService.alert({
      message: `Você realmente deseja deletar a outorga do Cliente: ${outorga.nomeCliente} - ${outorga.descricao}?`,
      buttons: [
        {
          text: 'Sim',
          handler: async () => {
            this.deletarArquivoOutorga(outorga);
            await this.outorgaService.init();
            await this.outorgaService.delete(outorga);
            await this.overlayService.toast({
              message: `Outorga do Cliente: ${outorga.nomeCliente} - ${outorga.descricao} excluido!`
            });
          }
        },
        'Não'
      ]
    });
  }

  deletarArquivoOutorga(outorga: Outorga) {
    const ref = this.storage.ref(`/outorga${outorga.id}`);
    ref.child(`${outorga.nomeArquivo}`).delete();
  }

  async openModal() {
    const modal = await this.ModalController.create({
      component: RelatorioOutorgaPage
    })
    modal.present();
  } 

}
