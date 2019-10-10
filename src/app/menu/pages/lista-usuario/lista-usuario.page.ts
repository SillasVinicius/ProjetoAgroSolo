import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Usuario } from '../../../autentificacao/pages/login/model/usuario.model';
import { take } from 'rxjs/operators';
import { NavController } from '@ionic/angular';
import { UsuarioService } from 'src/app/core/services/usuario.service';
import { OverlayService } from 'src/app/core/services/overlay.service';

@Component({
  selector: 'app-lista-usuario',
  templateUrl: './lista-usuario.page.html',
  styleUrls: ['./lista-usuario.page.scss'],
})
export class ListaUsuarioPage implements OnInit {
  usuarios$: Observable<Usuario[]>;
  constructor(
    private navCtrl: NavController,
    private usuarioService: UsuarioService,
    private overlayService: OverlayService
  ) {}

  async ngOnInit(): Promise<void> {
    const loading = await this.overlayService.loading();
    this.usuarioService.initFiltro();
    this.usuarios$ = this.usuarioService.getAll();
    this.usuarios$.pipe(take(1)).subscribe(() => loading.dismiss());
  }

  atualizar(usuario: Usuario): void {
    this.navCtrl.navigateForward(`/menu/atualizarCliente/${usuario.id}`);
  }

  async deletar(usuario: Usuario): Promise<void> {
    await this.overlayService.alert({
      message: `Você realmente deseja deletar o usuário "${usuario.nome}"?`,
      buttons: [
        {
          text: 'Sim',
          handler: async () => {
            await this.usuarioService.init();
            await this.usuarioService.delete(usuario);
            await this.overlayService.toast({
              message: `Usuário "${usuario.nome}" excluido!`
            });
          }
        },
        'Não'
      ]
    });
  }

}
