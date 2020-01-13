import { Component, OnInit} from '@angular/core';
import { ModalController } from '@ionic/angular';
import { ClienteService } from 'src/app/core/services/cliente.service';
import { OverlayService } from 'src/app/core/services/overlay.service';
import { CreditoService } from 'src/app/core/services/credito.service';
import { Cliente } from '../../models/cliente.model';
import { Credito } from '../../models/credito.model';
import { Observable } from 'rxjs';
import { take, isEmpty } from 'rxjs/operators';
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
pdfMake.vfs = pdfFonts.pdfMake.vfs;

@Component({
  selector: 'app-relatorio-credito',
  templateUrl: './relatorio-credito.page.html',
  styleUrls: ['./relatorio-credito.page.scss'],
})
export class RelatorioCreditoPage implements OnInit {
  das$: Observable<Credito[]>;
  clientes$: Observable<Cliente[]>;
  clientes: Cliente[] = [];
  creditos: Credito[] = [];
  pdfObject: any;
  id_cli: String;
  data_aprovacao_ini: String; 
  data_aprovacao_fim: String;
  data_expiracao_ini: String; 
  data_expiracao_fim: String;

  constructor(
    private ModalController: ModalController,
    private clienteService: ClienteService,
    private CreditoService: CreditoService,
    private overlayService: OverlayService
  ) { }

  listaCredito: Array<any> = [];  

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

