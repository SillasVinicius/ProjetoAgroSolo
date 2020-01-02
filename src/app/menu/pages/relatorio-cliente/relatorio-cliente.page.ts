import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Cliente } from '../../models/cliente.model';
import { take } from 'rxjs/operators';
import { NavController } from '@ionic/angular';
import { ClienteService } from 'src/app/core/services/cliente.service';
import { OverlayService } from 'src/app/core/services/overlay.service';
import { UsuarioService } from 'src/app/core/services/usuario.service';
import { LoadingController } from '@ionic/angular';
import * as jsPDF from 'jspdf';
import domtoimage from 'dom-to-image';
import { File, IWriteOptions } from '@ionic-native/file/ngx';
import { FileOpener } from '@ionic-native/file-opener/ngx';
import { Base64ToGallery, Base64ToGalleryOptions } from '@ionic-native/base64-to-gallery/ngx';

@Component({
  selector: 'app-relatorio-cliente',
  templateUrl: './relatorio-cliente.page.html',
  styleUrls: ['./relatorio-cliente.page.scss'],
})

export class RelatorioClientePage implements OnInit {
  loading: any;
  constructor(public loadingCtrl: LoadingController,
    private base64ToGallery: Base64ToGallery,
    private file: File,
    private fileOpener: FileOpener
  ) { }


  ngOnInit() {
    
  }
  

  exportPdf() {

    
    // const div = document.getElementById("printable-area");
    // const options = { background: "white", height: div.clientWidth, width: div.clientHeight };

    

    //   domtoimage.toPng(div, options).then ((dataUrl)=> {

    //   //Initialize JSPDF
    //   var doc = new jsPDF("p","mm","a4");
    //   //Add image Url to PDF
    //   doc.addImage(dataUrl, 'png', 20, 20, 240, 180);
      
    //   let pdfOutput = doc.output();
    //   // using ArrayBuffer will allow you to put image inside PDF
    //   let buffer = new ArrayBuffer(pdfOutput.length);
    //   let array = new Uint8Array(buffer);
    //   for (var i = 0; i < pdfOutput.length; i++) {
    //       array[i] = pdfOutput.charCodeAt(i);
    //   }
  
    //   //This is where the PDF file will stored , you can change it as you like
    //   // for more information please visit https://ionicframework.com/docs/native/file/
    //   const directory = this.file.dataDirectory ;
    //   const fileName = "invoice.pdf";
    //   let options: IWriteOptions = { replace: true };
  
    //   this.file.checkFile(directory, fileName).then((success)=> {
    //     //Writing File to Device
    //     this.file.writeFile(directory,fileName,buffer, options)
    //     .then((success)=> {
    //       this.loading.dismiss();
    //       console.log("File created Succesfully" + JSON.stringify(success));
    //       this.fileOpener.open(this.file.dataDirectory + fileName, 'application/pdf')
    //         .then(() => console.log('File is opened'))
    //         .catch(e => console.log('Error opening file', e));
    //     })
    //     .catch((error)=> {
    //       this.loading.dismiss();
    //       console.log("Cannot Create File " +JSON.stringify(error));
    //     });
    //   })
    //   .catch((error)=> {
    //     //Writing File to Device
    //     this.file.writeFile(directory,fileName,buffer)
    //     .then((success)=> {
    //       this.loading.dismiss();
    //       console.log("File created Succesfully" + JSON.stringify(success));
    //       this.fileOpener.open(this.file.dataDirectory + fileName, 'application/pdf')
    //         .then(() => console.log('File is opened'))
    //         .catch(e => console.log('Error opening file', e));
    //     })
    //     .catch((error)=> {
    //       this.loading.dismiss();
    //       console.log("Cannot Create File " +JSON.stringify(error));
    //     });
    //   });
    // })
    // .catch(function (error) {
    //   this.loading.dismiss();
    //   console.error('oops, something went wrong!', error);
    // });
  }
}

