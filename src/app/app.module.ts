import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { CoreModule } from './core/core.module';
import { ImagePicker } from '@ionic-native/image-picker/ngx';
import { Camera } from '@ionic-native/camera/ngx';
import { Crop } from '@ionic-native/crop/ngx';
import { FileTransfer, FileTransferObject } from '@ionic-native/file-transfer/ngx';

@NgModule({
  declarations: [AppComponent],
  imports: [CoreModule, AppRoutingModule],
  providers: [ImagePicker, Camera, Crop, FileTransfer, FileTransferObject],
  bootstrap: [AppComponent]
})
export class AppModule {}
