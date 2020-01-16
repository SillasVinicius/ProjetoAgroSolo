import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { DeclaracaoAmbiental } from '../../models/da.model';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';
import { UsuarioService } from 'src/app/core/services/usuario.service';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-lista-da-item',
  templateUrl: './lista-da-item.component.html',
  styleUrls: ['./lista-da-item.component.scss'],
})
export class ListaDaItemComponent implements OnInit {
  constructor(private iab: InAppBrowser, private usuarioService: UsuarioService, public alertController: AlertController){}

  data: Date = new Date();
  dia = this.data.getDate();
  mes = this.data.getMonth() + 1;
  ano = this.data.getFullYear();
  dataAtual = [this.mes, this.dia , this.ano].join('/');

  msgVencimento: string = ''
  cor: string = ''


  clicado: boolean = false;
  admin: boolean = false;
  @Input() declaracaoAmbiental: DeclaracaoAmbiental;
  @Output() update = new EventEmitter<DeclaracaoAmbiental>();
  @Output() delete = new EventEmitter<DeclaracaoAmbiental>();
  @Output() view = new EventEmitter<DeclaracaoAmbiental>();

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
    if (diasVenc === 30) {
      this.presentAlert('30');
    }
    if (diasVenc === 15) {
      this.presentAlert('15');
    }
  }

  openLink(){
    this.iab.create(`${this.declaracaoAmbiental.arquivo}`, `_system`);
  }

  abrir(){
    this.clicado = true;
  }

  fechar(){
    this.clicado = false;
  }

  async presentAlert(dias: string) {
     const alert = await this.alertController.create({
       header: 'AVISO',
       subHeader: 'Declaração Ambiental Irá Vencer!',
       message: `A Declaração Ambiental '${this.declaracaoAmbiental.descricao}' vence em ${dias} dias!`,
       buttons: ['OK']
     });

     await alert.present();
   }

  retornaDiasVencimento(): string{


    let dataInicialRecebida = new Date(this.declaracaoAmbiental.dataDeVencimento);
    let dataFinalFormatada = (dataInicialRecebida.getMonth() + 1) + "/" + (dataInicialRecebida.getDate()) + "/" + dataInicialRecebida.getFullYear();
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
