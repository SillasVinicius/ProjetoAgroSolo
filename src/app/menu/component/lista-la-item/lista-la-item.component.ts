import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { LicencaAmbiental } from '../../models/la.model';

@Component({
  selector: 'app-lista-la-item',
  templateUrl: './lista-la-item.component.html',
  styleUrls: ['./lista-la-item.component.scss'],
})
export class ListaLaItemComponent implements OnInit {

  clicado: boolean = false;
  @Input() licencaAmbiental: LicencaAmbiental;
  @Output() update = new EventEmitter<LicencaAmbiental>();
  @Output() delete = new EventEmitter<LicencaAmbiental>();

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
