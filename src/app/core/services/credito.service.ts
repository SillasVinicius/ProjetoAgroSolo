import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { UsuarioService } from './usuario.service';
import { Credito } from 'src/app/menu/models/credito.model';
import { Firestore } from '../classes/firestore';

@Injectable({
  providedIn: 'root'
})
export class CreditoService extends Firestore<Credito>{
  usuarioId: string;
  constructor(db: AngularFirestore, private usuarioService: UsuarioService) {
    super(db);
    this.init();
    this.usuarioId = this.usuarioService.id;  
  }  

  init(): void {
    this.setCollection(`/users/${this.usuarioService.id}/cadastroCredito`,ref => ref.orderBy('dataAprovacaoCredito', 'desc'));
  }

  initLA(): void {
    this.setCollection('/cadastroCredito');
  }

  initCredito(): void {
    this.setCollection('/cadastroCredito');
  }  

  setCollectionArquivo(cliente: string) {
    this.setCollection(`/users/${this.usuarioId}/cadastroCredito/${cliente}/arquivos`);
  }

  criarId(): string {
    return this.db.createId();
  }
}
