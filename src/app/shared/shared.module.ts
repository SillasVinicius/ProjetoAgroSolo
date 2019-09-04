import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { MenuToogleComponent } from './components/menu-toogle/menu-toogle.component';
import { LogoutButtonComponent } from './components/logout-button/logout-button.component';
import { FileSizeFormatPipe } from './pipe/file-size-format.pipe';
@NgModule({
  declarations: [LogoutButtonComponent, MenuToogleComponent, FileSizeFormatPipe],
  exports: [
    LogoutButtonComponent,
    CommonModule,
    ReactiveFormsModule,
    IonicModule,
    MenuToogleComponent,
    FileSizeFormatPipe
  ],
  imports: [IonicModule]
})
export class SharedModule {}
