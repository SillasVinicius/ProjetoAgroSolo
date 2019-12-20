import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { UsuarioService } from 'src/app/core/services/usuario.service';
import { ClienteService } from 'src/app/core/services/cliente.service';
import { Cliente } from '../../models/cliente.model';
import { Observable } from 'rxjs';
import { take } from 'rxjs/operators';
import { OverlayService } from 'src/app/core/services/overlay.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss']
})
export class HomePage implements OnInit {
  clientes$: Observable<Cliente[]>;
  nomeUser = '...';
  urlFoto = '...';
  admin = false;
  constructor(
    private usuario: UsuarioService,
    private navCtrl: NavController,
    private overlayService: OverlayService,
    private clienteService: ClienteService
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
  async ngOnInit() {
    this.nomeUser = this.usuario.nomeUser;
    this.urlFoto = this.usuario.urlFoto;
    this.admin = this.usuario.admin;

    const loading = await this.overlayService.loading();
    this.clienteService.initCliente();
    this.clientes$ = this.clienteService.getAll();
    this.clientes$.pipe(take(1)).subscribe(() => loading.dismiss());


  }


}
