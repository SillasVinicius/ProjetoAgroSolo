import * as tslib_1 from "tslib";
import { Component } from '@angular/core';
import { take } from 'rxjs/operators';
import { NavController } from '@ionic/angular';
import { OverlayService } from 'src/app/core/services/overlay.service';
import { OutorgaService } from 'src/app/core/services/outorga.service';
import { UsuarioService } from 'src/app/core/services/usuario.service';
var ListaOutorgaPage = /** @class */ (function () {
    function ListaOutorgaPage(navCtrl, outorgaService, overlayService, usuarioService) {
        this.navCtrl = navCtrl;
        this.outorgaService = outorgaService;
        this.overlayService = overlayService;
        this.usuarioService = usuarioService;
        this.Outorga = [];
    }
    ListaOutorgaPage.prototype.ngOnInit = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var loading;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.overlayService.loading()];
                    case 1:
                        loading = _a.sent();
                        if (this.usuarioService.admin) {
                            this.outorgaService.initOutorga();
                            this.outorgas$ = this.outorgaService.getAll();
                            this.outorgas$.pipe(take(1)).subscribe(function () { return loading.dismiss(); });
                        }
                        else {
                            this.outorgaService.init();
                            this.outorgas$ = this.outorgaService.getAll();
                            this.outorgas$.pipe(take(1)).subscribe(function () { return loading.dismiss(); });
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    ListaOutorgaPage.prototype.atualizar = function (outorga) {
        this.navCtrl.navigateForward("/menu/updateOutorga/" + outorga.id);
    };
    ListaOutorgaPage.prototype.deletar = function (outorga) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var _this = this;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.overlayService.alert({
                            message: "Voc\u00EA realmente deseja deletar a outorga \"" + outorga.descricao + "\"?",
                            buttons: [
                                {
                                    text: 'Sim',
                                    handler: function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
                                        return tslib_1.__generator(this, function (_a) {
                                            switch (_a.label) {
                                                case 0: return [4 /*yield*/, this.outorgaService.init()];
                                                case 1:
                                                    _a.sent();
                                                    return [4 /*yield*/, this.outorgaService.delete(outorga)];
                                                case 2:
                                                    _a.sent();
                                                    return [4 /*yield*/, this.outorgaService.initOutorga()];
                                                case 3:
                                                    _a.sent();
                                                    return [4 /*yield*/, this.outorgaService.delete(outorga)];
                                                case 4:
                                                    _a.sent();
                                                    return [4 /*yield*/, this.overlayService.toast({
                                                            message: "Outorga \"" + outorga.descricao + "\" excluido!"
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
    ListaOutorgaPage = tslib_1.__decorate([
        Component({
            selector: 'app-lista-outorga',
            templateUrl: './lista-outorga.page.html',
            styleUrls: ['./lista-outorga.page.scss'],
        }),
        tslib_1.__metadata("design:paramtypes", [NavController,
            OutorgaService,
            OverlayService,
            UsuarioService])
    ], ListaOutorgaPage);
    return ListaOutorgaPage;
}());
export { ListaOutorgaPage };
//# sourceMappingURL=lista-outorga.page.js.map