import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-home-ambiental',
  templateUrl: './home-ambiental.page.html',
  styleUrls: ['./home-ambiental.page.scss'],
})
export class HomeAmbientalPage implements OnInit {
  constructor(private navCtrl: NavController) {}
  linkDA() {
    this.navCtrl.navigateForward('/menu/ambiental/DeclaracaoAmbiental');
  }
  linkLA() {
    this.navCtrl.navigateForward('/menu/ambiental/LicencaAmbiental');
  }
  linkCAR() {
    this.navCtrl.navigateForward('/menu/ambiental/CadastroAmbientalRural');
  }
  linkOutorga() {
    this.navCtrl.navigateForward('/menu/outorga');
  }
  ngOnInit() {
  }

}
