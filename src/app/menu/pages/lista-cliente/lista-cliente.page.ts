import { Component, OnInit } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Cliente } from '../../models/cliente.model';
import { Http } from '@angular/http';
import { map, take } from 'rxjs/operators';
import { NavController } from '@ionic/angular';
import { ClienteService } from 'src/app/core/services/cliente.service';
import { OverlayService } from 'src/app/core/services/overlay.service';
import { UsuarioService } from 'src/app/core/services/usuario.service';

@Component({
  selector: 'app-lista-cliente',
  templateUrl: './lista-cliente.page.html',
  styleUrls: ['./lista-cliente.page.scss']
})
export class ListaClientePage implements OnInit {
  clientes$: Observable<Cliente[]>;
  // private clientes(): Observable<Cliente[]> {
  //   return this.http.get('http://localhost:3001/cliente').pipe(map(response => response.json()));
  // }

  constructor(
    private http: Http,
    private navCtrl: NavController,
    private clienteService: ClienteService,
    private overlayService: OverlayService
  ) {}

  async ngOnInit(): Promise<void> {
    const loading = await this.overlayService.loading();
    this.clientes$ = this.clienteService.getAll();
    this.clientes$.pipe(take(1)).subscribe(clientes => loading.dismiss());
  }

  atualizar(cliente: Cliente): void {
    this.navCtrl.navigateForward(`/menu/updateCliente/${cliente.id}`);
  }

  async deletar(cliente: Cliente): Promise<void> {
    await this.overlayService.alert({
      message: `Você realmente deseja deletar o cliente "${cliente.nome}"?`,
      buttons: [
        {
          text: 'Sim',
          handler: async () => {
            await this.clienteService.delete(cliente);
            await this.overlayService.toast({
              message: `Cliente "${cliente.nome}" excluido!`
            });
          }
        },
        'Não'
      ]
    });
  }
}