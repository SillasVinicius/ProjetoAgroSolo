import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Outorga } from '../../models/outorga.model';

@Component({
  selector: 'app-lista-outorga-item',
  templateUrl: './lista-outorga-item.component.html',
  styleUrls: ['./lista-outorga-item.component.scss'],
})
export class ListaOutorgaItemComponent implements OnInit{
  clicado: boolean = false;
  @Input() outorga: Outorga;
  @Output() update = new EventEmitter<Outorga>();
  @Output() delete = new EventEmitter<Outorga>();

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
