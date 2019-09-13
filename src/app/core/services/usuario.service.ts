import { Injectable } from '@angular/core';
import { Firestore } from '../classes/firestore';
import { Usuario } from 'src/app/autentificacao/pages/login/model/usuario.model';
import { AngularFirestore } from '@angular/fire/firestore';
import { equal } from 'assert';
import { Observable } from 'rxjs';
import { map, tap, mapTo } from 'rxjs/operators';

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
    // this.setCollection('/menu', ref => ref.orderBy('nome', 'asc').orderBy('id', 'asc'));
  }
}
