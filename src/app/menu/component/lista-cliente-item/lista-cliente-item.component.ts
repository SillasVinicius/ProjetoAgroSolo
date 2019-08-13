import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Cliente } from '../../models/cliente.model';

@Component({
  selector: 'app-lista-cliente-item',
  templateUrl: './lista-cliente-item.component.html',
  styleUrls: ['./lista-cliente-item.component.scss']
})
export class ListaClienteItemComponent {
  @Input() cliente: Cliente;
  @Output() update = new EventEmitter<Cliente>();
  @Output() delete = new EventEmitter<Cliente>();
}
