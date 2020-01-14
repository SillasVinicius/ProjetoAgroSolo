import { Component, OnInit, ViewChildren, QueryList, ElementRef } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { ClienteService } from 'src/app/core/services/cliente.service';
import { OverlayService } from 'src/app/core/services/overlay.service';
import { CarService } from 'src/app/core/services/car.service';
import { Cliente } from '../../models/cliente.model';
import { CadastroAmbientalRural } from '../../models/car.model';
import { Observable } from 'rxjs';
import { take } from 'rxjs/operators';
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
pdfMake.vfs = pdfFonts.pdfMake.vfs;

@Component({
  selector: 'app-relatorio-car',
  templateUrl: './relatorio-car.page.html',
  styleUrls: ['./relatorio-car.page.scss'],
})
export class RelatorioCarPage implements OnInit {
  das$: Observable<CadastroAmbientalRural[]>;
  clientes$: Observable<Cliente[]>;
  clientes: Cliente[] = [];
  cars: CadastroAmbientalRural[] = [];
  pdfObject: any;
  id_cli: String;
  data_vencimento_ini: String;
  data_vencimento_fim: String;
  @ViewChildren('filter') filtrosRelatorio: QueryList<any>;

  constructor(
    private ModalController: ModalController,
    private clienteService: ClienteService,
    private CarService: CarService,
    private overlayService: OverlayService
  ) { }

  listaCar: Array<any> = [];

  async ngOnInit(): Promise<void> {
    const loading = await this.overlayService.loading();
    this.clienteService.initCliente();
    this.clientes$ = this.clienteService.getAll();
    this.clientes$.pipe(take(1)).subscribe(() => loading.dismiss());

    this.clienteService.getAll().subscribe((c: Cliente[]) => {
      for (let i = 0; i < c.length; i++) {
          this.clientes[i] = c[i];
      }
    });

    this.CarService.getAll().subscribe((c: CadastroAmbientalRural[]) => {
      for (let i = 0; i < c.length; i++) {
          this.cars[i] = c[i];
      }
    });
  }

  async closeModal(){
    await this.ModalController.dismiss();
  }

  clearFilters() {
    this.id_cli = '';
    this.data_vencimento_ini = '';
    this.data_vencimento_fim = '';
    this.filtrosRelatorio.forEach(filtro => {
      filtro.el.value = null;
    });
  }

  async obter_id_cliente(id: String){
    this.id_cli = id;
  }

  registroDataHora()
  {
    var data = new Date();
    var dia = data.getDate();
    var mes = data.getMonth() + 1;
    var ano = data.getFullYear();
    var horas = data.getHours();
    var minutos = data.getMinutes();
    return dia+"/"+mes+"/"+ano+" - "+horas + "h" + minutos;
  }

  async relatorio_car()
  {
    let gerar: any;
    const loading = await this.overlayService.loading();
    this.listaCar = [];

    if (this.data_vencimento_ini > this.data_vencimento_fim)
    {
      alert("Data inicial não pode ser maior que data final!");
      loading.remove();
      return;
    }

    if (this.id_cli)
    {
      gerar = await this.cars.forEach(car => {
        this.clientes.forEach(cliente =>{
          if ((cliente.id == this.id_cli) && (cliente.id == car.clienteId))
          {
            car['nomeCliente'] = cliente.nome;
            this.listaCar.push(car);
          }
        });
      });
    }
    else
    {
      gerar = await this.cars.forEach(car => {
        this.clientes.forEach(cliente =>{
          if (cliente.id == car.clienteId)
          {
            car['nomeCliente'] = cliente.nome;
          this.listaCar.push(car);
          }
        });
      });
    }

    loading.remove();
    this.exportPdf();

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
      content:
      [
        this.table(
          this.listaCar,
          ["nomeCliente", "descricao"],
          [
            { text: "Nome Cliente", style: "tableHeader" },
            { text: "Descricao", style: "tableHeader" },

          ]
        )
      ],
      styles:
      {
        tableHeader: {
          bold:true,
          fontSize: 13,
          color: "Black"
        }
      },

      footer: {
        columns: [
          { text: ""},
          { text: this.registroDataHora()},
          { text: ""},
          { text: ""},
          { text: ""},
          { text: ""},
          { text: ""},
          { text: ""},
          { text: ""},
          { text: "Registros: "+this.listaCar.length},
          { text: ""},
        ]
      },

    };


    this.pdfObject = pdfMake.createPdf(docDefinition).open();

  }


}
