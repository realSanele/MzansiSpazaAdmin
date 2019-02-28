import { LoadingController } from '@ionic/angular';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { async } from '@angular/core/testing';

declare var firebase;
@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {
  signUpForm : FormGroup;

  constructor(private fb: FormBuilder, private router: Router, private loadingController: LoadingController) {
    this.signUpForm = fb.group({
      email: ['',Validators.compose([ Validators.pattern('^[a-zA-Z_.+-]+@[a-zA-Z-]+.[a-zA-Z0-9-.]+$'),Validators.required])],
      password: ['',Validators.compose([Validators.minLength(8),Validators.required])],
      name: ['',Validators.compose([Validators.pattern('[a-zA-Z ]*'),Validators.minLength(4),Validators.maxLength(30),Validators.required])],
      surname: ['',Validators.compose([Validators.pattern('[a-zA-Z ]*'),Validators.minLength(4),Validators.maxLength(30),Validators.required])]
    });
  }

  ngOnInit() {
  }

  async register(){
    const loading = await this.loadingController.create({
      spinner: 'bubbles',
      duration: 5000,
      message: 'Please wait...',
      translucent: true,
      cssClass: 'custom-class custom-loading'
    });
    await loading.present();

    // const { role, data } = await loading.onDidDismiss();
    firebase.auth().createUserWithEmailAndPassword(this.signUpForm.value.email, this.signUpForm.value.password).then(userResult => {
      this.signUpForm.reset();
      console.log(userResult.user.uid);
      firebase.database().ref('/users/'+userResult.user.uid).set({
        email : this.signUpForm.value.email,
        name: this.signUpForm.value.name,
        surname : this.signUpForm.value.surname
      })
      this.router.navigateByUrl('/myspazas');
      loading.dismiss();
    });
  }

  // async presentLoading() {
  //   const loadingController = document.querySelector('ion-loading-controller');
  //   await loadingController.componentOnReady();
  
  //   const loadingElement = await loadingController.create({
  //     message: 'Please wait...',
  //     spinner: 'crescent',
  //     duration: 2000
  //   });
  //   return await loadingElement.present();
  // }

}
