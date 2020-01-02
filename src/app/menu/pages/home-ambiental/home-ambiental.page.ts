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
    this.navCtrl.navigateForward('/menu/DeclaracaoAmbiental');
  }
  linkLA() {
    this.navCtrl.navigateForward('/menu/LicencaAmbiental');
  }
  linkCAR() {
    this.navCtrl.navigateForward('/menu/CadastroAmbientalRural');
  }
  linkOutorga() {
    this.navCtrl.navigateForward('/menu/outorga');
  }  
  linKCredito() {
    this.navCtrl.navigateForward('/menu/credito');
  }
  ngOnInit() {
  }

}
