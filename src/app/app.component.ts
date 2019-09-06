import { Component, Input } from '@angular/core';

import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { UsuarioService } from './core/services/usuario.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html'
})
export class AppComponent {
  pages: { url: string; direction: string; icon: string; text: string, color: string }[];
  @Input() nome: string;
  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private usuarioService: UsuarioService
  ) {
    this.initializeApp();
  }

  initializeApp() {
    this.pages = [
      { url: '/menu', icon: 'home', text: 'Home', direction: 'back', color: 'primary' },
      { url: '/menu/cliente', icon: 'create', text: 'Cliente', direction: 'forward', color: 'second-primary' },
      { url: '/menu/outorga', icon: 'albums', text: 'Outorga', direction: 'forward', color: 'success'},
      { url: '#', icon: 'flower', text: 'Ambiental', direction: 'forward', color: 'tertiary-primary'},
    ];

    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
  }
}
