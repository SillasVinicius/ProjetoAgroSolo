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
  urlFoto = '...';
  admin = false;
  constructor(
    private usuario: UsuarioService,
    private navCtrl: NavController
  ) {}
  linkCliente() {
    this.navCtrl.navigateForward('/menu/cliente');
  }
  linkDadosPessoais() {
    this.navCtrl.navigateForward('/menu/dadosPessoais');
  }
  linkAmbiental() {
    this.navCtrl.navigateForward('/menu/ambiental');
  }
  linkUsuarios() {
    this.navCtrl.navigateForward('/menu/usuario');
  }
  linkAlterarUsuario() {
    this.navCtrl.navigateForward(`/menu/updateUsuario/${this.usuario.id}`);
  }
  linkOutorgas(){
    this.navCtrl.navigateForward('/menu/outorga')
  }
  linkAmbientais(){
    this.navCtrl.navigateForward("/menu/LicencaAmbiental")
  }
  linkDeclaracoes(){
    this.navCtrl.navigateForward("/menu/DeclaracaoAmbiental")
  }
  ngOnInit() {
    this.nomeUser = this.usuario.nomeUser;
    this.urlFoto = this.usuario.urlFoto;
    this.admin = this.usuario.admin;
  }
}
