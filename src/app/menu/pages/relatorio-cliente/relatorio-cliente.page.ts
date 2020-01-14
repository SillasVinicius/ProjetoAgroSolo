import { Component, OnInit, ViewChildren, QueryList, ElementRef } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { ClienteService } from 'src/app/core/services/cliente.service';
import { OverlayService } from 'src/app/core/services/overlay.service';
import { Cliente } from '../../models/cliente.model';
import { Observable } from 'rxjs';
import { take } from 'rxjs/operators';
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
pdfMake.vfs = pdfFonts.pdfMake.vfs;

@Component({
  selector: 'app-relatorio-cliente',
  templateUrl: './relatorio-cliente.page.html',
  styleUrls: ['./relatorio-cliente.page.scss'],
})
export class RelatorioClientePage implements OnInit {
  clientes$: Observable<Cliente[]>;
  clientes: Cliente[] = [];
  pdfObject: any;
  id_cli: String;
  data_nasc_cli_ini: String; 
  data_nasc_cli_fim: String;
  @ViewChildren('filter') filtrosRelatorio: QueryList<any>;

  constructor(
    private ModalController: ModalController,
    private clienteService: ClienteService,
    private overlayService: OverlayService
  ) { }

  listaCliente: Array<any> = [];  
  async ngOnInit(): Promise<void> {
    const loading = await this.overlayService.loading(); 
    this.clienteService.init();
    this.clientes$ = this.clienteService.getAll();
    this.clientes$.pipe(take(1)).subscribe(() => loading.dismiss());

    this.clienteService.getAll().subscribe((r: Cliente[]) => {
      for (let i = 0; i < r.length; i++) {
          this.clientes[i] = r[i];
      }
    });
  }
  
  async closeModal(){
    await this.ModalController.dismiss();
  }

  clearFilters() {
    this.id_cli = '';
    this.data_nasc_cli_ini = ''; 
    this.data_nasc_cli_fim = '';
    this.filtrosRelatorio.forEach(filtro => {
      filtro.el.value = null;
      console.log(typeof(filtro));
    });
  }

  async obter_id_cliente(id: String){
    this.id_cli = id;
  }

  formatarData(dt: String){
    let dataNascForm: String;
    let ano: string;
    let mes: string;
    let dia: string;
    dataNascForm = dt;
    ano = dataNascForm.substring(0,4);
    mes = dataNascForm.substring(5,7);
    dia = dataNascForm.substring(8,10);
    let validar = dia+"/"+mes+"/"+ano
    if (validar.length === 10) {
      return `${dia}/${mes}/${ano}`;
    }
    else {
      return 'error data';
    }
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

  async obter_dt_nascimento_cliente_ini(dt_nascimento_ini: String){
    this.data_nasc_cli_ini = dt_nascimento_ini;
  }

  async obter_dt_nascimento_cliente_fim(dt_nascimento_fim: String){
    this.data_nasc_cli_fim = dt_nascimento_fim;
  }

  async relatorio_cli() {
    let gerar: any;
    const loading = await this.overlayService.loading(); 
    this.listaCliente = [];

    if (this.data_nasc_cli_ini > this.data_nasc_cli_fim)
    {
      alert("Data inicial não pode ser maior que data final!");
      loading.remove();
      return;
    }

    if ((this.id_cli) && (this.data_nasc_cli_ini) && (this.data_nasc_cli_fim))
    {
      gerar = await this.clientes.forEach(cliente => {
        if (this.id_cli == cliente.id) 
          if ((cliente.dataNascimento >= this.data_nasc_cli_ini) && 
              (cliente.dataNascimento <= this.data_nasc_cli_fim))
        {
          cliente['dataNascForm'] = this.formatarData(cliente.dataNascimento);
          this.listaCliente.push(cliente);
        }
      });
    }
    else if (this.id_cli)
    { 
      gerar = await this.clientes.forEach(cliente => {
        if (this.id_cli == cliente.id) 
        {
          cliente['dataNascForm'] = this.formatarData(cliente.dataNascimento);
          this.listaCliente.push(cliente);
        }
      });
    }
    else if ((this.data_nasc_cli_ini) && (this.data_nasc_cli_fim))
    {
      gerar = await this.clientes.forEach(cliente => {
        if 
        ((cliente.dataNascimento >= this.data_nasc_cli_ini) &&
         (cliente.dataNascimento <= this.data_nasc_cli_fim))
        {
          cliente['dataNascForm'] = this.formatarData(cliente.dataNascimento);
          this.listaCliente.push(cliente);
        }
      }); 
    }
    else
    {
      gerar = await this.clientes.forEach(cliente => {
        cliente['dataNascForm'] = this.formatarData(cliente.dataNascimento);
        this.listaCliente.push(cliente);
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
          this.listaCliente,
          ["nome", "cpf", "rg", "email", "telefone", "dataNascForm", "pdtvAgro", "patrimonio", "informacoesAdicionais"],
          [
            { text: "Nome", style: "tableHeader" },
            { text: "CPF/CNPJ", style: "tableHeader" },
            { text: "RG", style: "tableHeader"},
            { text: "E-mail", style: "tableHeader" },
            { text: "Telefone", style: "tableHeader" },
            { text: "Data Nascimento", style: "tableHeader" },
            { text: "Produtividade Agropecuária", style: "tableHeader" },
            { text: "patrimonioForm", style: "tableHeader" },
            { text: "Informações Adicionais", style: "tableHeader" },
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
          { text: "Registros: "+this.listaCliente.length},
          { text: ""},
        ]
      },

    };


    this.pdfObject = pdfMake.createPdf(docDefinition).open();

  }

}

