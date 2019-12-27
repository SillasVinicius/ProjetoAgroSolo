import * as tslib_1 from "tslib";
import { Component } from '@angular/core';
import { take } from 'rxjs/operators';
import { NavController } from '@ionic/angular';
import { OverlayService } from 'src/app/core/services/overlay.service';
import { DaService } from 'src/app/core/services/da.service';
import { UsuarioService } from 'src/app/core/services/usuario.service';
var ListaDAPage = /** @class */ (function () {
    function ListaDAPage(navCtrl, daService, overlayService, usuarioService) {
        this.navCtrl = navCtrl;
        this.daService = daService;
        this.overlayService = overlayService;
        this.usuarioService = usuarioService;
    }
    ListaDAPage.prototype.ngOnInit = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var loading;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.overlayService.loading()];
                    case 1:
                        loading = _a.sent();
                        if (this.usuarioService.admin) {
                            this.daService.initDA();
                            this.das$ = this.daService.getAll();
                            this.das$.pipe(take(1)).subscribe(function () { return loading.dismiss(); });
                        }
                        else {
                            this.daService.init();
                            this.das$ = this.daService.getAll();
                            this.das$.pipe(take(1)).subscribe(function () { return loading.dismiss(); });
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    ListaDAPage.prototype.atualizar = function (da) {
        this.navCtrl.navigateForward("menu/ambiental/UpdateDeclaracaoAmbiental/" + da.id);
    };
    ListaDAPage.prototype.deletar = function (da) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var _this = this;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.overlayService.alert({
                            message: "Voc\u00EA realmente deseja deletar a Declaracao Ambiental \"" + da.descricao + "\"?",
                            buttons: [
                                {
                                    text: 'Sim',
                                    handler: function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
                                        return tslib_1.__generator(this, function (_a) {
                                            switch (_a.label) {
                                                case 0: return [4 /*yield*/, this.daService.init()];
                                                case 1:
                                                    _a.sent();
                                                    return [4 /*yield*/, this.daService.delete(da)];
                                                case 2:
                                                    _a.sent();
                                                    return [4 /*yield*/, this.daService.initDA()];
                                                case 3:
                                                    _a.sent();
                                                    return [4 /*yield*/, this.daService.delete(da)];
                                                case 4:
                                                    _a.sent();
                                                    return [4 /*yield*/, this.overlayService.toast({
                                                            message: "Declaracao Ambiental \"" + da.descricao + "\" excluida!"
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
    ListaDAPage = tslib_1.__decorate([
        Component({
            selector: 'app-lista-da',
            templateUrl: './lista-da.page.html',
            styleUrls: ['./lista-da.page.scss'],
        }),
        tslib_1.__metadata("design:paramtypes", [NavController,
            DaService,
            OverlayService,
            UsuarioService])
    ], ListaDAPage);
    return ListaDAPage;
}());
export { ListaDAPage };
//# sourceMappingURL=lista-da.page.js.map