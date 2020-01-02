import * as tslib_1 from "tslib";
import { Component } from '@angular/core';
import { take } from 'rxjs/operators';
import { NavController } from '@ionic/angular';
import { OverlayService } from 'src/app/core/services/overlay.service';
import { LaService } from 'src/app/core/services/la.service';
import { UsuarioService } from 'src/app/core/services/usuario.service';
var ListaLAPage = /** @class */ (function () {
    function ListaLAPage(navCtrl, licencaAmbientalService, overlayService, usuarioService) {
        this.navCtrl = navCtrl;
        this.licencaAmbientalService = licencaAmbientalService;
        this.overlayService = overlayService;
        this.usuarioService = usuarioService;
    }
    ListaLAPage.prototype.ngOnInit = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var loading;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.overlayService.loading()];
                    case 1:
                        loading = _a.sent();
                        if (this.usuarioService.admin) {
                            this.licencaAmbientalService.initLA();
                            this.licencasAmbientais$ = this.licencaAmbientalService.getAll();
                            this.licencasAmbientais$.pipe(take(1)).subscribe(function () { return loading.dismiss(); });
                        }
                        else {
                            this.licencaAmbientalService.init();
                            this.licencasAmbientais$ = this.licencaAmbientalService.getAll();
                            this.licencasAmbientais$.pipe(take(1)).subscribe(function () { return loading.dismiss(); });
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    ListaLAPage.prototype.atualizar = function (licencaAmbiental) {
        this.navCtrl.navigateForward("/menu/ambiental/UpdateLicencaAmbiental/" + licencaAmbiental.id);
    };
    ListaLAPage.prototype.deletar = function (licencaAmbiental) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var _this = this;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.overlayService.alert({
                            message: "Voc\u00EA realmente deseja deletar a licenca ambiental \"" + licencaAmbiental.descricao + "\"?",
                            buttons: [
                                {
                                    text: 'Sim',
                                    handler: function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
                                        return tslib_1.__generator(this, function (_a) {
                                            switch (_a.label) {
                                                case 0: return [4 /*yield*/, this.licencaAmbientalService.init()];
                                                case 1:
                                                    _a.sent();
                                                    return [4 /*yield*/, this.licencaAmbientalService.delete(licencaAmbiental)];
                                                case 2:
                                                    _a.sent();
                                                    return [4 /*yield*/, this.licencaAmbientalService.initLA()];
                                                case 3:
                                                    _a.sent();
                                                    return [4 /*yield*/, this.licencaAmbientalService.delete(licencaAmbiental)];
                                                case 4:
                                                    _a.sent();
                                                    return [4 /*yield*/, this.overlayService.toast({
                                                            message: "licenca ambiental \"" + licencaAmbiental.descricao + "\" excluida!"
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
    ListaLAPage = tslib_1.__decorate([
        Component({
            selector: 'app-lista-la',
            templateUrl: './lista-la.page.html',
            styleUrls: ['./lista-la.page.scss'],
        }),
        tslib_1.__metadata("design:paramtypes", [NavController,
            LaService,
            OverlayService,
            UsuarioService])
    ], ListaLAPage);
    return ListaLAPage;
}());
export { ListaLAPage };
//# sourceMappingURL=lista-la.page.js.map