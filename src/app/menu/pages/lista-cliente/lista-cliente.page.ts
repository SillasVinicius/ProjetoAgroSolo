import { Component, OnInit } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Cliente } from '../../models/cliente.model';
import { Http } from '@angular/http';
import { map } from 'rxjs/operators';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-lista-cliente',
  templateUrl: './lista-cliente.page.html',
  styleUrls: ['./lista-cliente.page.scss']
})
export class ListaClientePage implements OnInit {
  clientes$: Observable<Cliente[]>;
  private clientes(): Observable<Cliente[]> {
    return this.http.get('http://localhost:3001/cliente').pipe(map(response => response.json()));
  }

  constructor(private http: Http, private navCtrl: NavController) {}

  ngOnInit(): void {
    this.clientes$ = this.clientes();
  }

  atualizar(cliente: Cliente): void {
    this.navCtrl.navigateForward(`/menu/updateCliente/${cliente.id}`);
  }
}
