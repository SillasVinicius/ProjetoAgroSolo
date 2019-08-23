import { Injectable } from '@angular/core';
import { Firestore } from '../classes/firestore';
import { Cliente } from '../../menu/models/cliente.model';
import { AngularFirestore } from '@angular/fire/firestore';
import { UsuarioService } from './usuario.service';

@Injectable({
  providedIn: 'root'
})
export class ClienteService extends Firestore<Cliente> {
  constructor(db: AngularFirestore, private usuarioService: UsuarioService) {
    super(db);
    this.init();
  }

  private init(): void {
    this.setCollection(`/users/${this.usuarioService.id}/cliente`);
    // this.setCollection('/menu', ref => ref.orderBy('nome', 'asc').orderBy('id', 'asc'));
  }
}
