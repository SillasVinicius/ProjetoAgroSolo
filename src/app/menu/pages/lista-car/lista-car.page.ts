import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { take } from 'rxjs/operators';
import { NavController, ModalController } from '@ionic/angular';
import { OverlayService } from 'src/app/core/services/overlay.service';
import { CadastroAmbientalRural } from '../../models/car.model';
import { CarService } from 'src/app/core/services/car.service';
import { UsuarioService } from 'src/app/core/services/usuario.service';
import { ClienteService } from 'src/app/core/services/cliente.service';
import { Cliente } from '../../models/cliente.model';
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
pdfMake.vfs = pdfFonts.pdfMake.vfs;
import { RelatorioCarPage } from "../relatorio-car/relatorio-car.page";
import { AngularFireStorage } from '@angular/fire/storage';

@Component({
  selector: 'app-lista-car',
  templateUrl: './lista-car.page.html',
  styleUrls: ['./lista-car.page.scss'],
})
export class ListaCARPage implements OnInit {

  cadastrosAmbientaisRurais$: Observable<CadastroAmbientalRural[]>;
  clientes$: Observable<Cliente[]>;
  pdfObject: any;

  constructor(
    private navCtrl: NavController,
    private cadastroAmbientalRuralService: CarService,
    private usuarioService: UsuarioService,
    private clienteService: ClienteService,
    private ModalController: ModalController,
    private overlayService: OverlayService,
    private storage: AngularFireStorage
  ) {}

  listaCar: Array<any> = [];
  listaClientesCar: Array<any> = [];  
  async ngOnInit(): Promise<void> {
    const loading = await this.overlayService.loading();
    if (this.usuarioService.admin) {
      this.cadastroAmbientalRuralService.init();
      this.cadastrosAmbientaisRurais$ = this.cadastroAmbientalRuralService.getAll();
      this.cadastrosAmbientaisRurais$.pipe(take(1)).subscribe(() => loading.dismiss());

      this.cadastrosAmbientaisRurais$.forEach(Cars => {
        this.listaClientesCar = [];
        Cars.forEach(Car => {
          if(Car.clienteId !== "" && Car.clienteId !== undefined){
            this.clientes$ = this.clienteService.initClienteId(Car.clienteId);
            this.clientes$.subscribe(async (r: Cliente[]) => {
              Car['nomeCliente'] = (r.length > 0) ? r[0].nome : 'Cliente excluído';
          });
          this.listaClientesCar.push(Car);
          }            
        });
      });



    }
    else {
      this.cadastrosAmbientaisRurais$ = this.cadastroAmbientalRuralService.buscaCarClientes(this.usuarioService.id);		
	    this.cadastrosAmbientaisRurais$.pipe(take(1)).subscribe(() => loading.dismiss());		      
    }
  }

  atualizar(cadastroAmbientalRural: CadastroAmbientalRural): void {
    this.navCtrl.navigateForward(`menu/ambiental/UpdateCadastroAmbientalRural/${cadastroAmbientalRural.id}`);
  }

  viewCar(cadastroAmbientalRural: CadastroAmbientalRural): void {
    this.navCtrl.navigateForward(`menu/ambiental/viewCar/${cadastroAmbientalRural.id}/view`);
  }

  async deletar(cadastroAmbientalRural: CadastroAmbientalRural): Promise<void> {
    await this.overlayService.alert({
      message: `Você realmente deseja deletar o cadastro Ambiental Rural do Cliente: ${cadastroAmbientalRural.nomeCliente} - ${cadastroAmbientalRural.descricao}?`,
      buttons: [
        {
          text: 'Sim',
          handler: async () => {
            await this.deletarArquivoCar(cadastroAmbientalRural);
            await this.cadastroAmbientalRuralService.init();
            await this.cadastroAmbientalRuralService.delete(cadastroAmbientalRural);
            await this.overlayService.toast({
              message: `cadastro Ambiental Rural do Cliente: ${cadastroAmbientalRural.nomeCliente} - ${cadastroAmbientalRural.descricao} excluido!`
            });
          }
        },
        'Não'
      ]
    });
  }

  async openModal() {
    const modal = await this.ModalController.create({
      component: RelatorioCarPage
    })
    modal.present();
  } 

  deletarArquivoCar(car: CadastroAmbientalRural) {
    const ref = this.storage.ref(`/CadastroRuralAmbiental${car.id}`);
    ref.child(`${car.nomeArquivo}`).delete();
  }
}