    this.CreditoService.getAll().subscribe((c: Credito[]) => {
      for (let i = 0; i < c.length; i++) {
          this.creditos[i] = c[i];
      }
    });

  }

  async closeModal(){
    await this.ModalController.dismiss();
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

  async obter_dt_aprovacao_cliente_ini(dt_aprovacao_ini: String){
    this.data_aprovacao_ini = dt_aprovacao_ini;
  }

  async obter_dt_aprovacao_cliente_fim(dt_aprovacao_fim: String){
    this.data_aprovacao_fim = dt_aprovacao_fim;
  }
  
  async obter_dt_expiracao_cliente_ini(dt_expiracao_ini: String){
    this.data_expiracao_ini = dt_expiracao_ini;
  }

  async obter_dt_expiracao_cliente_fim(dt_expiracao_fim: String){
    this.data_expiracao_fim = dt_expiracao_fim;
  }

  async relatorio_credito()
  {
    let gerar: any;
    const loading = await this.overlayService.loading(); 
    this.listaCredito = [];
   

    if (this.data_aprovacao_ini > this.data_aprovacao_fim)
    {
      alert("Data inicial de aprovação não pode ser maior que data final de aprovação!");
      loading.remove();
      return;
    }

    if (!(this.data_aprovacao_ini) && (this.data_aprovacao_fim))
    {
      alert("Informar data inicial de Aprovação!");
      loading.remove();
      return;
    }

    if ((this.data_aprovacao_ini) && !(this.data_aprovacao_fim))
    {
      alert("Informar data final de Aprovação!");
      loading.remove();
      return;
    }

    if (this.data_expiracao_ini > this.data_expiracao_fim)
    {
      alert("Data inicial de expiração não pode ser maior que data final de expiração!");
      loading.remove();
      return;
    }

    if (!(this.data_expiracao_ini) && (this.data_expiracao_fim))
    {
      alert("Informar data inicial de expiração!");
      loading.remove();
      return;
    }

    if ((this.data_expiracao_ini) && !(this.data_expiracao_fim))
    {
      alert("Informar data final de expiração!");
      loading.remove();
      return;
    }

    if ((this.id_cli) && 
        (this.data_aprovacao_ini) && (this.data_aprovacao_fim) &&
        (this.data_expiracao_ini) && (this.data_expiracao_fim))
    {
      gerar = await this.creditos.forEach(credito => {
        if ((credito.dataAprovacaoCredito >= this.data_aprovacao_ini) && 
            (credito.dataAprovacaoCredito <= this.data_aprovacao_fim))
        {
          this.clientes.forEach(cliente =>{
            if ((cliente.id == this.id_cli) && (cliente.id == credito.clienteId))
            {
              credito['nomeCliente'] = cliente.nome;
              credito['dtAprovacaoForm'] = this.formatarData(credito.dataAprovacaoCredito);
              credito['dtExpiracaoForm'] = this.formatarData(credito.dataExpiracaoCredito);
              this.listaCredito.push(credito);
            }
          });
        }
        else
        if ((credito.dataExpiracaoCredito >= this.data_expiracao_ini) && 
            (credito.dataExpiracaoCredito <= this.data_expiracao_fim))
        {
          this.clientes.forEach(cliente =>{
            if ((cliente.id == this.id_cli) && (cliente.id == credito.clienteId))
            {
              credito['nomeCliente'] = cliente.nome;
              credito['dtAprovacaoForm'] = this.formatarData(credito.dataAprovacaoCredito);
              credito['dtExpiracaoForm'] = this.formatarData(credito.dataExpiracaoCredito);
              this.listaCredito.push(credito);
            }
          });
        }

      
      });
    }
    else
    if ((this.id_cli) && (this.data_aprovacao_ini) && (this.data_aprovacao_fim))
    { 
      gerar = await this.creditos.forEach(credito => {
        if ((credito.dataAprovacaoCredito >= this.data_aprovacao_ini) && 
            (credito.dataAprovacaoCredito <= this.data_aprovacao_fim))
        {
          this.clientes.forEach(cliente =>{
            if ((cliente.id == this.id_cli) && (cliente.id == credito.clienteId))
            {
              credito['nomeCliente'] = cliente.nome;
              credito['dtAprovacaoForm'] = this.formatarData(credito.dataAprovacaoCredito);
              credito['dtExpiracaoForm'] = this.formatarData(credito.dataExpiracaoCredito);
              this.listaCredito.push(credito);
            }
          });
        }      
      });
    }
    else
    if ((this.id_cli) && (this.data_expiracao_ini) && (this.data_expiracao_fim))
    {
      gerar = await this.creditos.forEach(credito => {        
        if ((credito.dataExpiracaoCredito >= this.data_expiracao_ini) && 
            (credito.dataExpiracaoCredito <= this.data_expiracao_fim))
        {
          this.clientes.forEach(cliente =>{
            if ((cliente.id == this.id_cli) && (cliente.id == credito.clienteId))
            {
              credito['nomeCliente'] = cliente.nome;
              credito['dtAprovacaoForm'] = this.formatarData(credito.dataAprovacaoCredito);
              credito['dtExpiracaoForm'] = this.formatarData(credito.dataExpiracaoCredito);
              this.listaCredito.push(credito);
            }
          });
        }
      });
    }
    else if (this.id_cli)
    {
      gerar = await this.creditos.forEach(credito => {
        this.clientes.forEach(cliente =>{
          if ((cliente.id == this.id_cli) && (cliente.id == credito.clienteId))
          {
            credito['nomeCliente'] = cliente.nome;
            credito['dtAprovacaoForm'] = this.formatarData(credito.dataAprovacaoCredito);
            credito['dtExpiracaoForm'] = this.formatarData(credito.dataExpiracaoCredito);
            this.listaCredito.push(credito);
          }
        });
      });  
    }
    else  
    if ((this.data_aprovacao_ini) && (this.data_aprovacao_fim))
    {
      gerar = await this.creditos.forEach(credito => {
        if ((credito.dataAprovacaoCredito >= this.data_aprovacao_ini) && 
            (credito.dataAprovacaoCredito <= this.data_aprovacao_fim))
        {
          this.clientes.forEach(cliente =>{
            if (cliente.id == credito.clienteId)
            {
              credito['nomeCliente'] = cliente.nome;
              credito['dtAprovacaoForm'] = this.formatarData(credito.dataAprovacaoCredito);
              credito['dtExpiracaoForm'] = this.formatarData(credito.dataExpiracaoCredito);
              this.listaCredito.push(credito);
            }
          });
        }      
      });
    }
    else
    if ((this.data_expiracao_ini) && (this.data_expiracao_fim))
    {
      gerar = await this.creditos.forEach(credito => {        
        if ((credito.dataExpiracaoCredito >= this.data_expiracao_ini) && 
            (credito.dataExpiracaoCredito <= this.data_expiracao_fim))
        {
          this.clientes.forEach(cliente =>{
            if (cliente.id == credito.clienteId)
            {
              credito['nomeCliente'] = cliente.nome;
              credito['dtAprovacaoForm'] = this.formatarData(credito.dataAprovacaoCredito);
              credito['dtExpiracaoForm'] = this.formatarData(credito.dataExpiracaoCredito);
              this.listaCredito.push(credito);
            }
          });
        }
      });
    }
    else
    {
      gerar = await this.creditos.forEach(credito => { 
        this.clientes.forEach(cliente =>{
          if (cliente.id == credito.clienteId)
          {
            credito['nomeCliente'] = cliente.nome;
            credito['dtAprovacaoForm'] = this.formatarData(credito.dataAprovacaoCredito);
            credito['dtExpiracaoForm'] = this.formatarData(credito.dataExpiracaoCredito);
            this.listaCredito.push(credito);
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
        widths: [100, 100, 100, 100, 100],
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
                text: "AgroSolo",
                fontSize: 18,
                bold: true,      
                alignment: "center",
                color: "#1a744e"
              },
              
            ],
            width: '*'
          }
        ],
        margin: [10, 10]
      },

      pageOrientation: 'landscape',
      pageSize: {height: 850, width: 1100},
      content: 
      [
        this.table(
          this.listaCredito,
          ["nomeCliente", "descricao", "valorCredito", "dtAprovacaoForm", "dtExpiracaoForm"],
          [
            { text: "Nome Cliente", style: "tableHeader" },
            { text: "Descrição", style: "tableHeader" },
            { text: "Valor do Crédito", style: "tableHeader" },
            { text: "Data de Aprovação", style: "tableHeader" },
            { text: "Data de Expiração", style: "tableHeader" },
          
          ]
        )
      ],
      styles:
      {
        tableHeader: {
          bold:true,
          fontSize: 11,
          color: "Black" ,
          center: true
                                
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
          { text: "Registros: "+this.listaCredito.length},
          { text: ""},
        ]
      },

    };


    this.pdfObject = pdfMake.createPdf(docDefinition).open();

  }


}
