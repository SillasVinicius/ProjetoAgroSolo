import { Component, OnInit, ElementRef, ViewChildren, QueryList } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { ClienteService } from 'src/app/core/services/cliente.service';
import { OverlayService } from 'src/app/core/services/overlay.service';
import { OutorgaService } from 'src/app/core/services/outorga.service';
import { Cliente } from '../../models/cliente.model';
import { Outorga } from '../../models/outorga.model';
import { Observable } from 'rxjs';
import { take } from 'rxjs/operators';
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
pdfMake.vfs = pdfFonts.pdfMake.vfs;

@Component({
  selector: 'app-relatorio-outorga',
  templateUrl: './relatorio-outorga.page.html',
  styleUrls: ['./relatorio-outorga.page.scss'],
})
export class RelatorioOutorgaPage implements OnInit {
  outorgas$: Observable<Outorga[]>;
  clientes$: Observable<Cliente[]>;
  clientes: Cliente[] = [];
  outorgas: Outorga[] = [];
  pdfObject: any;
  id_cli: String;
  data_vencimento_ini: String; 
  data_vencimento_fim: String;
  @ViewChildren('filter') filtrosRelatorio: QueryList<any>;

  constructor(
    private ModalController: ModalController,
    private clienteService: ClienteService,
    private outorgaService: OutorgaService,
    private overlayService: OverlayService
  ) { }

  listaOutorga: Array<any> = [];  

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

    this.outorgaService.getAll().subscribe((o: Outorga[]) => {
      for (let i = 0; i < o.length; i++) {
          this.outorgas[i] = o[i];
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

  async obter_dt_vescimento_cliente_ini(dt_vencimento_ini: String){
    this.data_vencimento_ini = dt_vencimento_ini;
  }

  async obter_dt_vescimento_cliente_fim(dt_vencimento_fim: String){
    this.data_vencimento_fim = dt_vencimento_fim;
  }

  async relatorio_outorga()
  {
    let gerar: any;
    const loading = await this.overlayService.loading(); 
    this.listaOutorga = [];


    if (this.data_vencimento_ini > this.data_vencimento_fim)
    {
      alert("Data inicial não pode ser maior que data final!");
      loading.remove();
      return;
    }

    if ((this.id_cli) && (this.data_vencimento_ini) && (this.data_vencimento_fim))
    {
      gerar = await this.outorgas.forEach(outorga => {
        if ((outorga.dataDeVencimento >= this.data_vencimento_ini) && 
            (outorga.dataDeVencimento <= this.data_vencimento_fim))
        {
          this.clientes.forEach(cliente =>{
            if (cliente.id == this.id_cli)
            {
              outorga['nomeCliente'] = cliente.nome;
              outorga['dtVencimentoForm'] = this.formatarData(outorga.dataDeVencimento);
              this.listaOutorga.push(outorga);
            }
          }); 
        }
      });
    }
    else if (this.id_cli) 
    {
      gerar = await this.outorgas.forEach(outorga => {
        this.clientes.forEach(cliente =>{
          if ((cliente.id == this.id_cli) && (cliente.id == outorga.clienteId))
          {
            outorga['nomeCliente'] = cliente.nome;
            outorga['dtVencimentoForm'] = this.formatarData(outorga.dataDeVencimento);
            this.listaOutorga.push(outorga);
          }
        });
      });
    }
    else if ((this.data_vencimento_ini) && (this.data_vencimento_fim))
    {
      gerar = await this.outorgas.forEach(outorga => {
        if ((outorga.dataDeVencimento >= this.data_vencimento_ini) && 
            (outorga.dataDeVencimento <= this.data_vencimento_fim))
        {
          this.clientes.forEach(cliente =>{
            if (cliente.id == outorga.clienteId)
            {
              outorga['nomeCliente'] = cliente.nome;
              outorga['dtVencimentoForm'] = this.formatarData(outorga.dataDeVencimento);
              this.listaOutorga.push(outorga);
            } 
          });
        }
      });
    }
    else
    {
      gerar = await this.outorgas.forEach(outorga => {
        this.clientes.forEach(cliente =>{
          if (cliente.id == outorga.clienteId)
          {
            outorga['nomeCliente'] = cliente.nome;
            outorga['dtVencimentoForm'] = this.formatarData(outorga.dataDeVencimento);
          this.listaOutorga.push(outorga);
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
          this.listaOutorga,
          ["nomeCliente","descricao", "dtVencimentoForm"],
          [
            { text: "Nome Cliente", style: "tableHeader" },
            { text: "Descricao", style: "tableHeader" },
            { text: "Data de Vencimento", style: "tableHeader"},
          
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
          { text: "Registros: "+this.listaOutorga.length},
          { text: ""},
        ]
      },

    };


    this.pdfObject = pdfMake.createPdf(docDefinition).open();

  }

}
