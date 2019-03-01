import { LoadingController, NavController } from '@ionic/angular';
import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

declare var firebase;

interface Spaza{
  spazaID: string;
  spazaName: string;
  township: string;
  street: string;
  houseNO: string;
  downloadURL:string
}

@Component({
  selector: 'app-myspazas',
  templateUrl: './myspazas.page.html',
  styleUrls: ['./myspazas.page.scss'],
})
export class MyspazasPage implements OnInit {

  spazaList: Array<Spaza> = [];
  userID : string;


  constructor(private router: Router, private loadingCtrl: LoadingController,public navCtrl: NavController) { }

  async ngOnInit() {
    this.spazaList = [];

    this.userID = firebase.auth().currentUser.uid;

    const loading = await this.loadingCtrl.create({
      spinner: 'bubbles',
      duration: 5000,
      message: 'Loading spaza(s)...',
      translucent: true,
      cssClass: 'custom-class custom-loading'
    });
    await loading.present();
    console.log(this.userID);
    firebase.database().ref('/spazas/').on('value',(snapshot) =>{
      snapshot.forEach(element => {
        if(element.val().spazaOwnerID === this.userID){
          let theSpaza = {
            spazaID: element.key,
            spazaName: element.val().spazaName,
            township: element.val().township,
            street: element.val().street,
            houseNO: element.val().houseNo,
            downloadURL: element.val().downloadURL
          }
          
          this.spazaList.push(theSpaza);
        }
      });
    });
  }

  addSpaza(){
    this.navCtrl.navigateForward('/addspaza');
    // this.router.navigate(['/addspaza']);
  }

  showCatalog(spazaID:string){
    this.router.navigate(["/catalog",{spazaID: spazaID,userID : this.userID}]);
  }
}
