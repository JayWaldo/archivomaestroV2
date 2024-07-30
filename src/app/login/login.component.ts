import { animate, state, style, transition, trigger } from '@angular/animations';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  animations: [
    trigger('fadeInOut', [
      state('void', style({
        opacity: 0
      })),
      state('*', style({
        opacity: 1
      })),
      transition('void => *', [
        animate('0.8s ease-out')
      ])
    ])
  ]
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  loading = false;
  submitted = false;
  error : string = '';

  constructor(
    private router: Router,
    private authService : AuthService
  ) {
    //Redireccionar si ya inicio sesion
    if(this.authService.isLoggedIn()){
      this.router.navigate(['/inicio'])
    }

    this.loginForm = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', Validators.required)
    });
   }

  ngOnInit(): void {
  }

  get f(){ return this.loginForm.controls;}

  onSubmit(){
    this.submitted = true;

    if(this.loginForm.invalid){
      return;
    }

    this.loading = true;
    const email = this.f.email.value;
    const password = this.f.password.value;

    this.authService.login(email, password).subscribe(
      () => {
        this.router.navigate(['/inicio']);
      }, (err) => {
        this.error = 'Datos incorrectos';
        this.loading = false;
      }
    )
  }
}
