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
    this.setCollection(`/users/${this.usuarioService.id}/cliente`);
  }
  
  initLA(): void {
    this.setCollection('/LicencaAmbiental');
  }

  initCliente(): void {
    this.setCollection(`/cliente`);
  }

  initClienteId(idCliente: string) {
    this.setCollection('/cliente', ref =>
      ref.where('id', '==', idCliente)
    );

    return this.getAll();
  }

  setCollectionFoto(cliente: string) {
    this.setCollection(`/users/${this.usuarioId}/cliente/${cliente}/imagens`);
  }

  setCollectionArquivo(cliente: string) {
    this.setCollection(`/users/${this.usuarioId}/cliente/${cliente}/arquivos`);
  }

  criarId(): string {
    return this.db.createId();
  }
}
