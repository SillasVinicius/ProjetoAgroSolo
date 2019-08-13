import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { AuthService } from '../core/services/auth.service';
@NgModule({
  exports: [CommonModule, ReactiveFormsModule, IonicModule],
  providers: [AuthService]
})
export class SharedModule {}
