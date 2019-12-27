import * as tslib_1 from "tslib";
import { Component, Input } from '@angular/core';
import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
var AppComponent = /** @class */ (function () {
    function AppComponent(platform, splashScreen, statusBar) {
        this.platform = platform;
        this.splashScreen = splashScreen;
        this.statusBar = statusBar;
        this.initializeApp();
    }
    AppComponent.prototype.initializeApp = function () {
        var _this = this;
        this.pages = [
            { url: '/menu', icon: 'home', text: 'Home', direction: 'back' },
            { url: '/menu/cliente', icon: 'person-add', text: 'Cliente', direction: 'forward' },
            { url: '/menu/usuario', icon: 'ios-person-add', text: 'Administrador', direction: 'forward' },
            { url: '/menu/dadosPessoais', icon: 'folder', text: 'Dados Pessoais', direction: 'forward' },
            { url: '/menu/ambiental', icon: 'flower', text: 'Ambiental', direction: 'forward' }
        ];
        this.platform.ready().then(function () {
            _this.statusBar.styleDefault();
            _this.splashScreen.hide();
        });
    };
    tslib_1.__decorate([
        Input(),
        tslib_1.__metadata("design:type", String)
    ], AppComponent.prototype, "nome", void 0);
    AppComponent = tslib_1.__decorate([
        Component({
            selector: 'app-root',
            templateUrl: 'app.component.html'
        }),
        tslib_1.__metadata("design:paramtypes", [Platform,
            SplashScreen,
            StatusBar])
    ], AppComponent);
    return AppComponent;
}());
export { AppComponent };
//# sourceMappingURL=app.component.js.map