import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { take } from 'rxjs/operators';
import { NavController, ModalController } from '@ionic/angular';
import { OverlayService } from 'src/app/core/services/overlay.service';
import { CadastroAmbientalRural } from '../../models/car.model';
import { CarService } from 'src/app/core/services/car.service';
import { UsuarioService } from 'src/app/core/services/usuario.service';
import { ClienteService } from 'src/app/core/services/cliente.service';
import { Cliente } from '../../models/cliente.model';
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
pdfMake.vfs = pdfFonts.pdfMake.vfs;
import { RelatorioCarPage } from "../relatorio-car/relatorio-car.page";

@Component({
  selector: 'app-lista-car',
  templateUrl: './lista-car.page.html',
  styleUrls: ['./lista-car.page.scss'],
})
export class ListaCARPage implements OnInit {

  cadastrosAmbientaisRurais$: Observable<CadastroAmbientalRural[]>;
  clientes$: Observable<Cliente[]>;
  pdfObject: any;

  constructor(
    private navCtrl: NavController,
    private cadastroAmbientalRuralService: CarService,
    private usuarioService: UsuarioService,
    private clienteService: ClienteService,
    private ModalController: ModalController,
    private overlayService: OverlayService
  ) {}

  listaCar: Array<any> = [];

  async ngOnInit(): Promise<void> {
    const loading = await this.overlayService.loading();
    if (this.usuarioService.admin) {
      this.cadastroAmbientalRuralService.initCAR();
      this.cadastrosAmbientaisRurais$ = this.cadastroAmbientalRuralService.getAll();
      this.cadastrosAmbientaisRurais$.pipe(take(1)).subscribe(() => loading.dismiss());
    }
    else {
      this.cadastroAmbientalRuralService.init();
      this.cadastrosAmbientaisRurais$ = this.cadastroAmbientalRuralService.getAll();
      this.cadastrosAmbientaisRurais$.pipe(take(1)).subscribe(() => loading.dismiss());
    }
  }

  atualizar(cadastroAmbientalRural: CadastroAmbientalRural): void {
    this.navCtrl.navigateForward(`menu/ambiental/UpdateCadastroAmbientalRural/${cadastroAmbientalRural.id}`);
  }

  async deletar(cadastroAmbientalRural: CadastroAmbientalRural): Promise<void> {
    await this.overlayService.alert({
      message: `Você realmente deseja deletar o cadastro Ambiental Rural "${cadastroAmbientalRural.descricao}"?`,
      buttons: [
        {
          text: 'Sim',
          handler: async () => {
            await this.cadastroAmbientalRuralService.init();
            await this.cadastroAmbientalRuralService.delete(cadastroAmbientalRural);
            await this.cadastroAmbientalRuralService.initCAR();
            await this.cadastroAmbientalRuralService.delete(cadastroAmbientalRural);
            await this.overlayService.toast({
              message: `cadastro Ambiental Rural "${cadastroAmbientalRural.descricao}" excluido!`
            });
          }
        },
        'Não'
      ]
    });
  }

  async openModal() {
    const modal = await this.ModalController.create({
      component: RelatorioCarPage
    })
    modal.present();
  } 
}

