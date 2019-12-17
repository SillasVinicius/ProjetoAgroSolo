import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';
import { UsuarioService } from 'src/app/core/services/usuario.service';
import { AlertController } from '@ionic/angular';

import { Credito } from '../../models/credito.model';


@Component({
  selector: 'app-lista-credito-item',
  templateUrl: './lista-credito-item.component.html',
  styleUrls: ['./lista-credito-item.component.scss'],
})
export class ListaCreditoItemComponent implements OnInit {

  constructor(private iab: InAppBrowser, private usuarioService: UsuarioService, public alertController: AlertController) { }

  data: Date = new Date();
  dia = this.data.getDate();
  mes = this.data.getMonth() + 1;
  ano = this.data.getFullYear();
  dataAtual = [this.mes, this.dia , this.ano].join('/');

  msgVencimento: string = ''
  cor: string = ''

  clicado: boolean = false;
  admin: boolean = false;
  @Input() cadastroCreditoFinanceiro: Credito;
  @Output() update = new EventEmitter<Credito>();
  @Output() delete = new EventEmitter<Credito>();

  ngOnInit(){
    this.clicado = false;
    let diasVenc: number = Number.parseInt(this.retornaDiasVencimento());
    if (diasVenc === 0) {
        this.msgVencimento = "Vence hoje!";
        this.cor = 'danger';
    }
    else if (diasVenc > 0) {
        this.msgVencimento = `Vence em ${diasVenc} dias!`;
        if (diasVenc === 1) {
          this.cor = 'danger';
        }
        else if (diasVenc <= 5) {
          this.cor = 'warning';
        }
        else{
          this.cor = 'success';
        }
    }
    else {
      let diasSemMenos = this.retornaDiasVencimento().replace('-','');
      this.msgVencimento = `Venceu a ${diasSemMenos} dias!`;
      this.cor = 'danger';
    }
    if (this.usuarioService.admin) {
      this.admin = true;
    }
    else {
      this.admin = false;
    }
    if (diasVenc === 130) {
      this.presentAlert('130');
    }
    if (diasVenc === 60) {
      this.presentAlert('60');
    }
    if (diasVenc === 15) {
      this.presentAlert('15');
    }
  }

  async presentAlert(dias: string) {
     const alert = await this.alertController.create({
       header: 'AVISO',
       subHeader: 'Limite de Crédito Irá Vencer!',
       message: `O Limite de Crédito'${this.cadastroCreditoFinanceiro.valorCredito}' vence em ${dias} dias!`,
       buttons: ['OK']
     });

     await alert.present();
   }

  abrir(){
    this.clicado = true;
  }

  fechar(){
    this.clicado = false;
  }

  openLink(){
    this.iab.create(`${this.cadastroCreditoFinanceiro.arquivo}`, `_system`);
  }

  retornaDiasVencimento(): string{


    let dataAprovacaoCredito = new Date(this.cadastroCreditoFinanceiro.dataExpiracaoCredito);
    let dataExpiracaoFormatada = (dataAprovacaoCredito.getMonth() + 1) + "/" + (dataAprovacaoCredito.getDate() + 1) + "/" + dataAprovacaoCredito.getFullYear();
    let dataAprovacaoCreditoFormatada = this.dataAtual;


    //console.log(dataInicialFormatada + " - " + dataFinalFormatada);

    var dataAprovacaoCreditoMilissegundos = new Date(dataAprovacaoCredito).getTime();
    var dataExpiracaoMilissegundos = new Date(dataExpiracaoFormatada).getTime();

    //console.log(dataInicialMilissegundos + ' - ' + dataFinalMilissegundos);

    // Transforme 1 dia em milissegundos
    var umDiaMilissegundos = 1000*60*60*24;

    // Calcule a diferença em milissegundos
    var diferencaMilissegundos = dataExpiracaoMilissegundos  - dataAprovacaoCreditoMilissegundos;

    // Converta novamente para data
    var diferencaData = Math.round(diferencaMilissegundos/umDiaMilissegundos);

    return ""+diferencaData;
  }

}
