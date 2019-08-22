import { Injectable } from '@angular/core';
import { Firestore } from '../classes/firestore';
import { Cliente } from '../../menu/models/cliente.model';
import { AngularFirestore } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class ClienteService extends Firestore<Cliente> {
  constructor(db: AngularFirestore) {
    super(db);
    this.init();
  }

  private init(): void {
    this.setCollection('/menu');
  }
}
