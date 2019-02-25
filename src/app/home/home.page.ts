import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  loginForm: FormGroup;
  constructor(private fb: FormBuilder,private router: Router, private navCtrl:NavController){
    this.loginForm = fb.group({
      email: ['',Validators.compose([ Validators.pattern('^[a-zA-Z_.+-]+@[a-zA-Z-]+.[a-zA-Z0-9-.]+$'),Validators.required])],
      password: ['',Validators.compose([Validators.minLength(8),Validators.required])]
    });
  }
  login(){
    this.router.navigateByUrl('/myspazas');
  }

  signup(){
    this.router.navigateByUrl('/register')
  }
}