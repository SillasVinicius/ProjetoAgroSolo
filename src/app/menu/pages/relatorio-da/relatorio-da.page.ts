import { Component, OnInit, ViewChildren, QueryList, ElementRef } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { ClienteService } from 'src/app/core/services/cliente.service';
import { OverlayService } from 'src/app/core/services/overlay.service';
import { DaService } from 'src/app/core/services/da.service';
import { Cliente } from '../../models/cliente.model';
import { DeclaracaoAmbiental } from '../../models/da.model';
import { Observable } from 'rxjs';
import { take } from 'rxjs/operators';
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
pdfMake.vfs = pdfFonts.pdfMake.vfs;

@Component({
  selector: 'app-relatorio-da',
  templateUrl: './relatorio-da.page.html',
  styleUrls: ['./relatorio-da.page.scss'],
})
export class RelatorioDaPage implements OnInit {
  das$: Observable<DeclaracaoAmbiental[]>;
  clientes$: Observable<Cliente[]>;
  clientes: Cliente[] = [];
  das: DeclaracaoAmbiental[] = [];
  pdfObject: any;
  id_cli: String;
  data_vencimento_ini: String; 
  data_vencimento_fim: String;
  @ViewChildren('filter') filtrosRelatorio: QueryList<any>;

  constructor(
    private ModalController: ModalController,
    private clienteService: ClienteService,
    private DaService: DaService,
    private overlayService: OverlayService
  ) { }

  listaDa: Array<any> = [];

  async ngOnInit(): Promise<void> {
    const loading = await this.overlayService.loading(); 
    this.clienteService.init();
    this.clientes$ = this.clienteService.getAll();
    this.clientes$.pipe(take(1)).subscribe(() => loading.dismiss());

    this.clienteService.getAll().subscribe((c: Cliente[]) => {
      for (let i = 0; i < c.length; i++) {
          this.clientes[i] = c[i];
      }
    });

    this.DaService.getAll().subscribe((d: DeclaracaoAmbiental[]) => {
      for (let i = 0; i < d.length; i++) {
          this.das[i] = d[i];
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

  async relatorio_da()
  {
    let gerar: any;
    const loading = await this.overlayService.loading(); 
    this.listaDa = [];

    if (!(this.data_vencimento_ini) && (this.data_vencimento_fim))
    {
      await this.overlayService.toast({
        message: "Informar data inicial do intervalo, relacionado com data de Aprovação!"
      });
      loading.remove();
      return;
    }

    if ((this.data_vencimento_ini) && !(this.data_vencimento_fim))
    {
      await this.overlayService.toast({
        message: "Informar data final do intervalo, relacionado com data de Aprovação!"
      });
      loading.remove();
      return;
    }

    if (this.data_vencimento_ini > this.data_vencimento_fim)
    {
      await this.overlayService.toast({
        message: "Data inicial não pode ser maior que data final!"
      });
      loading.remove();
      return;
    }

    if ((this.id_cli) && (this.data_vencimento_ini) && (this.data_vencimento_fim))
    {
      gerar = await this.das.forEach(da => {
        if ((da.dataDeVencimento >= this.data_vencimento_ini) && 
            (da.dataDeVencimento <= this.data_vencimento_fim))
        {
          this.clientes.forEach(cliente =>{
            if (cliente.id == this.id_cli)
            {
              da['nomeCliente'] = cliente.nome;
              da['dtVencimentoForm'] = this.formatarData(da.dataDeVencimento);
              this.listaDa.push(da);
            }
          }); 
        }
      });
    }
    else if (this.id_cli) 
    {
      gerar = await this.das.forEach(da => {
        this.clientes.forEach(cliente =>{
          if ((cliente.id == this.id_cli) && (cliente.id == da.clienteId))
          {
            da['nomeCliente'] = cliente.nome;
            da['dtVencimentoForm'] = this.formatarData(da.dataDeVencimento);
            this.listaDa.push(da);
          }
        });
      });
    }
    else if ((this.data_vencimento_ini) && (this.data_vencimento_fim))
    {
      gerar = await this.das.forEach(da => {
        if ((da.dataDeVencimento >= this.data_vencimento_ini) && 
            (da.dataDeVencimento <= this.data_vencimento_fim))
        {
          this.clientes.forEach(cliente =>{
            if (cliente.id == da.clienteId)
            {
              da['nomeCliente'] = cliente.nome;
              da['dtVencimentoForm'] = this.formatarData(da.dataDeVencimento);
              this.listaDa.push(da);
            } 
          });
        }
      });
    }
    else
    {
      gerar = await this.das.forEach(da => {
        this.clientes.forEach(cliente =>{
          if (cliente.id == da.clienteId)
          {
            da['nomeCliente'] = cliente.nome;
            da['dtVencimentoForm'] = this.formatarData(da.dataDeVencimento);
          this.listaDa.push(da);
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
        widths: [300, 480, 200],
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
                alignment: "center" ,
                color: "#00643a"
                
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
          this.listaDa,
          ["nomeCliente", "descricao", "ddtVencimentoForm"],
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
          { text: "Registros: "+this.listaDa.length},
          { text: ""},
        ]
      },

    };


    this.pdfObject = pdfMake.createPdf(docDefinition).open();

  }

}
