import { AngularFirestore, AngularFirestoreCollection, QueryFn } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { Query } from '@angular/core';

export abstract class Firestore<T extends { id: string }> {
  collection: AngularFirestoreCollection<T>;

  id = '';

  logado = false;

  nomeUser = '';

  urlFoto = '...';

  constructor(protected db: AngularFirestore) {}

  protected setCollection(path: string, queryFn?: QueryFn): void {
    this.collection = path ? this.db.collection(path, queryFn) : null;
  }

  private setItem(item: T, operation: string): Promise<T> {
    return this.collection
      .doc<T>(item.id)
      [operation](item)
      .then(() => item);
  }

  getAll(): Observable<T[]> {
    return this.collection.valueChanges();
  }

  get(id: string): Observable<T> {
    return this.collection.doc<T>(id).valueChanges();
  }

  loginDb(email: string, senha: string): Observable<T[]> {
    this.setCollection('/users', ref =>
      ref.where('email', '==', email).where('senha', '==', senha)
    );

    return this.getAll();
  }

  setId(id: string) {
    this.id = id;
  }

  create(item: T): Promise<T> {
    item.id = this.db.createId();
    this.setId(item.id);
    return this.setItem(item, 'set');
  }

  update(item: T): Promise<T> {
    return this.setItem(item, 'update');
  }

  delete(item: T): Promise<void> {
    return this.collection.doc<T>(item.id).delete();
  }
}
