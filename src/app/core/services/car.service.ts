import { Injectable } from '@angular/core';
import { Firestore } from '../classes/firestore';
import { AngularFirestore } from '@angular/fire/firestore';
import { UsuarioService } from './usuario.service';
import { CadastroAmbientalRural } from 'src/app/menu/models/car.model';

@Injectable({
  providedIn: 'root'
})
export class CarService extends Firestore<CadastroAmbientalRural>{

  usuarioId: string;
  constructor(db: AngularFirestore, private usuarioService: UsuarioService) {
    super(db);
    this.usuarioId = this.usuarioService.id;
  }

    init(): void {
      this.setCollection(`/CadastroAmbientalRural`);
    }

    buscaCarClientes(id: string){
      this.setCollection('/CadastroAmbientalRural', ref =>
        ref.where('clienteId', '==', id)
      );
      return this.getAll();
    }

    criarId(): string {
      return this.db.createId();
    }
}
