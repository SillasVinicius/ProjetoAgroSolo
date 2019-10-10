import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { take } from 'rxjs/operators';
import { NavController } from '@ionic/angular';
import { OverlayService } from 'src/app/core/services/overlay.service';
import { LicencaAmbiental } from '../../models/la.model';
import { LaService } from 'src/app/core/services/la.service';
import { UsuarioService } from 'src/app/core/services/usuario.service';

@Component({
  selector: 'app-lista-la',
  templateUrl: './lista-la.page.html',
  styleUrls: ['./lista-la.page.scss'],
})
export class ListaLAPage implements OnInit {

  licencasAmbientais$: Observable<LicencaAmbiental[]>;
  constructor(
    private navCtrl: NavController,
    private licencaAmbientalService: LaService,
    private overlayService: OverlayService,
    private usuarioService: UsuarioService
  ) {}

  async ngOnInit(): Promise<void> {
    const loading = await this.overlayService.loading();
    if (this.usuarioService.admin) {
      this.licencaAmbientalService.initLA();
      this.licencasAmbientais$ = this.licencaAmbientalService.getAll();
      this.licencasAmbientais$.pipe(take(1)).subscribe(() => loading.dismiss());
    }
    else {
      this.licencaAmbientalService.init();
      this.licencasAmbientais$ = this.licencaAmbientalService.getAll();
      this.licencasAmbientais$.pipe(take(1)).subscribe(() => loading.dismiss());
    }

  }

  atualizar(licencaAmbiental: LicencaAmbiental): void {
    this.navCtrl.navigateForward(`/menu/ambiental/UpdateLicencaAmbiental/${licencaAmbiental.id}`);
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
            await this.overlayService.toast({
              message: `licenca ambiental "${licencaAmbiental.descricao}" excluida!`
            });
          }
        },
        'Não'
      ]
    });
  }

}
