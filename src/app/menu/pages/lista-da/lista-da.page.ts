import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { take } from 'rxjs/operators';
import { NavController } from '@ionic/angular';
import { OverlayService } from 'src/app/core/services/overlay.service';
import { DeclaracaoAmbiental } from '../../models/da.model';
import { DaService } from 'src/app/core/services/da.service';
import { UsuarioService } from 'src/app/core/services/usuario.service';


@Component({
  selector: 'app-lista-da',
  templateUrl: './lista-da.page.html',
  styleUrls: ['./lista-da.page.scss'],
})
export class ListaDAPage implements OnInit {

  das$: Observable<DeclaracaoAmbiental[]>;
  constructor(
    private navCtrl: NavController,
    private daService: DaService,
    private overlayService: OverlayService,
    private usuarioService: UsuarioService
  ) {}

  async ngOnInit(): Promise<void> {
    const loading = await this.overlayService.loading();
    if (this.usuarioService.admin) {
      this.daService.initDA();
      this.das$ = this.daService.getAll();
      this.das$.pipe(take(1)).subscribe(() => loading.dismiss());
    }
    else {
      this.daService.init();
      this.das$ = this.daService.getAll();
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
            await this.overlayService.toast({
              message: `Declaracao Ambiental "${da.descricao}" excluida!`
            });
          }
        },
        'Não'
      ]
    });
  }

}
