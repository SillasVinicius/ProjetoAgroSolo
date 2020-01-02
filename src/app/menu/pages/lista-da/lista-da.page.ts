import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { take } from 'rxjs/operators';
import { NavController } from '@ionic/angular';
import { OverlayService } from 'src/app/core/services/overlay.service';
import { DeclaracaoAmbiental } from '../../models/da.model';
import { DaService } from 'src/app/core/services/da.service';
import { UsuarioService } from 'src/app/core/services/usuario.service';
import { ClienteService } from 'src/app/core/services/cliente.service';
import { Cliente } from '../../models/cliente.model';
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
pdfMake.vfs = pdfFonts.pdfMake.vfs;


@Component({
  selector: 'app-lista-da',
  templateUrl: './lista-da.page.html',
  styleUrls: ['./lista-da.page.scss'],
})
export class ListaDAPage implements OnInit {

  das$: Observable<DeclaracaoAmbiental[]>;
  clientes$: Observable<Cliente[]>;
  pdfObject: any;

  constructor(
    private navCtrl: NavController,
    private daService: DaService,
    private overlayService: OverlayService,
    private usuarioService: UsuarioService,
    private clienteService: ClienteService
  ) {}

  listaDa: Array<any> = [];
  async ngOnInit(): Promise<void> {
    const loading = await this.overlayService.loading();
    if (this.usuarioService.admin) {
      this.daService.initDA();
      this.das$ = this.daService.getAll();
      this.das$.pipe(take(1)).subscribe(() => loading.dismiss());
      this.listDa();

    }
    else {
      this.daService.init();
      this.das$ = this.daService.getAll();
      this.das$.pipe(take(1)).subscribe(() => loading.dismiss());
      this.listDa();
    }

  }

  atualizar(da: DeclaracaoAmbiental): void {
    this.navCtrl.navigateForward(`menu/ambiental/UpdateDeclaracaoAmbiental/${da.id}`);
  }

  async deletar(da: DeclaracaoAmbiental): Promise<void> {
    await this.overlayService.alert({
      message: `Você realmente deseja deletar a Declaracao Ambiental "${da.descricao}"?`,
      buttons: [
        {
          text: 'Sim',
          handler: async () => {
            await this.daService.init();
            await this.daService.delete(da);
            await this.daService.initDA();
            await this.daService.delete(da);
            await this.overlayService.toast({
              message: `Declaracao Ambiental "${da.descricao}" excluida!`
            });
          }
        },
        'Não'
      ]
    });
  }


  
  async listDa() {
    this.das$.forEach(das => {
      das.forEach(da => {
        this.clientes$ = this.clienteService.initClienteId(da.clienteId);
        this.clientes$.subscribe(async (r: Cliente[]) => {
          da['nomeCliente'] = r[0].nome;
        });
        this.listaDa.push(da);
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
          this.listaDa,
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
