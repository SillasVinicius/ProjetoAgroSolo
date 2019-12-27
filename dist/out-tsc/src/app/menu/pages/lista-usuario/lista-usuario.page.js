import * as tslib_1 from "tslib";
import { Component } from '@angular/core';
import { take } from 'rxjs/operators';
import { NavController } from '@ionic/angular';
import { UsuarioService } from 'src/app/core/services/usuario.service';
import { OverlayService } from 'src/app/core/services/overlay.service';
var ListaUsuarioPage = /** @class */ (function () {
    function ListaUsuarioPage(navCtrl, usuarioService, overlayService) {
        this.navCtrl = navCtrl;
        this.usuarioService = usuarioService;
        this.overlayService = overlayService;
    }
    ListaUsuarioPage.prototype.ngOnInit = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var loading;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.overlayService.loading()];
                    case 1:
                        loading = _a.sent();
                        this.usuarioService.initFiltro();
                        this.usuarios$ = this.usuarioService.getAll();
                        this.usuarios$.pipe(take(1)).subscribe(function () { return loading.dismiss(); });
                        return [2 /*return*/];
                }
            });
        });
    };
    ListaUsuarioPage.prototype.atualizar = function (usuario) {
        this.navCtrl.navigateForward("/menu/atualizarCliente/" + usuario.id);
    };
    ListaUsuarioPage.prototype.deletar = function (usuario) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var _this = this;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.overlayService.alert({
                            message: "Voc\u00EA realmente deseja deletar o usu\u00E1rio \"" + usuario.nome + "\"?",
                            buttons: [
                                {
                                    text: 'Sim',
                                    handler: function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
                                        return tslib_1.__generator(this, function (_a) {
                                            switch (_a.label) {
                                                case 0: return [4 /*yield*/, this.usuarioService.init()];
                                                case 1:
                                                    _a.sent();
                                                    return [4 /*yield*/, this.usuarioService.delete(usuario)];
                                                case 2:
                                                    _a.sent();
                                                    return [4 /*yield*/, this.overlayService.toast({
                                                            message: "Usu\u00E1rio \"" + usuario.nome + "\" excluido!"
                                                        })];
                                                case 3:
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
    ListaUsuarioPage = tslib_1.__decorate([
        Component({
            selector: 'app-lista-usuario',
            templateUrl: './lista-usuario.page.html',
            styleUrls: ['./lista-usuario.page.scss'],
        }),
        tslib_1.__metadata("design:paramtypes", [NavController,
            UsuarioService,
            OverlayService])
    ], ListaUsuarioPage);
    return ListaUsuarioPage;
}());
export { ListaUsuarioPage };
//# sourceMappingURL=lista-usuario.page.js.map