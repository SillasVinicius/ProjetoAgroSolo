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
    this.setCollection(`/users/${this.usuarioService.id}/outorga`);
    // this.setCollection('/menu', ref => ref.orderBy('nome', 'asc').orderBy('id', 'asc'));
  }

  // setCollectionFoto(cliente: string) {
  //   this.setCollection(`/users/${this.usuarioId}/outorga/${cliente}/imagens`);
  // }
  setCollectionArquivo(outorga: string) {
    this.setCollection(`/users/${this.usuarioId}/outorga/${outorga}/arquivos`);
  }

  criarId(): string {
    return this.db.createId();
  }
}
