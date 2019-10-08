import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { take } from 'rxjs/operators';
import { NavController } from '@ionic/angular';
import { OverlayService } from 'src/app/core/services/overlay.service';
import { CadastroAmbientalRural } from '../../models/car.model';
import { CarService } from 'src/app/core/services/car.service';


@Component({
  selector: 'app-lista-car',
  templateUrl: './lista-car.page.html',
  styleUrls: ['./lista-car.page.scss'],
})
export class ListaCARPage implements OnInit {

  cadastrosAmbientaisRurais$: Observable<CadastroAmbientalRural[]>;
  constructor(
    private navCtrl: NavController,
    private cadastroAmbientalRuralService: CarService,
    private overlayService: OverlayService
  ) {}

  async ngOnInit(): Promise<void> {
    const loading = await this.overlayService.loading();
    this.cadastroAmbientalRuralService.init();
    this.cadastrosAmbientaisRurais$ = this.cadastroAmbientalRuralService.getAll();
    this.cadastrosAmbientaisRurais$.pipe(take(1)).subscribe(() => loading.dismiss());
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
            await this.overlayService.toast({
              message: `cadastro Ambiental Rural "${cadastroAmbientalRural.descricao}" excluido!`
            });
          }
        },
        'Não'
      ]
    });
  }

}
