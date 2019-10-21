import { Injectable } from '@angular/core';
import { Firestore } from '../classes/firestore';
import { AngularFirestore } from '@angular/fire/firestore';
import { UsuarioService } from './usuario.service';
import { Notificacao } from 'src/app/menu/models/notification.model';

@Injectable({
  providedIn: 'root'
})
export class NotificacaoService extends Firestore<Notificacao> {

  usuarioId: string;
  constructor(db: AngularFirestore, private usuarioService: UsuarioService) {
    super(db);
    this.init();
    this.usuarioId = this.usuarioService.id;
  }

  init(): void {
    this.setCollection(`/users/${this.usuarioService.id}/notificacao`);
  }

  criarId(): string {
    return this.db.createId();
  }
}
