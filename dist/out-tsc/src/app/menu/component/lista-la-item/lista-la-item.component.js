import * as tslib_1 from "tslib";
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';
import { UsuarioService } from 'src/app/core/services/usuario.service';
import { AlertController } from '@ionic/angular';
var ListaLaItemComponent = /** @class */ (function () {
    function ListaLaItemComponent(iab, usuarioService, alertController) {
        this.iab = iab;
        this.usuarioService = usuarioService;
        this.alertController = alertController;
        this.data = new Date();
        this.dia = this.data.getDate();
        this.mes = this.data.getMonth() + 1;
        this.ano = this.data.getFullYear();
        this.dataAtual = [this.mes, this.dia, this.ano].join('/');
        this.msgVencimento = '';
        this.cor = '';
        this.clicado = false;
        this.admin = false;
        this.update = new EventEmitter();
        this.delete = new EventEmitter();
        this.visualizar = new EventEmitter();
    }
    ListaLaItemComponent.prototype.ngOnInit = function () {
        this.clicado = false;
        var diasVenc = Number.parseInt(this.retornaDiasVencimento());
        if (diasVenc === 0) {
            this.msgVencimento = "Vence hoje!";
            this.cor = 'danger';
        }
        else if (diasVenc > 0) {
            this.msgVencimento = "Vence em " + diasVenc + " dias!";
            if (diasVenc === 1) {
                this.cor = 'danger';
            }
            else if (diasVenc <= 5) {
                this.cor = 'warning';
            }
            else {
                this.cor = 'success';
            }
        }
        else {
            var diasSemMenos = this.retornaDiasVencimento().replace('-', '');
            this.msgVencimento = "Venceu a " + diasSemMenos + " dias!";
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
    };
    ListaLaItemComponent.prototype.presentAlert = function (dias) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var alert;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.alertController.create({
                            header: 'AVISO',
                            subHeader: 'Licença Ambiental Irá Vencer!',
                            message: "A Licen\u00E7a Ambiental '" + this.licencaAmbiental.descricao + "' vence em " + dias + " dias!",
                            buttons: ['OK']
                        })];
                    case 1:
                        alert = _a.sent();
                        return [4 /*yield*/, alert.present()];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    ListaLaItemComponent.prototype.abrir = function () {
        this.clicado = true;
    };
    ListaLaItemComponent.prototype.fechar = function () {
        this.clicado = false;
    };
    ListaLaItemComponent.prototype.openLink = function () {
        this.iab.create("" + this.licencaAmbiental.arquivo, "_system");
    };
    ListaLaItemComponent.prototype.retornaDiasVencimento = function () {
        var dataInicialRecebida = new Date(this.licencaAmbiental.dataDeVencimento);
        var dataFinalFormatada = (dataInicialRecebida.getMonth() + 1) + "/" + (dataInicialRecebida.getDate()) + "/" + dataInicialRecebida.getFullYear();
        var dataInicialFormatada = this.dataAtual;
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
        return "" + diferencaData;
    };
    tslib_1.__decorate([
        Input(),
        tslib_1.__metadata("design:type", Object)
    ], ListaLaItemComponent.prototype, "licencaAmbiental", void 0);
    tslib_1.__decorate([
        Output(),
        tslib_1.__metadata("design:type", Object)
    ], ListaLaItemComponent.prototype, "update", void 0);
    tslib_1.__decorate([
        Output(),
        tslib_1.__metadata("design:type", Object)
    ], ListaLaItemComponent.prototype, "delete", void 0);
    tslib_1.__decorate([
        Output(),
        tslib_1.__metadata("design:type", Object)
    ], ListaLaItemComponent.prototype, "visualizar", void 0);
    ListaLaItemComponent = tslib_1.__decorate([
        Component({
            selector: 'app-lista-la-item',
            templateUrl: './lista-la-item.component.html',
            styleUrls: ['./lista-la-item.component.scss'],
        }),
        tslib_1.__metadata("design:paramtypes", [InAppBrowser, UsuarioService, AlertController])
    ], ListaLaItemComponent);
    return ListaLaItemComponent;
}());
export { ListaLaItemComponent };
//# sourceMappingURL=lista-la-item.component.js.map