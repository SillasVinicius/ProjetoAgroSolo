import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CriaClientePage } from './cria-cliente.page';
import { SharedModule } from 'src/app/shared/shared.module';
import { FileSizeFormatPipe } from './file-size-format.pipe';
import { UploaderComponent } from '../../component/uploader/uploader.component';
import { UploadTaskComponent } from '../../component/upload-task/upload-task.component';
const routes: Routes = [
  {
    path: '',
    component: CriaClientePage
  }
];

@NgModule({
  imports: [SharedModule, RouterModule.forChild(routes)],
  declarations: [CriaClientePage, FileSizeFormatPipe, UploadTaskComponent, UploaderComponent]
})
export class CriaClientePageModule {}
