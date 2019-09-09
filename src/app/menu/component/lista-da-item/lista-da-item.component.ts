import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { DeclaracaoAmbiental } from '../../models/da.model';

@Component({
  selector: 'app-lista-da-item',
  templateUrl: './lista-da-item.component.html',
  styleUrls: ['./lista-da-item.component.scss'],
})
export class ListaDaItemComponent implements OnInit {
  clicado: boolean = false;
  @Input() declaracaoAmbiental: DeclaracaoAmbiental;
  @Output() update = new EventEmitter<DeclaracaoAmbiental>();
  @Output() delete = new EventEmitter<DeclaracaoAmbiental>();

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
