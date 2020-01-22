import { Component, Input } from '@angular/core';
import { UsuarioService } from 'src/app/core/services/usuario.service';
import { OverlayService } from 'src/app/core/services/overlay.service';

import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { Network } from '@ionic-native/network/ngx';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html'
})
export class AppComponent {
  pages: { url: string; direction: string; icon: string; text: string }[];
  pagesCliente: {url: string; direction: string; icon: string; text: string }[];
  @Input() nome: string;
  nomeUser = '...';
  urlFoto = '...';
  admin = false;
  constructor(
    private usuario: UsuarioService,
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private network: Network,
    private overlayService: OverlayService,
    ) {
    this.initializeApp();
  }

  initializeApp() {

    let disconnectSubscription = this.network.onDisconnect().subscribe(async () => {
      const loading = await this.overlayService.loading({
        message: "Verifique sua conexão com a rede!"
      });
        let connectSubscription = this.network.onConnect().subscribe(async () => {
        loading.dismiss();
      });
    });

    this.nomeUser = this.usuario.nomeUser;
    this.urlFoto = this.usuario.urlFoto;
    this.admin = this.usuario.admin;
    this.pages = [
      { url: '/menu', icon: 'home', text: 'Home', direction: 'back' },
      { url: '/menu/cliente', icon: 'person-add', text: 'Cliente', direction: 'forward' },
      { url: '/menu/usuario', icon: 'ios-person-add', text: 'Administrador', direction: 'forward' },
      //{ url: '/menu/dadosPessoais', icon: 'folder', text: 'Dados Pessoais', direction: 'forward' },
      { url: '/menu/ambiental', icon: 'flower', text: 'Ambiental', direction: 'forward' }

    ],
    this.pagesCliente = [
      { url: '/menu', icon: 'home', text: 'Home', direction: 'back' },
      { url: '/menu/cliente', icon: 'person-add', text: 'Meu Cadastro', direction: 'forward' },
      { url: '/menu/ambiental', icon: 'flower', text: 'Ambiental', direction: 'forward' }
    ];

    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
  }
}