import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { take } from 'rxjs/operators';
import { NavController } from '@ionic/angular';
import { OverlayService } from 'src/app/core/services/overlay.service';
import { Outorga } from '../../models/outorga.model';
import { OutorgaService } from 'src/app/core/services/outorga.service';
import { UsuarioService } from 'src/app/core/services/usuario.service';
import { ClienteService } from 'src/app/core/services/cliente.service';
import { Cliente } from '../../models/cliente.model';
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
pdfMake.vfs = pdfFonts.pdfMake.vfs;

@Component({
  selector: 'app-lista-outorga',
  templateUrl: './lista-outorga.page.html',
  styleUrls: ['./lista-outorga.page.scss'],
})
export class ListaOutorgaPage implements OnInit {

  Outorga = [];

  outorgas$: Observable<Outorga[]>;
  clientes$: Observable<Cliente[]>;
  pdfObject: any;

  constructor(
    private navCtrl: NavController,
    private outorgaService: OutorgaService,
    private overlayService: OverlayService,
    private usuarioService: UsuarioService,
    private clienteService: ClienteService
  ) {}

  listaOutorga: Array<any> = [];

  async ngOnInit(): Promise<void> {
    const loading = await this.overlayService.loading();
    if (this.usuarioService.admin) {
      this.outorgaService.initOutorga();
      this.outorgas$ = this.outorgaService.getAll();
      this.outorgas$.pipe(take(1)).subscribe(() => loading.dismiss());
      this.listOutorga();
    }
    else {
      this.outorgaService.init();
      this.outorgas$ = this.outorgaService.getAll();
      this.outorgas$.pipe(take(1)).subscribe(() => loading.dismiss());
      this.listOutorga();
    }
  }

  atualizar(outorga: Outorga): void {
    this.navCtrl.navigateForward(`/menu/updateOutorga/${outorga.id}`);
  }


  async deletar(outorga: Outorga): Promise<void> {
    await this.overlayService.alert({
      message: `Você realmente deseja deletar a outorga "${outorga.descricao}"?`,
      buttons: [
        {
          text: 'Sim',
          handler: async () => {
            await this.outorgaService.init();
            await this.outorgaService.delete(outorga);
            await this.outorgaService.initOutorga();
            await this.outorgaService.delete(outorga);
            await this.overlayService.toast({
              message: `Outorga "${outorga.descricao}" excluido!`
            });
          }
        },
        'Não'
      ]
    });
  }


  async listOutorga() {
    this.outorgas$.forEach(outorgas => {
      outorgas.forEach(outorga => {
        this.clientes$ = this.clienteService.initClienteId(outorga.clienteId);
        this.clientes$.subscribe(async (r: Cliente[]) => {
            outorga['nomeCliente'] = r[0].nome;
        });
        this.listaOutorga.push(outorga);
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
          this.listaOutorga,
          ["nomeCliente", "descricao", "dataDeVencimento"],
          [
            { text: "Nome Cliente", style: "tableHeader" },
            { text: "Descricao", style: "tableHeader" },
            { text: "Data de Vencimento", style: "tableHeader", Data: "MM/DD/YYYY"},
          
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
