import { Injectable } from '@angular/core';
import { Firestore } from '../classes/firestore';
import { Usuario } from 'src/app/autentificacao/pages/login/model/usuario.model';
import { AngularFirestore } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService extends Firestore<Usuario> {
  constructor(db: AngularFirestore) {
    super(db);
    this.init();
  }

  init(): void {
    this.setCollection('/users');
  }

  initFiltro(): void {
    this.setCollection('/users', ref => ref.where('admin',"==",false));
  }
}
