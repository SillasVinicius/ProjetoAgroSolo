import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { CadastroAmbientalRural } from '../../models/car.model';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';
import { UsuarioService } from 'src/app/core/services/usuario.service';

@Component({
  selector: 'app-lista-car-item',
  templateUrl: './lista-car-item.component.html',
  styleUrls: ['./lista-car-item.component.scss'],
})
export class ListaCarItemComponent implements OnInit {
  constructor(private iab: InAppBrowser, private usuarioService: UsuarioService){}
  clicado: boolean = false;
  admin: boolean = false;
  @Input() cadastroAmbientalRural: CadastroAmbientalRural;
  @Output() update = new EventEmitter<CadastroAmbientalRural>();
  @Output() delete = new EventEmitter<CadastroAmbientalRural>();
  @Output() view = new EventEmitter<CadastroAmbientalRural>();

  openLink(){
    this.iab.create(`${this.cadastroAmbientalRural.arquivo}`, `_system`);
  }

  ngOnInit(){
    this.clicado = false;
    if (this.usuarioService.admin) {
      this.admin = true;
    }
    else {
      this.admin = false;
    }
  }

  abrir(){
    this.clicado = true;
  }

  fechar(){
    this.clicado = false;
  }
}
