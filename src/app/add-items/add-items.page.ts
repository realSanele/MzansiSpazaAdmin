import { AlertController, ActionSheetController, LoadingController } from '@ionic/angular';
import { ActivatedRoute, Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { File } from '@ionic-native/file/ngx';

declare var firebase;

interface ShopItem{
  itemName: string;
  itemPrice: number;
}

@Component({
  selector: 'app-add-items',
  templateUrl: './add-items.page.html',
  styleUrls: ['./add-items.page.scss'],
})
export class AddItemsPage implements OnInit {
  catalogItemsForm: FormGroup;
  catalogList : Array<ShopItem> =[]; 
  userID : string;
  spazaID : string;

  imageURI:any;
  setelectedImage:any;

  constructor(private fb: FormBuilder, private router: Router,private alertCtrl: AlertController,private actionSheetCtrl: ActionSheetController,private loadingController:  LoadingController,private activatedRoute: ActivatedRoute,private camera: Camera, private file: File) {

    this.catalogItemsForm = fb.group({
      itemName: ['',Validators.compose([Validators.required])],
      itemPrice: ['',Validators.compose([Validators.pattern('^([0-9]{0,2}((.)[0-9]{0,2}))$'),Validators.maxLength(8),Validators.required])]
    });

  }

  ngOnInit() {
    this.activatedRoute.params.subscribe( data=>{
      console.log( data )
      this.spazaID = data.spazaID;
    })

    this.userID = firebase.auth().currentUser.uid;
  }

  addItem(){
    let item : ShopItem = {
      itemName : this.catalogItemsForm.value.itemName,
      itemPrice : this.catalogItemsForm.value.itemPrice
    }
    this.catalogItemsForm.reset();
    this.catalogList.push(item);
  }

  async submitCatalog(catalogList: Array<ShopItem>){
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
            // console.log(snapshot);
            // firebase.database().ref('/spazas/').push({
            //   spazaName : this.spazaForm.value.spazaName,
            //   township : this.spazaForm.value.city,
            //   street: this.spazaForm.value.street,
            //   houseNo : this.spazaForm.value.houseNO,
            //   downloadURL: url,
            //   spazaOwnerID : this.userID
            // }).then(spazaResult => {
            //   // firebase.database().ref('/spaza_owners/').push({spazaOwnerID : this.userID}).then(result =>{
            //     this.router.navigateByUrl('/myspazas');
            //   // });
              
            // });

            catalogList.forEach(shopItem =>{
              firebase.database().ref('/spazas/'+this.spazaID+'/catalog/').push({itemName: shopItem.itemName, itemPrice: shopItem.itemPrice, downloadURL: url}).then(itemResult => {
                this.router.navigate(['/catalog',{spazaID : this.spazaID}]);
                // loading.dismiss();
              });
            });
          });
        
        });
      });

    }else{
      catalogList.forEach(shopItem =>{
        firebase.database().ref('/spazas/'+this.spazaID+'/catalog/').push({itemName: shopItem.itemName, itemPrice: shopItem.itemPrice, downloadURL: 'none'}).then(itemResult => {
          this.router.navigate(['/catalog',{spazaID : this.spazaID}]);
          // loading.dismiss();
        });
      });
    }
    
    
  }

  removeItem(index){
    this.catalogList.splice(index,1);
  }

  async uploadItemPic(){
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
    });
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
