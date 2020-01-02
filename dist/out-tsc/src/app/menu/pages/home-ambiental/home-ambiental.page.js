import * as tslib_1 from "tslib";
import { Component } from '@angular/core';
import { NavController } from '@ionic/angular';
var HomeAmbientalPage = /** @class */ (function () {
    function HomeAmbientalPage(navCtrl) {
        this.navCtrl = navCtrl;
    }
    HomeAmbientalPage.prototype.linkDA = function () {
        this.navCtrl.navigateForward('/menu/ambiental/DeclaracaoAmbiental');
    };
    HomeAmbientalPage.prototype.linkLA = function () {
        this.navCtrl.navigateForward('/menu/ambiental/LicencaAmbiental');
    };
    HomeAmbientalPage.prototype.linkCAR = function () {
        this.navCtrl.navigateForward('/menu/ambiental/CadastroAmbientalRural');
    };
    HomeAmbientalPage.prototype.linkOutorga = function () {
        this.navCtrl.navigateForward('/menu/outorga');
    };
    HomeAmbientalPage.prototype.ngOnInit = function () {
    };
    HomeAmbientalPage = tslib_1.__decorate([
        Component({
            selector: 'app-home-ambiental',
            templateUrl: './home-ambiental.page.html',
            styleUrls: ['./home-ambiental.page.scss'],
        }),
        tslib_1.__metadata("design:paramtypes", [NavController])
    ], HomeAmbientalPage);
    return HomeAmbientalPage;
}());
export { HomeAmbientalPage };
//# sourceMappingURL=home-ambiental.page.js.map