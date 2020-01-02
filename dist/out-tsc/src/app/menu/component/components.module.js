import * as tslib_1 from "tslib";
import { NgModule } from '@angular/core';
import { ListaClienteItemComponent } from './lista-cliente-item/lista-cliente-item.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { ListaOutorgaItemComponent } from './lista-outorga-item/lista-outorga-item.component';
import { ListaDaItemComponent } from './lista-da-item/lista-da-item.component';
import { ListaLaItemComponent } from './lista-la-item/lista-la-item.component';
import { ListaCarItemComponent } from './lista-car-item/lista-car-item.component';
import { ListaUsuarioItemComponent } from './lista-usuario-item/lista-usuario-item.component';
var ComponentsModule = /** @class */ (function () {
    function ComponentsModule() {
    }
    ComponentsModule = tslib_1.__decorate([
        NgModule({
            declarations: [ListaUsuarioItemComponent, ListaClienteItemComponent, ListaOutorgaItemComponent, ListaDaItemComponent, ListaLaItemComponent, ListaCarItemComponent],
            imports: [SharedModule],
            exports: [ListaUsuarioItemComponent, ListaClienteItemComponent, ListaOutorgaItemComponent, ListaDaItemComponent, ListaLaItemComponent, ListaCarItemComponent]
        })
    ], ComponentsModule);
    return ComponentsModule;
}());
export { ComponentsModule };
//# sourceMappingURL=components.module.js.map