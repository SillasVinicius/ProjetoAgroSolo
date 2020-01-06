import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Credito } from '../../models/credito.model';
import { NavController } from '@ionic/angular';
import { CreditoService } from 'src/app/core/services/credito.service';
import { OverlayService } from 'src/app/core/services/overlay.service';
import { UsuarioService } from 'src/app/core/services/usuario.service';
import { ClienteService } from 'src/app/core/services/cliente.service';
import { Cliente } from '../../models/cliente.model';
import { take } from 'rxjs/operators';
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
pdfMake.vfs = pdfFonts.pdfMake.vfs;

@Component({
  selector: 'app-lista-credito',
  templateUrl: './lista-credito.page.html',
  styleUrls: ['./lista-credito.page.scss'],
})
export class ListaCreditoPage implements OnInit {

  
  cadastrosDeCreditos$: Observable<Credito[]>;
  clientes$: Observable<Cliente[]>;
  pdfObject: any;

  constructor(
    private navCtrl: NavController,
    private creditoService: CreditoService,
    private overlayService: OverlayService,
    private clienteService: ClienteService,
    private usuarioService: UsuarioService
  ) {}

  listCred: Array<any> = [];

  async ngOnInit(): Promise<void> {
    const loading = await this.overlayService.loading();
    if (this.usuarioService.admin) {
      this.creditoService.initCredito();
      this.cadastrosDeCreditos$ = this.creditoService.getAll();
      this.cadastrosDeCreditos$.pipe(take(1)).subscribe(() => loading.dismiss());
    }
    else {
      this.cadastrosDeCreditos$ = this.creditoService.buscaCreditoClientes(this.usuarioService.id);
      this.cadastrosDeCreditos$.pipe(take(1)).subscribe(() => loading.dismiss());
    }
    this.listCredito();
  }

  atualizar(credito: Credito): void {
    this.navCtrl.navigateForward(`/menu/ambiental/UpdateCadastroCreditoFinanceiro/${credito.id}`);
  }

  async deletar(credito: Credito): Promise<void> {
    await this.overlayService.alert({
      message: `Você realmente deseja deletar o crédito de valor R$ "${credito.valorCredito}"?`,
      buttons: [
        {
          text: 'Sim',
          handler: async () => {
            await this.creditoService.init();
            await this.creditoService.delete(credito);
            await this.creditoService.initCredito();
            await this.creditoService.delete(credito);
            await this.overlayService.toast({
              message: `Crédito de R$"${credito.valorCredito}" excluido!`
            });
          }
        },
        'Não'
      ]
    });
  }

  async listCredito() {
    this.cadastrosDeCreditos$.forEach(Creds => {
      Creds.forEach(Cred => {
        this.clientes$ = this.clienteService.initClienteId(Cred.clienteId);
        this.clientes$.subscribe(async (r: Cliente[]) => {
          Cred['nomeCliente'] = r[0].nome;
        });
        this.listCred.push(Cred);
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
      pageSize: {height: 600, width: 1000},
      content: [
        this.table(
          this.listCred,
          ["nomeCliente", "descricao", "valorCredito", "dataAprovacaoCredito", "dataExpiracaoCredito"],
          [
            { text: "Nome Cliente", style: "tableHeader" },
            { text: "Descrição", style: "tableHeader" },
            { text: "Valor do Crédito", style: "tableHeader" },
            { text: "Data de Aprovação", style: "tableHeader" },
            { text: "Data de Expiração", style: "tableHeader" },
          
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
