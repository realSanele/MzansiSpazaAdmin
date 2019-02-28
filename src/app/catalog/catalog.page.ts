import { AlertController, LoadingController } from '@ionic/angular';
import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

declare var firebase;

interface ShopItem{
  itemID :string;
  itemName: string;
  itemPrice: number;
  downloadURL: string
}

@Component({
  selector: 'app-catalog',
  templateUrl: './catalog.page.html',
  styleUrls: ['./catalog.page.scss'],
})
export class CatalogPage implements OnInit {
  task =['sds','dsds','dfsf','dsfs','dsfd','dfsf','dfdsfd','fds'];
  spazaID : string;
  userID :string;
  catalogList : Array<ShopItem> = [];
  constructor(private router: Router,private activatedRoute : ActivatedRoute, private alertController : AlertController, private loadingCtrl: LoadingController) { }

  async ngOnInit() {
    const loading = await this.loadingCtrl.create({
      spinner: 'bubbles',
      duration: 5000,
      message: 'Loading catalog...',
      translucent: true,
      cssClass: 'custom-class custom-loading'
    });
    await loading.present();

    // this.spazaID = firebase.auth().currentUser.uid;
    this.catalogList = [];
    console.log('UserID = '+this.userID)
    this.activatedRoute.params.subscribe( data=>{
      console.log( data )
      this.spazaID = data.spazaID;
      this.userID = data.userID
    });

    firebase.database().ref('/spazas/'+this.spazaID+'/catalog').on("value",(snapshot) =>{
      
      console.log('Inside loop1');
      console.log(snapshot);
      snapshot.forEach(element => {
        console.log('Inside loop');
        // console.log(element.val().catalog)
        this.catalogList.push({
          itemID : element.key,
          itemName : element.val().itemName,
          itemPrice : element.val().itemPrice,
          downloadURL: element.val().downloadURL
        });
      });
      console.log(this.catalogList.length);
      loading.dismiss();
    });
  }

  addToCatalog(){
    this.router.navigate(['/add-items',{spazaID : this.spazaID}]);
  }

  async updateItem(item:ShopItem){
    console.log(item)
    const alert = await this.alertController.create({
      header: 'Update Item',
      inputs: [
        {
          name: 'itemName',
          type: 'text',
          value: item.itemName,
          placeholder: 'Item Name'
        },
        {
          name: 'itemPrice',
          type: 'number',
          id: 'name2-id',
          value: item.itemPrice,
          placeholder: 'Item Price'
        }
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            alert.dismiss();
          }
        }, {
          text: 'Save',
          handler: (inputData) => {
            firebase.database().ref('/spazas/'+this.spazaID+'/catalog/'+item.itemID).update({
              itemName : inputData.itemName,
              itemPrice : inputData.itemPrice
            }).then(updateResult =>{
              alert.dismiss();
              this.ngOnInit();
            })
          }
        }
      ]
    });

    await alert.present();
  }

  async deleteItem(item: ShopItem){
    const alert = await this.alertController.create({
      header: 'Delete',
      message: 'Are you sure you want to delete this item.',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: (blah) => {
            alert.dismiss()
            console.log('Confirm Cancel: blah');
          }
        }, {
          text: 'Delete',
          handler: () => {
            firebase.database().ref('/spazas/'+this.spazaID+'/catalog/'+item.itemID).remove().then(deleteResult => {
              this.ngOnInit();
              alert.dismiss();
            });
            console.log('Confirm Okay');
          }
        }
      ]
    });

    await alert.present();
  }

}
