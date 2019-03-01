import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NavController, LoadingController, AlertController, ToastController, Platform } from '@ionic/angular';
import { AngularWaitBarrier } from 'blocking-proxy/built/lib/angular_wait_barrier';

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
  constructor(private alertController: AlertController, public platform: Platform ,private fb: FormBuilder,private router: Router, private navCtrl:NavController,public loadingCtrl: LoadingController,private alertCtrl: AlertController,private toastCtrl: ToastController ){
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

  async resetPassword(){
    const alert = await this.alertController.create({
      header: 'Reset Password',
      inputs: [
        {
          name: 'email',
          type: 'email',
          // value: item.itemName,
          placeholder: 'Enter Email'
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
          text: 'Reset',
          handler: (inputData) => {
            // firebase.database().ref('/spazas/'+this.spazaID+'/catalog/'+item.itemID).update({
            //   itemName : inputData.itemName,
            //   itemPrice : inputData.itemPrice
            // }).then(updateResult =>{
            //   alert.dismiss();
            //   this.ngOnInit();
            // })

            firebase.auth().sendPasswordResetEmail(inputData.email).then(function() {
              // Email sent.
              this.showPopup("Confirm Email!", "An email with password reset link sent to your email.")
              alert.dismiss();
            },error => {
              // loading.dismiss();
              this.showPopup("Error!", "Invalide Email!");
            });
          }
        }
      ]
    });

    await alert.present();
    
  }
 
}