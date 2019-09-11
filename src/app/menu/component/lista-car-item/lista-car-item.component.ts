import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { CadastroAmbientalRural } from '../../models/car.model';


@Component({
  selector: 'app-lista-car-item',
  templateUrl: './lista-car-item.component.html',
  styleUrls: ['./lista-car-item.component.scss'],
})
export class ListaCarItemComponent implements OnInit {
  clicado: boolean = false;
  @Input() cadastroAmbientalRural: CadastroAmbientalRural;
  @Output() update = new EventEmitter<CadastroAmbientalRural>();
  @Output() delete = new EventEmitter<CadastroAmbientalRural>();

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
