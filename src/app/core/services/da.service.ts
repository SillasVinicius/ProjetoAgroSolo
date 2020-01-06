import { Injectable } from '@angular/core';
import { Firestore } from '../classes/firestore';
import { AngularFirestore } from '@angular/fire/firestore';
import { UsuarioService } from './usuario.service';
import { DeclaracaoAmbiental } from 'src/app/menu/models/da.model';


@Injectable({
  providedIn: 'root'
})
export class DaService extends Firestore<DeclaracaoAmbiental>{
  usuarioId: string;
  constructor(db: AngularFirestore, private usuarioService: UsuarioService) {
    super(db);
    this.init();
    this.usuarioId = this.usuarioService.id;
  }

    init(): void {
      this.setCollection(`/users/${this.usuarioService.id}/DeclaracaoAmbiental`, ref => ref.orderBy('dataDeVencimento', 'desc'));
    }

    initDA(): void {
      this.setCollection('/DeclaracaoAmbiental');
    }

    buscaDeclaracoesClientes(id: string){
      this.setCollection('/DeclaracaoAmbiental', ref =>
        ref.where('clienteId', '==', id)
      );
      return this.getAll();
    }

    setCollectionArquivo(da: string) {
      this.setCollection(`/users/${this.usuarioId}/DeclaracaoAmbiental/${da}/arquivos`);
    }

    criarId(): string {
      return this.db.createId();
    }
}
