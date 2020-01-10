import { Injectable } from '@angular/core';
import { Firestore } from '../classes/firestore';
import { AngularFirestore } from '@angular/fire/firestore';
import { UsuarioService } from './usuario.service';
import { Outorga } from 'src/app/menu/models/outorga.model';

@Injectable({
  providedIn: 'root'
})
export class OutorgaService extends Firestore<Outorga> {

  usuarioId: string;
  constructor(db: AngularFirestore, private usuarioService: UsuarioService) {
    super(db);
    this.init();
    this.usuarioId = this.usuarioService.id;
  }

  init(): void {
    this.setCollection('/outorga');
  }

  buscaOutorgasClientes(id: string){
    this.setCollection('/outorga', ref =>
      ref.where('clienteId', '==', id)
    );
    return this.getAll();
  }

  criarId(): string {
    return this.db.createId();
  }
}
