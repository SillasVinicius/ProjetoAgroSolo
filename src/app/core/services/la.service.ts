import { Injectable } from '@angular/core';
import { Firestore } from '../classes/firestore';
import { AngularFirestore } from '@angular/fire/firestore';
import { UsuarioService } from './usuario.service';
import { LicencaAmbiental } from 'src/app/menu/models/la.model';

@Injectable({
  providedIn: 'root'
})
export class LaService extends Firestore<LicencaAmbiental> {

  usuarioId: string;
  constructor(db: AngularFirestore, private usuarioService: UsuarioService) {
    super(db);
    this.init();
    this.usuarioId = this.usuarioService.id;
  }

    init(): void {
      this.setCollection(`/users/${this.usuarioService.id}/LicencaAmbiental`, ref => ref.orderBy('dataDeVencimento', 'desc'));
    }

    setCollectionArquivo(la: string) {
      this.setCollection(`/users/${this.usuarioId}/LicencaAmbiental/${la}/arquivos`);
    }

    criarId(): string {
      return this.db.createId();
    }

}
