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
    this.setCollection(`/users/${this.usuarioService.id}/CadastroCreditoFinanceiro`, ref => ref.orderBy('dataAprovacaoCredito', 'desc'));
  }

  initLA(): void {
    this.setCollection('/CadastroCreditoFinanceiro');
  }

  setCollectionArquivo(la: string) {
    this.setCollection(`/users/${this.usuarioId}/CadastroCreditoFinanceirol/${la}/arquivos`);
  }

  criarId(): string {
    return this.db.createId();
  }
}
