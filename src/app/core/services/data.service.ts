import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireStorage, AngularFireUploadTask } from '@angular/fire/storage';
import { tap, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  constructor(private db: AngularFirestore, private afStorage: AngularFireStorage) {}

  getFiles() {
    return this.db.doc('files').valueChanges();
  }

  uploadToStorage(information): AngularFireUploadTask {
    let newName = `${new Date().getTime()}.txt`;

    return this.afStorage.ref(`files/${newName}`).putString(information);
  }

  storeInfoToDatabase(metainfo) {
    let toSave = {
      created: metainfo.timeCreated,
      url: metainfo.downloadURLs[0],
      fullPath: metainfo.fullPath,
      contentType: metainfo.contentType
    };
    return this.db.doc('files').set(toSave);
  }

  deleteFile(file) {
    let key = file.key;
    let storagePath = file.fullPath;

    let ref = this.db.doc('files');

    ref.delete();
    return this.afStorage.ref(storagePath).delete();
  }
}
