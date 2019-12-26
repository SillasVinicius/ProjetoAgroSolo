import { Component, OnInit, Input } from '@angular/core';
import { NavController } from '@ionic/angular';
import { UsuarioService } from 'src/app/core/services/usuario.service';
import { ClienteService } from 'src/app/core/services/cliente.service';
import { Cliente } from '../../models/cliente.model';
import { Observable } from 'rxjs';
import { take } from 'rxjs/operators';
import { OverlayService } from 'src/app/core/services/overlay.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss']
})
export class HomePage implements OnInit {
  clientes$: Observable<Cliente[]>;

  data: Date = new Date();
  dia = this.data.getDate();
  mes = this.data.getMonth() + 1;
  ano = this.data.getFullYear();
  // variaveis para saber os aniversáriantes do mês
  dataAtual = [this.mes, this.dia].join('/');
  mesAtual = parseInt([this.mes].join(''));
  aniversariantesMes: Array<any> = [];
  quantidadeAniversariantesMes: Array<any> = [];

  @Input() cliente: Cliente;

  nomeUser = '...';
  urlFoto = '...';
  admin = false;
  constructor(
    private usuario: UsuarioService,
    private navCtrl: NavController,
    private overlayService: OverlayService,
    private clienteService: ClienteService
  ) {}
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
  linkOutorgas(){
    this.navCtrl.navigateForward('/menu/outorga')
  }
  linkAmbientais(){
    this.navCtrl.navigateForward("/menu/LicencaAmbiental")
  }
  linkDeclaracoes(){
    this.navCtrl.navigateForward("/menu/DeclaracaoAmbiental")
  }





  async ngOnInit() {
    this.nomeUser = this.usuario.nomeUser;
    this.urlFoto = this.usuario.urlFoto;
    this.admin = this.usuario.admin;

    const loading = await this.overlayService.loading();
    this.clienteService.initCliente();
    this.clientes$ = this.clienteService.getAll();
    this.clientes$.pipe(take(1)).subscribe(() => loading.dismiss());

    this.retornaDiasVencimento();
  }

  async retornaDiasVencimento() {

    this.clientes$.forEach(element => {

      console.log('Cliente');
      this.aniversariantesMes = [];
      this.quantidadeAniversariantesMes = [];
      let nomesAniversariantesDia: Array<any> = [];
      let qtdNiverMes: any = 0;
      let qtdArray: Array<any> = [];

      element.forEach(cli => {
        console.log(cli.dataNascimento);  
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
        var umDiaMilissegundos = 1000*60*60*24;

        // Calcule a diferença em milissegundos
        var diferencaMilissegundos = dataFinalMilissegundos  - dataInicialMilissegundos;

        // Converta novamente para data
        var diferencaData = Math.round(diferencaMilissegundos/umDiaMilissegundos);

        console.log(diferencaData);

        if (diferencaData == 0) {
          nomesAniversariantesDia.push(cli.nome);
        }

        if (this.mesAtual == dataMesAtualNiver && diferencaData >= 0) {
          console.log('54541541')
          qtdNiverMes = qtdNiverMes + 1;
          qtdArray.push(qtdNiverMes);
        }
      });

      this.aniversariantesMes.push(nomesAniversariantesDia);
      this.quantidadeAniversariantesMes = qtdArray;
      console.log(this.aniversariantesMes, '------', this.quantidadeAniversariantesMes);
    });
  }
}
