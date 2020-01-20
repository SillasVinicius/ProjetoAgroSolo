import * as tslib_1 from "tslib";
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';
import { UsuarioService } from 'src/app/core/services/usuario.service';
import { AlertController } from '@ionic/angular';
var ListaDaItemComponent = /** @class */ (function () {
    function ListaDaItemComponent(iab, usuarioService, alertController) {
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
    }
    ListaDaItemComponent.prototype.ngOnInit = function () {
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
        if (diasVenc === 30) {
            this.presentAlert('30');
        }
        if (diasVenc === 15) {
            this.presentAlert('15');
        }
    };
    ListaDaItemComponent.prototype.openLink = function () {
        this.iab.create("" + this.declaracaoAmbiental.arquivo, "_system");
    };
    ListaDaItemComponent.prototype.abrir = function () {
        this.clicado = true;
    };
    ListaDaItemComponent.prototype.fechar = function () {
        this.clicado = false;
    };
    ListaDaItemComponent.prototype.presentAlert = function (dias) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var alert;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.alertController.create({
                            header: 'AVISO',
                            subHeader: 'Declaração Ambiental Irá Vencer!',
                            message: "A Declara\u00E7\u00E3o Ambiental '" + this.declaracaoAmbiental.descricao + "' vence em " + dias + " dias!",
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
    ListaDaItemComponent.prototype.retornaDiasVencimento = function () {
        var dataInicialRecebida = new Date(this.declaracaoAmbiental.dataDeVencimento);
        var dataFinalFormatada = (dataInicialRecebida.getMonth() + 1) + "/" + (dataInicialRecebida.getDate() + 1) + "/" + dataInicialRecebida.getFullYear();
        var dataInicialFormatada = this.dataAtual;
        
        var dataInicialMilissegundos = new Date(dataInicialFormatada).getTime();
        var dataFinalMilissegundos = new Date(dataFinalFormatada).getTime();
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
    ], ListaDaItemComponent.prototype, "declaracaoAmbiental", void 0);
    tslib_1.__decorate([
        Output(),
        tslib_1.__metadata("design:type", Object)
    ], ListaDaItemComponent.prototype, "update", void 0);
    tslib_1.__decorate([
        Output(),
        tslib_1.__metadata("design:type", Object)
    ], ListaDaItemComponent.prototype, "delete", void 0);
    ListaDaItemComponent = tslib_1.__decorate([
        Component({
            selector: 'app-lista-da-item',
            templateUrl: './lista-da-item.component.html',
            styleUrls: ['./lista-da-item.component.scss'],
        }),
        tslib_1.__metadata("design:paramtypes", [InAppBrowser, UsuarioService, AlertController])
    ], ListaDaItemComponent);
    return ListaDaItemComponent;
}());
export { ListaDaItemComponent };
//# sourceMappingURL=lista-da-item.component.js.map