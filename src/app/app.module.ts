import { NgModule, ChangeDetectorRef } from '@angular/core';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { CoreModule } from './core/core.module';
import { HttpClientModule } from '@angular/common/http';

import { Camera } from '@ionic-native/Camera/ngx';
import { File } from '@ionic-native/File/ngx';
import { WebView } from '@ionic-native/ionic-webview/ngx';
import { FilePath } from '@ionic-native/file-path/ngx';

import { IonicStorageModule } from '@ionic/storage';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';
import { UploadTaskComponent } from './menu/component/upload-task/upload-task.component';
import { UploaderComponent } from './menu/component/uploader/uploader.component';
import { DropzoneDirective } from './core/directives/dropzone.directive';

@NgModule({
  declarations: [AppComponent],
  imports: [CoreModule, AppRoutingModule, HttpClientModule, IonicStorageModule.forRoot()],
  providers: [Camera, File, WebView, FilePath, InAppBrowser],
  bootstrap: [AppComponent]
})
export class AppModule {}
