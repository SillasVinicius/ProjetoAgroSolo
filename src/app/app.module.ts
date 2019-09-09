import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { CoreModule } from './core/core.module';
import { Camera } from '@ionic-native/Camera/ngx';
import { File } from '@ionic-native/File/ngx';
import { WebView } from '@ionic-native/ionic-webview/ngx';
import { FilePath } from '@ionic-native/file-path/ngx';
import { IonicStorageModule } from '@ionic/storage';
import { Network } from '@ionic-native/network/ngx';


@NgModule({
  declarations: [AppComponent],
  imports: [CoreModule, AppRoutingModule, IonicStorageModule.forRoot()],
  providers: [Camera, File, WebView, FilePath, Network],
  bootstrap: [AppComponent]
})
export class AppModule {}
