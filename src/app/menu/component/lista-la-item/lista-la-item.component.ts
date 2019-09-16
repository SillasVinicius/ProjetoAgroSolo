import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { LicencaAmbiental } from '../../models/la.model';

@Component({
  selector: 'app-lista-la-item',
  templateUrl: './lista-la-item.component.html',
  styleUrls: ['./lista-la-item.component.scss'],
})
export class ListaLaItemComponent implements OnInit {

  data: Date = new Date();
  dia = this.data.getDate();
  mes = this.data.getMonth() + 1;
  ano = this.data.getFullYear();
  dataAtual = [this.mes, this.dia , this.ano].join('/');

  msgVencimento: string = ''
  cor: string = ''

  clicado: boolean = false;
  @Input() licencaAmbiental: LicencaAmbiental;
  @Output() update = new EventEmitter<LicencaAmbiental>();
  @Output() delete = new EventEmitter<LicencaAmbiental>();

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
  }

  abrir(){
    this.clicado = true;
  }

  fechar(){
    this.clicado = false;
  }

  retornaDiasVencimento(): string{


    let dataInicialRecebida = new Date(this.licencaAmbiental.dataDeVencimento);
    let dataFinalFormatada = (dataInicialRecebida.getMonth() + 1) + "/" + (dataInicialRecebida.getDate() + 1) + "/" + dataInicialRecebida.getFullYear();
    let dataInicialFormatada = this.dataAtual;


    //console.log(dataInicialFormatada + " - " + dataFinalFormatada);

    var dataInicialMilissegundos = new Date(dataInicialFormatada).getTime();
    var dataFinalMilissegundos = new Date(dataFinalFormatada).getTime();

    //console.log(dataInicialMilissegundos + ' - ' + dataFinalMilissegundos);

    // Transforme 1 dia em milissegundos
    var umDiaMilissegundos = 1000*60*60*24;

    // Calcule a diferença em milissegundos
    var diferencaMilissegundos = dataFinalMilissegundos  - dataInicialMilissegundos;

    // Converta novamente para data
    var diferencaData = Math.round(diferencaMilissegundos/umDiaMilissegundos);

    return ""+diferencaData;
  }

}
