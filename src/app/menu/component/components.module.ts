import { NgModule } from '@angular/core';
import { ListaClienteItemComponent } from './lista-cliente-item/lista-cliente-item.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { ListaOutorgaItemComponent } from './lista-outorga-item/lista-outorga-item.component';
import { ListaDaItemComponent } from './lista-da-item/lista-da-item.component';
import { ListaLaItemComponent } from './lista-la-item/lista-la-item.component';
import { ListaCarItemComponent } from './lista-car-item/lista-car-item.component';

@NgModule({
  declarations: [ListaClienteItemComponent, ListaOutorgaItemComponent, ListaDaItemComponent, ListaLaItemComponent, ListaCarItemComponent],
  imports: [SharedModule],
  exports: [ListaClienteItemComponent, ListaOutorgaItemComponent, ListaDaItemComponent, ListaLaItemComponent, ListaCarItemComponent]
})
export class ComponentsModule {}
