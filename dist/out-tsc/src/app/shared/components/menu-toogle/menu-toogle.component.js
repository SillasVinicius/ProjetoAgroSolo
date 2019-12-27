import * as tslib_1 from "tslib";
import { Component, Input } from '@angular/core';
var MenuToogleComponent = /** @class */ (function () {
    function MenuToogleComponent() {
    }
    tslib_1.__decorate([
        Input(),
        tslib_1.__metadata("design:type", String)
    ], MenuToogleComponent.prototype, "menu", void 0);
    MenuToogleComponent = tslib_1.__decorate([
        Component({
            selector: 'app-menu-toogle',
            template: "\n    <ion-buttons>\n      <ion-menu-toggle [menu]=\"menu\">\n        <ion-button>\n          <ion-icon slot=\"icon-only\" name=\"menu\"></ion-icon>\n        </ion-button>\n      </ion-menu-toggle>\n    </ion-buttons>\n  "
        })
    ], MenuToogleComponent);
    return MenuToogleComponent;
}());
export { MenuToogleComponent };
//# sourceMappingURL=menu-toogle.component.js.map