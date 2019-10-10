import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Usuario } from '../../../autentificacao/pages/login/model/usuario.model';

@Component({
  selector: 'app-lista-usuario-item',
  templateUrl: './lista-usuario-item.component.html',
  styleUrls: ['./lista-usuario-item.component.scss'],
})
export class ListaUsuarioItemComponent implements OnInit {
  clicado: boolean = false;
  @Input() usuario: Usuario;
  @Output() update = new EventEmitter<Usuario>();
  @Output() delete = new EventEmitter<Usuario>();

  ngOnInit(){
    this.clicado = false;
  }

  abrir(){
    this.clicado = true;
  }

  fechar(){
    this.clicado = false;
  }

}
