import { Component, OnInit } from '@angular/core';
import { ClienteService } from 'src/app/core/services/cliente.service';
import { NavController } from '@ionic/angular';
import { Usuario } from 'src/app/autentificacao/pages/login/model/usuario.model';
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
