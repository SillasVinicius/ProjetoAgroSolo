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
    this.usuarioId = this.usuarioService.id;  
  }  

  init(): void {
    this.setCollection('/cadastroCredito');
  }  

  buscaCreditoClientes(id: string){
    this.setCollection('/cadastroCredito', ref =>
      ref.where('clienteId', '==', id)
    );
    return this.getAll();
  }

  criarId(): string {
    return this.db.createId();
  }
}
