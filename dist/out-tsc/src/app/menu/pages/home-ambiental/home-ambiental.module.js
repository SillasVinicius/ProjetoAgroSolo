import * as tslib_1 from "tslib";
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { HomeAmbientalPage } from './home-ambiental.page';
import { SharedModule } from 'src/app/shared/shared.module';
var routes = [
    {
        path: '',
        component: HomeAmbientalPage
    }
];
var HomeAmbientalPageModule = /** @class */ (function () {
    function HomeAmbientalPageModule() {
    }
    HomeAmbientalPageModule = tslib_1.__decorate([
        NgModule({
            imports: [
                SharedModule,
                RouterModule.forChild(routes)
            ],
            declarations: [HomeAmbientalPage]
        })
    ], HomeAmbientalPageModule);
    return HomeAmbientalPageModule;
}());
export { HomeAmbientalPageModule };
//# sourceMappingURL=home-ambiental.module.js.map