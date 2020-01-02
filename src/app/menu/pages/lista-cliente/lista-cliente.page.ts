import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Cliente } from '../../models/cliente.model';
import { take } from 'rxjs/operators';
import { NavController, ModalController } from '@ionic/angular';
import { ClienteService } from 'src/app/core/services/cliente.service';
import { OverlayService } from 'src/app/core/services/overlay.service';
import { UsuarioService } from 'src/app/core/services/usuario.service';
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
pdfMake.vfs = pdfFonts.pdfMake.vfs;


@Component({
  selector: 'app-lista-cliente',
  templateUrl: './lista-cliente.page.html',
  styleUrls: ['./lista-cliente.page.scss']
})
export class ListaClientePage implements OnInit {
  clientes$: Observable<Cliente[]>;
  pdfObject: any;
  constructor(
    private navCtrl: NavController,
    private modalCtrl: ModalController,
    private clienteService: ClienteService,
    private overlayService: OverlayService,
    private usuarioService: UsuarioService,
  ) { }

  listaCliente: Array<any> = [];
  async ngOnInit(): Promise<void> {
    const loading = await this.overlayService.loading();
    if (this.usuarioService.admin) {
      this.clienteService.initCliente();
      this.clientes$ = this.clienteService.getAll();
      this.clientes$.pipe(take(1)).subscribe(() => loading.dismiss());
      this.listCliente();
    }
    else {
      this.clienteService.init();
      this.clientes$ = this.clienteService.getAll();
      this.clientes$.pipe(take(1)).subscribe(() => loading.dismiss());
      this.listCliente();
    }
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
            await this.clienteService.init();
            await this.clienteService.delete(cliente);
            await this.clienteService.initCliente();
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

  async listCliente() {
    this.clientes$.forEach(clientes => {
      clientes.forEach(cliente => {
        this.listaCliente.push(cliente);
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
          this.listaCliente,
          ["nome", "cpf", "rg", "email", "telefone", "dataNascimento", "pdtvAgro", "patrimonio", "informacoesAdicionais"],
          [
            { text: "Nome", style: "tableHeader" },
            { text: "CPF/CNPJ", style: "tableHeader" },
            { text: "RG", style: "tableHeader", Data: "MM/DD/YYYY"},
            { text: "E-mail", style: "tableHeader" },
            { text: "Telefone", style: "tableHeader" },
            { text: "Data Nascimento", style: "tableHeader" },
            { text: "Produtividade Agropecuária", style: "tableHeader" },
            { text: "Patrimônio", style: "tableHeader" },
            { text: "Informações Adicionais", style: "tableHeader" },
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
