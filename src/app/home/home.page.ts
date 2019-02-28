import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NavController, LoadingController, AlertController, ToastController, Platform } from '@ionic/angular';

declare var firebase;
declare var google;
@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})


export class HomePage {
  // private autocomplete_init: boolean= false;
  
  loginForm: FormGroup;
  input;
  constructor( public platform: Platform ,private fb: FormBuilder,private router: Router, private navCtrl:NavController,public loadingCtrl: LoadingController,private alertCtrl: AlertController,private toastCtrl: ToastController ){
    this.loginForm = fb.group({
      email: ['',Validators.compose([ Validators.pattern('^[a-zA-Z_.+-]+@[a-zA-Z-]+.[a-zA-Z0-9-.]+$'),Validators.required])],
      password: ['',Validators.compose([Validators.minLength(8),Validators.required])]
    });

  }

  ngOnInit(){
   
    this.input = document.getElementById('googlePlaces');  //.getElementsByTagName('myInput')[0];
    let autocomplete = new google.maps.places.Autocomplete(this.input, {types: ['geocode']});

  // this.autocompleteFocus();
  }

  
  async login(){
    

    const loading = await this.loadingCtrl.create({
      spinner: 'bubbles',
      duration: 5000,
      message: 'Please wait...',
      translucent: true,
      cssClass: 'custom-class custom-loading'
    });
    await loading.present();

    firebase.auth().signInWithEmailAndPassword(this.loginForm.value.email, this.loginForm.value.password).then(user =>{
      this.router.navigate(['/myspazas']);
    },error => {
      loading.dismiss();
      this.showPopup("Login Error!", "Incorrect Email or Password!");
    });
    
  }

  signup(){
    this.router.navigate(['/register']);
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


  // showPopup(title, text) {
  //   let alert = this.alertCtrl.create({
  //     title: "<u>" + title + "</u>",
  //     subTitle: text,
  //     buttons: [
  //       {
  //         text: 'OK',
  //         handler: data => {
  //           if (this.isUserLoggedIn) {
  //             this.navCtrl.popToRoot();
  //           }
  //         }
  //       }
  //     ]
  //   });
  //   alert.present();
  // }


 
}