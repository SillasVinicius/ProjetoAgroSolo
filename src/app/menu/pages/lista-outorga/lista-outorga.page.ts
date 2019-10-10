import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { take } from 'rxjs/operators';
import { NavController } from '@ionic/angular';
import { OverlayService } from 'src/app/core/services/overlay.service';
import { Outorga } from '../../models/outorga.model';
import { OutorgaService } from 'src/app/core/services/outorga.service';
import { UsuarioService } from 'src/app/core/services/usuario.service';

@Component({
  selector: 'app-lista-outorga',
  templateUrl: './lista-outorga.page.html',
  styleUrls: ['./lista-outorga.page.scss'],
})
export class ListaOutorgaPage implements OnInit {

  outorgas$: Observable<Outorga[]>;
  constructor(
    private navCtrl: NavController,
    private outorgaService: OutorgaService,
    private overlayService: OverlayService,
    private usuarioService: UsuarioService
  ) {}

  async ngOnInit(): Promise<void> {
    const loading = await this.overlayService.loading();
    if (this.usuarioService.admin) {
      this.outorgaService.initOutorga();
      this.outorgas$ = this.outorgaService.getAll();
      this.outorgas$.pipe(take(1)).subscribe(() => loading.dismiss());
    }
    else {
      this.outorgaService.init();
      this.outorgas$ = this.outorgaService.getAll();
      this.outorgas$.pipe(take(1)).subscribe(() => loading.dismiss());
    }
  }

  atualizar(outorga: Outorga): void {
    this.navCtrl.navigateForward(`/menu/updateOutorga/${outorga.id}`);
  }

  async deletar(outorga: Outorga): Promise<void> {
    await this.overlayService.alert({
      message: `Você realmente deseja deletar a outorga "${outorga.descricao}"?`,
      buttons: [
        {
          text: 'Sim',
          handler: async () => {
            await this.outorgaService.init();
            await this.outorgaService.delete(outorga);
            await this.overlayService.toast({
              message: `Outorga "${outorga.descricao}" excluido!`
            });
          }
        },
        'Não'
      ]
    });
  }

}
