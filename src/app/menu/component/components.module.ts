import { NgModule } from '@angular/core';
import { ListaClienteItemComponent } from './lista-cliente-item/lista-cliente-item.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { ListaOutorgaItemComponent } from './lista-outorga-item/lista-outorga-item.component';

@NgModule({
  declarations: [ListaClienteItemComponent, ListaOutorgaItemComponent],
  imports: [SharedModule],
  exports: [ListaClienteItemComponent, ListaOutorgaItemComponent]
})
export class ComponentsModule {}
