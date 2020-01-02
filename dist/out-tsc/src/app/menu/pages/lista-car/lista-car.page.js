import * as tslib_1 from "tslib";
import { Component } from '@angular/core';
import { take } from 'rxjs/operators';
import { NavController } from '@ionic/angular';
import { OverlayService } from 'src/app/core/services/overlay.service';
import { CarService } from 'src/app/core/services/car.service';
import { UsuarioService } from 'src/app/core/services/usuario.service';
var ListaCARPage = /** @class */ (function () {
    function ListaCARPage(navCtrl, cadastroAmbientalRuralService, usuarioService, overlayService) {
        this.navCtrl = navCtrl;
        this.cadastroAmbientalRuralService = cadastroAmbientalRuralService;
        this.usuarioService = usuarioService;
        this.overlayService = overlayService;
    }
    ListaCARPage.prototype.ngOnInit = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var loading;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.overlayService.loading()];
                    case 1:
                        loading = _a.sent();
                        if (this.usuarioService.admin) {
                            this.cadastroAmbientalRuralService.initCAR();
                            this.cadastrosAmbientaisRurais$ = this.cadastroAmbientalRuralService.getAll();
                            this.cadastrosAmbientaisRurais$.pipe(take(1)).subscribe(function () { return loading.dismiss(); });
                        }
                        else {
                            this.cadastroAmbientalRuralService.init();
                            this.cadastrosAmbientaisRurais$ = this.cadastroAmbientalRuralService.getAll();
                            this.cadastrosAmbientaisRurais$.pipe(take(1)).subscribe(function () { return loading.dismiss(); });
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    ListaCARPage.prototype.atualizar = function (cadastroAmbientalRural) {
        this.navCtrl.navigateForward("menu/ambiental/UpdateCadastroAmbientalRural/" + cadastroAmbientalRural.id);
    };
    ListaCARPage.prototype.deletar = function (cadastroAmbientalRural) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var _this = this;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.overlayService.alert({
                            message: "Voc\u00EA realmente deseja deletar o cadastro Ambiental Rural \"" + cadastroAmbientalRural.descricao + "\"?",
                            buttons: [
                                {
                                    text: 'Sim',
                                    handler: function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
                                        return tslib_1.__generator(this, function (_a) {
                                            switch (_a.label) {
                                                case 0: return [4 /*yield*/, this.cadastroAmbientalRuralService.init()];
                                                case 1:
                                                    _a.sent();
                                                    return [4 /*yield*/, this.cadastroAmbientalRuralService.delete(cadastroAmbientalRural)];
                                                case 2:
                                                    _a.sent();
                                                    return [4 /*yield*/, this.cadastroAmbientalRuralService.initCAR()];
                                                case 3:
                                                    _a.sent();
                                                    return [4 /*yield*/, this.cadastroAmbientalRuralService.delete(cadastroAmbientalRural)];
                                                case 4:
                                                    _a.sent();
                                                    return [4 /*yield*/, this.overlayService.toast({
                                                            message: "cadastro Ambiental Rural \"" + cadastroAmbientalRural.descricao + "\" excluido!"
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
    ListaCARPage = tslib_1.__decorate([
        Component({
            selector: 'app-lista-car',
            templateUrl: './lista-car.page.html',
            styleUrls: ['./lista-car.page.scss'],
        }),
        tslib_1.__metadata("design:paramtypes", [NavController,
            CarService,
            UsuarioService,
            OverlayService])
    ], ListaCARPage);
    return ListaCARPage;
}());
export { ListaCARPage };
//# sourceMappingURL=lista-car.page.js.map