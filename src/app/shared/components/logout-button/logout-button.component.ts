import { Component, OnInit, Input } from '@angular/core';
import { UsuarioService } from 'src/app/core/services/usuario.service';
import { NavController, MenuController } from '@ionic/angular';
import { OverlayService } from 'src/app/core/services/overlay.service';
import { Button } from 'protractor';

@Component({
  selector: 'app-logout-button',
  template: `
    <ion-buttons>
      <ion-button (click)="logout()">
        <ion-icon name="exit" slot="icon-only"></ion-icon>
      </ion-button>
    </ion-buttons>
  `
})
export class LogoutButtonComponent implements OnInit {
  @Input() menu: string;
  constructor(
    private userService: UsuarioService,
    private navCtrl: NavController,
    private overlayService: OverlayService,
    private menuCtrl: MenuController
  ) {}

  async ngOnInit(): Promise<void> {
    if (!(await this.menuCtrl.isEnabled(this.menu))) {
      this.menuCtrl.enable(true, this.menu);
    }
  }

  async logout(): Promise<void> {
    await this.overlayService.alert({
      message: 'Você deseja realmente sair?',
      buttons: [
        {
          text: 'Sim',
          handler: async () => {
            this.userService.logado = false;
            await this.menuCtrl.enable(false, this.menu);
            this.navCtrl.navigateRoot('/login');
          }
        },
        'Não'
      ]
    });
  }
}
