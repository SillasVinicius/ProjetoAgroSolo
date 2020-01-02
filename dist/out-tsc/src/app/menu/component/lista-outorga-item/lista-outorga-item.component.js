import * as tslib_1 from "tslib";
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';
import { UsuarioService } from 'src/app/core/services/usuario.service';
import { AlertController } from '@ionic/angular';
var ListaOutorgaItemComponent = /** @class */ (function () {
    function ListaOutorgaItemComponent(iab, usuarioService, alertController) {
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
        this.admin = false;
        this.clicado = false;
        this.update = new EventEmitter();
        this.delete = new EventEmitter();
    }
    ListaOutorgaItemComponent.prototype.ngOnInit = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var diasVenc, diasSemMenos;
            return tslib_1.__generator(this, function (_a) {
                this.clicado = false;
                diasVenc = Number.parseInt(this.retornaDiasVencimento());
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
                    diasSemMenos = this.retornaDiasVencimento().replace('-', '');
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
                return [2 /*return*/];
            });
        });
    };
    ListaOutorgaItemComponent.prototype.presentAlert = function (dias) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var alert;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.alertController.create({
                            header: 'AVISO',
                            subHeader: 'Outorga Irá Vencer!',
                            message: "A outorga '" + this.outorga.descricao + "' vence em " + dias + " dias!",
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
    ListaOutorgaItemComponent.prototype.openLink = function () {
        this.iab.create("" + this.outorga.arquivo, "_system");
    };
    ListaOutorgaItemComponent.prototype.abrir = function () {
        this.clicado = true;
    };
    ListaOutorgaItemComponent.prototype.fechar = function () {
        this.clicado = false;
    };
    ListaOutorgaItemComponent.prototype.retornaDiasVencimento = function () {
        var dataInicialRecebida = new Date(this.outorga.dataDeVencimento);
        var dataFinalFormatada = (dataInicialRecebida.getMonth() + 1) + "/" + (dataInicialRecebida.getDate() + 1) + "/" + dataInicialRecebida.getFullYear();
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
    ], ListaOutorgaItemComponent.prototype, "outorga", void 0);
    tslib_1.__decorate([
        Output(),
        tslib_1.__metadata("design:type", Object)
    ], ListaOutorgaItemComponent.prototype, "update", void 0);
    tslib_1.__decorate([
        Output(),
        tslib_1.__metadata("design:type", Object)
    ], ListaOutorgaItemComponent.prototype, "delete", void 0);
    ListaOutorgaItemComponent = tslib_1.__decorate([
        Component({
            selector: 'app-lista-outorga-item',
            templateUrl: './lista-outorga-item.component.html',
            styleUrls: ['./lista-outorga-item.component.scss'],
        }),
        tslib_1.__metadata("design:paramtypes", [InAppBrowser, UsuarioService, AlertController])
    ], ListaOutorgaItemComponent);
    return ListaOutorgaItemComponent;
}());
export { ListaOutorgaItemComponent };
//# sourceMappingURL=lista-outorga-item.component.js.map