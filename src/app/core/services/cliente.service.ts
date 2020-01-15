import { Injectable } from '@angular/core';
import { Firestore } from '../classes/firestore';
import { Cliente } from '../../menu/models/cliente.model';
import { AngularFirestore } from '@angular/fire/firestore';
import { UsuarioService } from './usuario.service';

@Injectable({
  providedIn: 'root'
})
export class ClienteService extends Firestore<Cliente> {
  usuarioId: string;
  constructor(db: AngularFirestore, private usuarioService: UsuarioService) {
    super(db);
    this.init();
    this.usuarioId = this.usuarioService.id;
  }
  
  init(): void {
    this.setCollection(`/cliente`);
  }

  initClienteId(idCliente: any): any {
    if (idCliente !== "") {
      this.setCollection('/cliente', ref =>
        ref.where('id', '==', idCliente)
      );
      return this.getAll();
    }
  }

  setCollectionFoto(cliente: string) {
    this.setCollection(`/cliente${cliente}`);
  }
  
  criarId(): string {
    return this.db.createId();
  }
}
