import { Component, OnInit } from '@angular/core';
import { DashboardComponent } from './dashboard/dashboard.component';
import { LoginComponent } from './login/login.component';
import { AuthService } from './services/auth.service';
import { animate, state, style, transition, trigger } from '@angular/animations';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
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
export class AppComponent implements OnInit{
  title = 'Archivo Maestro';
  loggedIn = false;

  constructor(private authService: AuthService){ }

  ngOnInit(): void {
    this.authService.authStatus.subscribe( status => {
      this.loggedIn = status;
    });
    this.authService.checkApiConnection();
  }
}
