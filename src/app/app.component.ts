import { Component, Input } from '@angular/core';

import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html'
})
export class AppComponent {
  pages: {}[];
  @Input() nome: string;
  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar  ) {
    this.initializeApp();
  }

  initializeApp() {
    // this.pages = [
    //   { url: '/menu', icon: 'home', text: 'Home', direction: 'back', color: 'primary' },
    //   { url: '/menu/cliente', icon: 'create', text: 'Cliente', direction: 'forward', color: 'second-primary' },
    //   { url: '/menu/outorga', icon: 'albums', text: 'Outorga', direction: 'forward', color: 'success'},
    //   { url: '/menu/ambiental', icon: 'flower', text: 'Ambiental', direction: 'forward', color: 'tertiary-primary'},
    // ];


    this.pages = [
    { url: '/menu', icon: 'home', title: 'Home', direction: 'back'},
    { url: '/menu/cliente', icon: 'create', title: 'Cliente', direction: 'forward'},
    { url: '/menu/outorga', icon: 'albums', title: 'Outorga', direction: 'forward'},
    {
      title: 'Ambiental',
      children: [
        {
          title: 'Declaração Ambiental',
          url: '/menu/ambiental/DeclaracaoAmbiental',
          icon: 'folder'
        },
        {
          title: 'Licença Ambiental',
          url: '/menu/ambiental/LicencaAmbiental',
          icon: 'albums'
        },
        {
          title: 'Cadastro Ambiental Rural',
          url: '/menu/ambiental/CadastroAmbientalRural',
          icon: 'paper'
        }
      ]
    }
  ];

    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
  }
}
