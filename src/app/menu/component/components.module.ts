import { NgModule } from '@angular/core';
import { ListaClienteItemComponent } from './lista-cliente-item/lista-cliente-item.component';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  declarations: [ListaClienteItemComponent],
  imports: [SharedModule],
  exports: [ListaClienteItemComponent]
})
export class ComponentsModule {}
