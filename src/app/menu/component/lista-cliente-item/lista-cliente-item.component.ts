import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Cliente } from '../../models/cliente.model';
import { UsuarioService } from 'src/app/core/services/usuario.service';

@Component({
  selector: 'app-lista-cliente-item',
  templateUrl: './lista-cliente-item.component.html',
  styleUrls: ['./lista-cliente-item.component.scss']
})
export class ListaClienteItemComponent implements OnInit{
  constructor(private usuarioService: UsuarioService){}
  clicado: boolean = false;
  admin: boolean = false;
  @Input() cliente: Cliente;
  @Output() update = new EventEmitter<Cliente>();
  @Output() delete = new EventEmitter<Cliente>();

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
