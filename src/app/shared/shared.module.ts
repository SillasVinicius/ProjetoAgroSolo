import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { AuthService } from '../core/services/auth.service';
import { MenuToogleComponent } from './components/menu-toogle/menu-toogle.component';
@NgModule({
  declarations: [MenuToogleComponent],
  exports: [CommonModule, ReactiveFormsModule, IonicModule, MenuToogleComponent],
  imports: [IonicModule],
  providers: [AuthService]
})
export class SharedModule {}
