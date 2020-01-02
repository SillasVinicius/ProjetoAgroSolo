import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { take } from 'rxjs/operators';
import { NavController } from '@ionic/angular';
import { OverlayService } from 'src/app/core/services/overlay.service';
import { CadastroAmbientalRural } from '../../models/car.model';
import { CarService } from 'src/app/core/services/car.service';
import { UsuarioService } from 'src/app/core/services/usuario.service';
import { ClienteService } from 'src/app/core/services/cliente.service';
import { Cliente } from '../../models/cliente.model';
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
pdfMake.vfs = pdfFonts.pdfMake.vfs;

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
    private overlayService: OverlayService
  ) {}

  listaCar: Array<any> = [];

  async ngOnInit(): Promise<void> {
    const loading = await this.overlayService.loading();
    if (this.usuarioService.admin) {
      this.cadastroAmbientalRuralService.initCAR();
      this.cadastrosAmbientaisRurais$ = this.cadastroAmbientalRuralService.getAll();
      this.cadastrosAmbientaisRurais$.pipe(take(1)).subscribe(() => loading.dismiss());
    }
    else {
      this.cadastroAmbientalRuralService.init();
      this.cadastrosAmbientaisRurais$ = this.cadastroAmbientalRuralService.getAll();
      this.cadastrosAmbientaisRurais$.pipe(take(1)).subscribe(() => loading.dismiss());
    }
    this.listCar();
  }

  atualizar(cadastroAmbientalRural: CadastroAmbientalRural): void {
    this.navCtrl.navigateForward(`menu/ambiental/UpdateCadastroAmbientalRural/${cadastroAmbientalRural.id}`);
  }

  async deletar(cadastroAmbientalRural: CadastroAmbientalRural): Promise<void> {
    await this.overlayService.alert({
      message: `Você realmente deseja deletar o cadastro Ambiental Rural "${cadastroAmbientalRural.descricao}"?`,
      buttons: [
        {
          text: 'Sim',
          handler: async () => {
            await this.cadastroAmbientalRuralService.init();
            await this.cadastroAmbientalRuralService.delete(cadastroAmbientalRural);
            await this.cadastroAmbientalRuralService.initCAR();
            await this.cadastroAmbientalRuralService.delete(cadastroAmbientalRural);
            await this.overlayService.toast({
              message: `cadastro Ambiental Rural "${cadastroAmbientalRural.descricao}" excluido!`
            });
          }
        },
        'Não'
      ]
    });
  }


   
  async listCar() {
    this.cadastrosAmbientaisRurais$.forEach(cars => {
      cars.forEach(car => {
        this.clientes$ = this.clienteService.initClienteId(car.clienteId);
        this.clientes$.subscribe(async (r: Cliente[]) => {
          car['nomeCliente'] = r[0].nome;
        });
        this.listaCar.push(car);
      });
    });
  }


  buildTableBody(data, columns, header) {

    let body = [];

    body.push(header);

    data.forEach(row => {
      const dataRow = [];

      columns.forEach(column => {
        dataRow.push({ text: row[column] ? row[column].toString() : "" });
      });

      body.push(dataRow);
    });

    return body;
  }

  
  table(data, columns, header) {
    return {
      table: {
        headerRows: 1,
        widths: [100, 100, 100, 100, 100, 100, 100, 100, 100],
        body: this.buildTableBody(data, columns, header)
      },
      layout: "lightHorizontalLines"
    }
  }

  exportPdf(): void {
    var docDefinition
    docDefinition = {
      header: {
        columns: [
          {
            stack: [
              {
                text: "Agro Solo",
                fontSize: 18,
                alignment: "center" 
              },
            ],
            width: '*'
          }
        ],
        
        margin: [15, 15]
      },

      pageOrientation: 'landscape',
      pageSize: {height: 850, width: 1100},
      content: [
        this.table(
          this.listaCar,
          ["nomeCliente", "descricao"],
          [
            { text: "Nome Cliente", style: "tableHeader" },
            { text: "Descricao", style: "tableHeader" },
          
          ]
        )
      ],
      styles: {
        tableHeader: {
          bold:true,
          fontSize: 13,
          color: "Black"
        }
      },

      footer: {
        columns: [
          "Left part",
          { text: "Right part", alignment: "right" }
        ]
      },

    };


    this.pdfObject = pdfMake.createPdf(docDefinition).open();

  }


}

