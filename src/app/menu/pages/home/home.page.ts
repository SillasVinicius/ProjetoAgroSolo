import { Component, OnInit, Input } from '@angular/core';
import { NavController } from '@ionic/angular';
import { UsuarioService } from 'src/app/core/services/usuario.service';
import { ClienteService } from 'src/app/core/services/cliente.service';
import { Cliente } from '../../models/cliente.model';
import { Credito } from '../../models/credito.model';
import { CreditoService } from 'src/app/core/services/credito.service';
import { Observable } from 'rxjs';
import { take } from 'rxjs/operators';
import { OverlayService } from 'src/app/core/services/overlay.service';
import { Outorga } from '../../models/outorga.model';
import { OutorgaService } from 'src/app/core/services/outorga.service';
import { LicencaAmbiental } from '../../models/la.model';
import { LaService } from 'src/app/core/services/la.service';
import { DeclaracaoAmbiental } from '../../models/da.model';
import { DaService } from 'src/app/core/services/da.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss']
})
export class HomePage implements OnInit {
  clientes$: Observable<Cliente[]>;
  outorgas$: Observable<Outorga[]>;
  licencasAmbientais$: Observable<LicencaAmbiental[]>;
  das$: Observable<DeclaracaoAmbiental[]>;
  cadastrosDeCreditos$: Observable<Credito[]>;

  data: Date = new Date();
  dia = this.data.getDate();
  mes = this.data.getMonth() + 1;
  ano = this.data.getFullYear();
  // variaveis para saber os aniversáriantes do mês
  dataAtual = [this.mes, this.dia,].join('/');
  dataAtualAno = [this.mes, this.dia, this.ano].join('/');
  mesAtual = parseInt([this.mes].join(''));
  aniversariantesMes: Array<any> = [];
  outorgas15Dias: Array<any> = [];
  outorgas30Dias: Array<any> = [];
  la15Dias: Array<any> = [];
  la60Dias: Array<any> = [];
  la130Dias: Array<any> = [];
  da15Dias: Array<any> = [];
  da30Dias: Array<any> = [];
  credito15Dias: Array<any> = [];
  credito30Dias: Array<any> = [];
  credito130Dias: Array<any> = [];
  testeOutorga: Array<any> = [];
  quantidadeAniversariantesMes: Array<any> = [];

  nomeUser = '...';
  urlFoto = '...';
  admin = false;
  constructor(
    private usuario: UsuarioService,
    private navCtrl: NavController,
    private overlayService: OverlayService,
    private clienteService: ClienteService,
    private outorgaService: OutorgaService,
    private licencaAmbientalService: LaService,
    private daService: DaService,
    private creditoService: CreditoService
  ) { }
  linkCliente() {
    this.navCtrl.navigateForward('/menu/cliente');
  }
  linkDadosPessoais() {
    this.navCtrl.navigateForward('/menu/dadosPessoais');
  }
  linkAmbiental() {
    this.navCtrl.navigateForward('/menu/ambiental');
  }
  linkUsuarios() {
    this.navCtrl.navigateForward('/menu/usuario');
  }
  linkAlterarUsuario() {
    this.navCtrl.navigateForward(`/menu/updateUsuario/${this.usuario.id}`);
  }
  linkOutorgas() {
    this.navCtrl.navigateForward('/menu/outorga')
  }
  linkAmbientais() {
    this.navCtrl.navigateForward("/menu/LicencaAmbiental")
  }
  linkDeclaracoes() {
    this.navCtrl.navigateForward("/menu/DeclaracaoAmbiental")
  }
  linkCredito() {
    this.navCtrl.navigateForward("menu/listaCreditoFinanceiro")
  }

  async ngOnInit() {
    this.nomeUser = this.usuario.nomeUser;
    this.urlFoto = this.usuario.urlFoto;
    this.admin = this.usuario.admin;

    const loading = await this.overlayService.loading();

    if (this.admin) {
      this.clienteService.init();
      this.clientes$ = this.clienteService.getAll();
      this.clientes$.pipe(take(1)).subscribe(() => loading.dismiss());

      this.outorgaService.init();
      this.outorgas$ = this.outorgaService.getAll();
      this.outorgas$.pipe(take(1)).subscribe(() => loading.dismiss());


      this.licencaAmbientalService.init();
      this.licencasAmbientais$ = this.licencaAmbientalService.getAll();
      this.licencasAmbientais$.pipe(take(1)).subscribe(() => loading.dismiss());

      this.daService.init();
      this.das$ = this.daService.getAll();
      this.das$.pipe(take(1)).subscribe(() => loading.dismiss());

      this.creditoService.init();
      this.cadastrosDeCreditos$ = this.creditoService.getAll();
      this.cadastrosDeCreditos$.pipe(take(1)).subscribe(() => loading.dismiss());

      this.retornaDiasVencimento();
      this.vencimento(this.outorgas$, 'outorga');
      this.vencimento(this.licencasAmbientais$, 'la');
      this.vencimento(this.das$, 'da');
      this.vencimento(this.cadastrosDeCreditos$, "cadastroCredito");
    } else {
      this.outorgaService.init();
      this.outorgas$ = this.outorgaService.buscaOutorgasClientes(this.usuario.id);
      this.outorgas$.pipe(take(1)).subscribe(() => loading.dismiss());

      this.licencaAmbientalService.init();
      this.licencasAmbientais$ = this.licencaAmbientalService.buscaLaClientes(this.usuario.id);
      this.licencasAmbientais$.pipe(take(1)).subscribe(() => loading.dismiss());

      this.daService.init();
      this.das$ = this.daService.buscaDeclaracoesClientes(this.usuario.id);
      this.das$.pipe(take(1)).subscribe(() => loading.dismiss());

      this.creditoService.init();
      this.cadastrosDeCreditos$ = this.creditoService.buscaCreditoClientes(this.usuario.id);
      this.cadastrosDeCreditos$.pipe(take(1)).subscribe(() => loading.dismiss());

    }
  }

