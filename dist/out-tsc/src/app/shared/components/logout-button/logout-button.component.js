import * as tslib_1 from "tslib";
import { Component, Input } from '@angular/core';
import { UsuarioService } from 'src/app/core/services/usuario.service';
import { NavController, MenuController } from '@ionic/angular';
import { OverlayService } from 'src/app/core/services/overlay.service';
var LogoutButtonComponent = /** @class */ (function () {
    function LogoutButtonComponent(userService, navCtrl, overlayService, menuCtrl) {
        this.userService = userService;
        this.navCtrl = navCtrl;
        this.overlayService = overlayService;
        this.menuCtrl = menuCtrl;
    }
    LogoutButtonComponent.prototype.ngOnInit = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.menuCtrl.isEnabled(this.menu)];
                    case 1:
                        if (!(_a.sent())) {
                            this.menuCtrl.enable(true, this.menu);
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    LogoutButtonComponent.prototype.logout = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var _this = this;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.overlayService.alert({
                            message: 'Você deseja realmente sair?',
                            buttons: [
                                {
                                    text: 'Sim',
                                    handler: function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
                                        return tslib_1.__generator(this, function (_a) {
                                            switch (_a.label) {
                                                case 0:
                                                    this.userService.logado = false;
                                                    return [4 /*yield*/, this.menuCtrl.enable(false, this.menu)];
                                                case 1:
                                                    _a.sent();
                                                    this.navCtrl.navigateRoot('/login');
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
    tslib_1.__decorate([
        Input(),
        tslib_1.__metadata("design:type", String)
    ], LogoutButtonComponent.prototype, "menu", void 0);
    LogoutButtonComponent = tslib_1.__decorate([
        Component({
            selector: 'app-logout-button',
            template: "\n    <ion-buttons>\n      <ion-button (click)=\"logout()\">\n        <ion-chip style=\"color: white\">\n          <ion-label>Sair</ion-label>\n          <ion-icon name=\"exit\" size=\"small\" color=\"white\"></ion-icon>\n        </ion-chip>\n      </ion-button>\n    </ion-buttons>\n  "
        }),
        tslib_1.__metadata("design:paramtypes", [UsuarioService,
            NavController,
            OverlayService,
            MenuController])
    ], LogoutButtonComponent);
    return LogoutButtonComponent;
}());
export { LogoutButtonComponent };
//# sourceMappingURL=logout-button.component.js.map