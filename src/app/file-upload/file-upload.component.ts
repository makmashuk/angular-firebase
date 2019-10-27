import { Component, OnInit } from '@angular/core';
import { AngularFireUploadTask, AngularFireStorage } from '@angular/fire/storage';
import { Observable } from 'rxjs';
import { AngularFirestore } from '@angular/fire/firestore';
import { tap, finalize } from 'rxjs/operators';

@Component({
  selector: 'app-file-upload',
  templateUrl: './file-upload.component.html',
  styleUrls: ['./file-upload.component.css']
})
export class FileUploadComponent {

 
  fileurl;
  task: AngularFireUploadTask;
  uploadFile=false;

  // Progress monitoring
  percentage: Observable<number>;
  snapshot: Observable<any>;
  // Download URL
  downloadURL: Observable<string>;

  // State for dropzone CSS toggling
  isHovering: boolean;

  defaultImage= "https://x.kinja-static.com/assets/images/logos/placeholders/default.png";
  constructor(private storage: AngularFireStorage, private db: AngularFirestore) { }

  
  toggleHover(event: boolean) {
    this.isHovering = event;
    console.log(event);
  }


  startUpload(event: FileList) {
    // The File object
    this.uploadFile=true;
    const file = event.item(0)
    // console.log(file);

    // // Client-side validation example
    // if (file.type.split('/')[0] !== 'image') { 
    //   console.error('unsupported file type :( ')
    //   return;
    // }

    // // The storage path
    const path = `files/${new Date().getTime()}_${file.name}`;
    const fileRef = this.storage.ref(path);

    // // Totally optional metadata
    // const customMetadata = { app: 'My AngularFire-powered PWA!' };

    // // The main task
    this.task = this.storage.upload(path, file)

    // Progress monitoring
    this.percentage = this.task.percentageChanges();
 
  
    this.snapshot   = this.task.snapshotChanges().pipe(

      finalize(
        () => {
          this.downloadURL = fileRef.getDownloadURL(),
          this.uploadFile=false
        }
      ),
      tap(snap => {
        
        if (snap.bytesTransferred === snap.totalBytes) {
          this.db.collection('files').add( { path, size: snap.totalBytes })
        }
      }),
    )
    // this.downloadURL = this.task.downloadURL();
    console.log(this.snapshot);
  }



  // Determines if the upload task is active
  isActive(snapshot) {
    return snapshot.state === 'running' && snapshot.bytesTransferred < snapshot.totalBytes;
  }

}
