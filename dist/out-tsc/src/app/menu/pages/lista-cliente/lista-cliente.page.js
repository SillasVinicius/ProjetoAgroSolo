import * as tslib_1 from "tslib";
import { Component } from '@angular/core';
import { take } from 'rxjs/operators';
import { NavController } from '@ionic/angular';
import { ClienteService } from 'src/app/core/services/cliente.service';
import { OverlayService } from 'src/app/core/services/overlay.service';
import { UsuarioService } from 'src/app/core/services/usuario.service';
var ListaClientePage = /** @class */ (function () {
    function ListaClientePage(navCtrl, clienteService, overlayService, usuarioService) {
        this.navCtrl = navCtrl;
        this.clienteService = clienteService;
        this.overlayService = overlayService;
        this.usuarioService = usuarioService;
    }
    ListaClientePage.prototype.ngOnInit = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var loading;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.overlayService.loading()];
                    case 1:
                        loading = _a.sent();
                        if (this.usuarioService.admin) {
                            this.clienteService.initCliente();
                            this.clientes$ = this.clienteService.getAll();
                            this.clientes$.pipe(take(1)).subscribe(function () { return loading.dismiss(); });
                        }
                        else {
                            this.clienteService.init();
                            this.clientes$ = this.clienteService.getAll();
                            this.clientes$.pipe(take(1)).subscribe(function () { return loading.dismiss(); });
                        }
                        console.log(this.clientes$);
                        return [2 /*return*/];
                }
            });
        });
    };
    ListaClientePage.prototype.atualizar = function (cliente) {
        this.navCtrl.navigateForward("/menu/updateCliente/" + cliente.id);
    };
    ListaClientePage.prototype.deletar = function (cliente) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var _this = this;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.overlayService.alert({
                            message: "Voc\u00EA realmente deseja deletar o cliente \"" + cliente.nome + "\"?",
                            buttons: [
                                {
                                    text: 'Sim',
                                    handler: function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
                                        return tslib_1.__generator(this, function (_a) {
                                            switch (_a.label) {
                                                case 0: return [4 /*yield*/, this.clienteService.init()];
                                                case 1:
                                                    _a.sent();
                                                    return [4 /*yield*/, this.clienteService.delete(cliente)];
                                                case 2:
                                                    _a.sent();
                                                    return [4 /*yield*/, this.clienteService.initCliente()];
                                                case 3:
                                                    _a.sent();
                                                    return [4 /*yield*/, this.clienteService.delete(cliente)];
                                                case 4:
                                                    _a.sent();
                                                    return [4 /*yield*/, this.overlayService.toast({
                                                            message: "Cliente \"" + cliente.nome + "\" excluido!"
                                                        })];
                                                case 5:
                                                    _a.sent();
                                                    return [2 /*return*/];
                                            }
                                        });
                                    }); }
                                },
                                'Não'
                            ]
                        })];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    ListaClientePage = tslib_1.__decorate([
        Component({
            selector: 'app-lista-cliente',
            templateUrl: './lista-cliente.page.html',
            styleUrls: ['./lista-cliente.page.scss']
        }),
        tslib_1.__metadata("design:paramtypes", [NavController,
            ClienteService,
            OverlayService,
            UsuarioService])
    ], ListaClientePage);
    return ListaClientePage;
}());
export { ListaClientePage };
//# sourceMappingURL=lista-cliente.page.js.map