  async retornaDiasVencimento() {

    this.clientes$.forEach(element => {

      this.aniversariantesMes = [];
      this.quantidadeAniversariantesMes = [];
      let nomesAniversariantesDia: Array<any> = [];
      let qtdNiverMes: any = 0;
      let qtdArray: Array<any> = [];

      element.forEach(cli => {
        //console.log(cli.dataNascimento);  
        let dataInicialRecebida = new Date(cli.dataNascimento);
        let dataFinalFormatada = (dataInicialRecebida.getMonth() + 1) + "/" + (dataInicialRecebida.getDate());
        let dataInicialFormatada = this.dataAtual;

        let dataMesAtualNiver = (dataInicialRecebida.getMonth() + 1);
        // console.log('mes', dataMesAtualNiver, ' atual  ', this.mesAtual);


        //console.log(dataInicialFormatada + " - " + dataFinalFormatada);

        var dataInicialMilissegundos = new Date(dataInicialFormatada).getTime();
        var dataFinalMilissegundos = new Date(dataFinalFormatada).getTime();

        //console.log(dataInicialMilissegundos + ' - ' + dataFinalMilissegundos);

        // Transforme 1 dia em milissegundos
        var umDiaMilissegundos = 1000 * 60 * 60 * 24;

        // Calcule a diferença em milissegundos
        var diferencaMilissegundos = dataFinalMilissegundos - dataInicialMilissegundos;

        // Converta novamente para data
        var diferencaData = Math.round(diferencaMilissegundos / umDiaMilissegundos);

        //console.log(diferencaData);

        if (diferencaData == 0) {
          nomesAniversariantesDia.push(cli);
        }

        if (this.mesAtual == dataMesAtualNiver) {
          qtdNiverMes = qtdNiverMes + 1;
          qtdArray.push(qtdNiverMes);
        }
      });

      this.aniversariantesMes = nomesAniversariantesDia;
      this.quantidadeAniversariantesMes = qtdArray;
      //console.log(this.aniversariantesMes, '------', this.quantidadeAniversariantesMes);
    });
  }

  async vencimento(listaCadastrosAmbientais, painel) {

    listaCadastrosAmbientais.forEach(vencimentos => {
      if (painel === 'outorga') {
        this.outorgas15Dias = [];
        this.outorgas30Dias = [];
      }
      if (painel === 'la') {
        this.la15Dias = [];
        this.la60Dias = [];
        this.la130Dias = [];
      }
      if (painel === "da") {
        this.da15Dias = [];
        this.da30Dias = [];
      }
      if (painel === "cadastroCredito") {
        this.credito15Dias = [];
        this.credito30Dias = [];
        this.credito130Dias = [];
      }

      vencimentos.forEach(venci => {

        let dataInicialRecebida = new Date(venci.dataDeVencimento);
        let dataFinalFormatada = (dataInicialRecebida.getMonth() + 1) + "/" + dataInicialRecebida.getDate() + "/" + dataInicialRecebida.getFullYear();
        let dataInicialFormatada = this.dataAtualAno;

        var dataInicialMilissegundos = new Date(dataInicialFormatada).getTime();
        var dataFinalMilissegundos = new Date(dataFinalFormatada).getTime();

        // Transforme 1 dia em milissegundos
        var umDiaMilissegundos = 1000 * 60 * 60 * 24;

        // Calcule a diferença em milissegundos
        var diferencaMilissegundos = dataFinalMilissegundos - dataInicialMilissegundos;

        // Converta novamente para data
        var diferencaData = Math.round(diferencaMilissegundos / umDiaMilissegundos);

        if (diferencaData <= 15) {
          if (painel === 'outorga') {
            this.outorgas15Dias.push(venci);
          }
          if (painel === 'la') {
            this.la15Dias.push(venci);
          }
          if (painel === 'da') {
            this.da15Dias.push(venci);
          }
          if (painel === 'cadastroCredito') {
            this.credito15Dias.push(venci);
          }
        }
        if (diferencaData > 15 && diferencaData <= 30) {
          if (painel === 'outorga') {
            this.outorgas30Dias.push(venci);
          }
          if (painel === 'da') {
            this.da30Dias.push(venci);
          }
          if (painel === 'cadastroCredito') {
            this.credito30Dias.push(venci);
          }
        }
        if (diferencaData > 30 && diferencaData <= 60) {
          if (painel === 'la') {
            this.la60Dias.push(venci);
          }
        }
        if (diferencaData > 60 && diferencaData <= 130) {
          if (painel === 'la') {
            this.la130Dias.push(venci);
          }
          if (painel === 'cadastroCredito') {
            this.credito130Dias.push(venci);
          }
        }

      });
    });

  }
}
