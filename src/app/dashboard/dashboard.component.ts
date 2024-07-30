import { AfterViewInit, ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { InicioComponent } from '../inicio/inicio.component';
import { RegistroComponent } from '../registro/Registro.component';
import { FormularioComponent } from '../MultiFormulario/formulario/formulario.component';
import { CandidatosComponent } from '../candidatos/candidatos.component';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { IRH } from '../MultiFormulario/Modelos';
import { RHService } from '../services/rh.service';

@Component({
  selector: 'dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
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
export class DashboardComponent implements OnInit,AfterViewInit{
  navList = [
    {title: "Inicio", icon: "fas fa-home", route: "/inicio" },
    {title: "Candidatos", icon: "fas fa-user", route: "/candidatos" },
    {title: "Registro", icon: "fas fa-file-alt", route: "/registro" },
  ];
  currentUser !: IRH;
  selectedItem: string = '/inicio';
  
  constructor(
    private router: Router, 
    private route: ActivatedRoute, 
    private rhService: RHService, 
    private authService: AuthService){
  }

  ngOnInit(): void {
    if(this.authService.isLoggedIn()){
      this.fetchRHInfo();
    } else {
      this.router.navigate(['/login']);
    }

    this.router.events.subscribe(event => {
      if(event instanceof NavigationEnd){
        this.updateSelectedItem(event.url);
      }
    })
  }
  ngAfterViewInit(): void {
      if(this.router.url !== '/inicio'){
        this.router.navigate(['/inicio']);
      }
  }

  fetchRHInfo(){
    const email = this.authService.getEmail()
    if(email !== null){
      this.rhService.getRHinfo(email).subscribe(
        (rh: IRH) => {
          this.currentUser = rh;
        },
        (error) => {
          console.error('Error al traer informacion ' + error);
        }
      )
    } else {
      console.error('Correo electronico no encontrado en localStorage.');
    }
  }

  selectItem(route: string): void {
    this.selectedItem = route;
    this.router.navigate([route]);
  }

  updateSelectedItem(url: string){
    const updateUrl = this.navList.find(item => url.includes(item.route));
    if(updateUrl){
      this.selectedItem = updateUrl.route;
    }
  }
  logOut(){
    this.authService.logout();
  }
}
