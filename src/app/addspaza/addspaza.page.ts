import { LoadingController, ActionSheetController, AlertController } from '@ionic/angular';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { File } from '@ionic-native/file/ngx';

declare var firebase;
declare var google;

@Component({
  selector: 'app-addspaza',
  templateUrl: './addspaza.page.html',
  styleUrls: ['./addspaza.page.scss'],
})
export class AddspazaPage implements OnInit {
  private autocomplete_init: boolean= false;
  @ViewChild('myInput') myInputRef :ElementRef
  spazaForm: FormGroup;
  userID :string;

  setelectedImage:any;
  imageURI : string;
  input:any;

  constructor(private fb: FormBuilder,private router: Router,private alertCtrl: AlertController, private loadingController: LoadingController, private actionSheetCtrl: ActionSheetController,private camera: Camera, private file: File) {
    this.spazaForm = fb.group({
      spazaName: ['',Validators.compose([ Validators.required])],
      city: ['',Validators.compose([Validators.required])],
      street: ['',Validators.compose([Validators.required])],
      houseNO:['',Validators.compose([Validators.required])]
    });
  }

  ngOnInit() {
    this.input = document.getElementById('googlePlaces');  //.getElementsByTagName('myInput')[0];
    let autocomplete = new google.maps.places.Autocomplete(this.input, {types: ['geocode']});

    this.input.value;
    this.userID = firebase.auth().currentUser.uid;
    console.log(this.userID);
  }

  autocompleteFocus() {
    this.autocomplete_init = true;
    if (!this.autocomplete_init) {
     let autocomplete = new google.maps.places.Autocomplete(document.getElementById("search_address"), {
  
     }
     )};
  }
  
  async addSpaza(){
    const loading = await this.loadingController.create({
      spinner: 'bubbles',
      duration: 5000,
      message: 'Please wait...',
      translucent: true,
      cssClass: 'custom-class custom-loading'
    });
    await loading.present();

    if(this.setelectedImage != null){
      let filename = this.imageURI.substring(this.imageURI.lastIndexOf('/')+1);
      let path =  this.imageURI.substring(0,this.imageURI.lastIndexOf('/')+1);
      return this.file.readAsArrayBuffer(path, filename).then((buffer: ArrayBuffer) => {
        var blob = new Blob([buffer], {type: 'image/jpeg'});

        const storageRef = firebase.storage().ref('Spaza_App_Images/' + new Date().getTime() + '.jpg');
        storageRef.put(blob).then((snapshot:any) => {

          storageRef.getDownloadURL().then((url) => {
            console.log(snapshot);
            firebase.database().ref('/spazas/').push({
              spazaName : this.spazaForm.value.spazaName,
              township : this.spazaForm.value.city,
              // street: this.spazaForm.value.street,
              street: this.input.value,
              houseNo : this.spazaForm.value.houseNO,
              downloadURL: url,
              spazaOwnerID : this.userID
            }).then(spazaResult => {
              // firebase.database().ref('/spaza_owners/').push({spazaOwnerID : this.userID}).then(result =>{
                this.router.navigateByUrl('/myspazas');
              // });
              
            });
          });
        
        });
      });
      
      
    }else{
      firebase.database().ref('/spazas/').push({
        spazaName : this.spazaForm.value.spazaName,
        township : this.spazaForm.value.city,
        street: this.input.value,
        houseNo : this.spazaForm.value.houseNO,
        downloadURL: 'none',
        spazaOwnerID : this.userID
      }).then(spazaResult => {
        // firebase.database().ref('/spaza_owners/').push({spazaOwnerID : this.userID}).then(result =>{
          this.router.navigateByUrl('/myspazas');
        // });
      });
    }
    
  }

  async uploadSpazaPic(){
    const actionSheet = await this.actionSheetCtrl.create({
      header: 'Complete action using',
      buttons: [{
        text: 'Camera',
        role: 'destructive',
        icon: 'camera',
        handler: () => {
          this.takePhoto(1);
          console.log('Delete clicked');
        }
      }, {
        text: 'Gallery',
        icon: 'images',
        handler: () => {
          this.takePhoto(0);
          console.log('Share clicked');
        }
      
      }]
    });
    await actionSheet.present();
  }

  takePhoto(sourceType:number){
    const options: CameraOptions = {
      quality: 100,
      allowEdit: true,
      sourceType: sourceType,
      saveToPhotoAlbum: true,
      correctOrientation: true,
      targetWidth: 100,
      targetHeight: 100,
      encodingType: this.camera.EncodingType.JPEG,
      destinationType: this.camera.DestinationType.FILE_URI
    }
      
      this.camera.getPicture(options).then((imageData) => {
        //needs to import file plugin
        //split the file and the path from FILE_URI result
        this.imageURI = imageData;
        let filename = imageData.substring(imageData.lastIndexOf('/')+1);
        let path =  imageData.substring(0,imageData.lastIndexOf('/')+1);
        //then use the method reasDataURL  btw. var_picture is ur image variable
        console.log("About to read as data uRl");
        this.file.readAsDataURL(path, filename).then(res=>{
          console.log(res); 
          this.setelectedImage = res; 
        } );
      },err =>{
        this.showPopup("Error!", "Something went wrong while uploading picture!");
      })
  }

  async showPopup(title: string, text:string){
    const alert = await this.alertCtrl.create({
      header: title,
      // subHeader: 'Subtitle',
      message: text,
      buttons: ['Cancel']
    });

    await alert.present();
  }
}
