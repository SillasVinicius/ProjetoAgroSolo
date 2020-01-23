import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Firestore } from '../classes/firestore';
import { parametrizacoes } from 'src/app/menu/models/parametrizacao.model';

@Injectable({
  providedIn: 'root'
})
export class ParametrizacaoService extends Firestore<parametrizacoes>{

  constructor(db: AngularFirestore) {
    super(db);
  }

  buscaParametro(): void{
    this.setCollection('/parametrizacoes');
  }
}
