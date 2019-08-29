import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CriaClientePage } from './cria-cliente.page';
import { SharedModule } from 'src/app/shared/shared.module';
import { FileSizeFormatPipe } from './file-size-format.pipe';
const routes: Routes = [
  {
    path: '',
    component: CriaClientePage
  }
];

@NgModule({
  imports: [SharedModule, RouterModule.forChild(routes)],
  declarations: [CriaClientePage, FileSizeFormatPipe]
})
export class CriaClientePageModule {}
