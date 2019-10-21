import { Injectable } from '@angular/core';
import { Firestore } from '../classes/firestore';
import { AngularFirestore } from '@angular/fire/firestore';
import { UsuarioService } from './usuario.service';
import { DadosPessoais } from 'src/app/menu/models/dadosPessoais.model';

@Injectable({
  providedIn: 'root'
})
export class DadosPessoaisService extends Firestore<DadosPessoais> {

  usuarioId: string;
  constructor(db: AngularFirestore, private usuarioService: UsuarioService) {
    super(db);
    this.init();
    this.usuarioId = this.usuarioService.id;
  }

  init(): void {
    this.setCollection(`/users/${this.usuarioService.id}/dadosPessoais`);
  }

  initImpostoDeRenda(): void {
    this.setCollection(`/users/${this.usuarioService.id}/dadosPessoais/1/impostoDeRenda`);
  }

  initCnh(): void {
    this.setCollection(`/users/${this.usuarioService.id}/dadosPessoais/1/cnh`);
  }

  criarId(): string {
    return this.db.createId();
  }
}
