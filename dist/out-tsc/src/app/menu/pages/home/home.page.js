import * as tslib_1 from "tslib";
import { Component, Input } from '@angular/core';
import { NavController } from '@ionic/angular';
import { UsuarioService } from 'src/app/core/services/usuario.service';
import { ClienteService } from 'src/app/core/services/cliente.service';
import { take } from 'rxjs/operators';
import { OverlayService } from 'src/app/core/services/overlay.service';
var HomePage = /** @class */ (function () {
    function HomePage(usuario, navCtrl, overlayService, clienteService) {
        this.usuario = usuario;
        this.navCtrl = navCtrl;
        this.overlayService = overlayService;
        this.clienteService = clienteService;
        this.data = new Date();
        this.dia = this.data.getDate();
        this.mes = this.data.getMonth() + 1;
        this.ano = this.data.getFullYear();
        // variaveis para saber os aniversáriantes do mês
        this.dataAtual = [this.mes, this.dia].join('/');
        this.mesAtual = parseInt([this.mes].join(''));
        this.aniversariantesMes = [];
        this.quantidadeAniversariantesMes = [];
        this.nomeUser = '...';
        this.urlFoto = '...';
        this.admin = false;
    }
    HomePage.prototype.linkCliente = function () {
        this.navCtrl.navigateForward('/menu/cliente');
    };
    HomePage.prototype.linkDadosPessoais = function () {
        this.navCtrl.navigateForward('/menu/dadosPessoais');
    };
    HomePage.prototype.linkAmbiental = function () {
        this.navCtrl.navigateForward('/menu/ambiental');
    };
    HomePage.prototype.linkUsuarios = function () {
        this.navCtrl.navigateForward('/menu/usuario');
    };
    HomePage.prototype.linkAlterarUsuario = function () {
        this.navCtrl.navigateForward("/menu/updateUsuario/" + this.usuario.id);
    };
    HomePage.prototype.linkOutorgas = function () {
        this.navCtrl.navigateForward('/menu/outorga');
    };
    HomePage.prototype.linkAmbientais = function () {
        this.navCtrl.navigateForward("/menu/LicencaAmbiental");
    };
    HomePage.prototype.linkDeclaracoes = function () {
        this.navCtrl.navigateForward("/menu/DeclaracaoAmbiental");
    };
    HomePage.prototype.ngOnInit = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var loading;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.nomeUser = this.usuario.nomeUser;
                        this.urlFoto = this.usuario.urlFoto;
                        this.admin = this.usuario.admin;
                        return [4 /*yield*/, this.overlayService.loading()];
                    case 1:
                        loading = _a.sent();
                        this.clienteService.initCliente();
                        this.clientes$ = this.clienteService.getAll();
                        this.clientes$.pipe(take(1)).subscribe(function () { return loading.dismiss(); });
                        this.retornaDiasVencimento();
                        return [2 /*return*/];
                }
            });
        });
    };
    HomePage.prototype.retornaDiasVencimento = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var _this = this;
            return tslib_1.__generator(this, function (_a) {
                this.clientes$.forEach(function (element) {
                    console.log('Cliente');
                    _this.aniversariantesMes = [];
                    _this.quantidadeAniversariantesMes = [];
                    var nomesAniversariantesDia = [];
                    var qtdNiverMes = 0;
                    var qtdArray = [];
                    element.forEach(function (cli) {
                        console.log(cli.dataNascimento);
                        var dataInicialRecebida = new Date(cli.dataNascimento);
                        var dataFinalFormatada = (dataInicialRecebida.getMonth() + 1) + "/" + (dataInicialRecebida.getDate());
                        var dataInicialFormatada = _this.dataAtual;
                        var dataMesAtualNiver = (dataInicialRecebida.getMonth() + 1);
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
                        console.log(diferencaData);
                        if (diferencaData == 0) {
                            nomesAniversariantesDia.push(cli.nome);
                        }
                        if (_this.mesAtual == dataMesAtualNiver && diferencaData >= 0) {
                            console.log('54541541');
                            qtdNiverMes = qtdNiverMes + 1;
                            qtdArray.push(qtdNiverMes);
                        }
                    });
                    _this.aniversariantesMes.push(nomesAniversariantesDia);
                    _this.quantidadeAniversariantesMes = qtdArray;
                    console.log(_this.aniversariantesMes, '------', _this.quantidadeAniversariantesMes);
                });
                return [2 /*return*/];
            });
        });
    };
    tslib_1.__decorate([
        Input(),
        tslib_1.__metadata("design:type", Object)
    ], HomePage.prototype, "cliente", void 0);
    HomePage = tslib_1.__decorate([
        Component({
            selector: 'app-home',
            templateUrl: './home.page.html',
            styleUrls: ['./home.page.scss']
        }),
        tslib_1.__metadata("design:paramtypes", [UsuarioService,
            NavController,
            OverlayService,
            ClienteService])
    ], HomePage);
    return HomePage;
}());
export { HomePage };
//# sourceMappingURL=home.page.js.map