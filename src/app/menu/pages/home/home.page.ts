import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { UsuarioService } from 'src/app/core/services/usuario.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss']
})
export class HomePage implements OnInit {
  nomeUser = '...';
  constructor(private usuario: UsuarioService, private navCtrl: NavController) {}
  linkCliente() {
    this.navCtrl.navigateForward('/menu/cliente');
  }
  linkOutorga() {
    this.navCtrl.navigateForward('/menu/outorga');
  }
  linkAmbiental() {
    this.navCtrl.navigateForward('/menu/ambiental');
  }
  ngOnInit() {
    this.nomeUser = this.usuario.nomeUser;
  }
}
