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
    this.setCollection(`/users/${this.usuarioService.id}/outorga`, ref => ref.orderBy('dataDeVencimento', 'desc'));
  }

  initOutorga(): void {
    this.setCollection('/outorga');
  }

  setCollectionArquivo(outorga: string) {
    this.setCollection(`/users/${this.usuarioId}/outorga/${outorga}/arquivos`);
  }

  criarId(): string {
    return this.db.createId();
  }
}
