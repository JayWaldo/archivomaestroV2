import { Component, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { AuthService } from '../services/auth.service';
import { CandidatoService } from '../services/candidato.service';
import { ICandidato, IRH, RHNivelResponse } from '../MultiFormulario/Modelos';
import { RHService } from '../services/rh.service';

@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.component.html',
  styleUrls: ['./inicio.component.css'],
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
export class InicioComponent implements OnInit{
  currentUser ?: IRH;
  candidatos: ICandidato[] = [];
  candidatosInfo = {noRegistros: 0, completados: 0, porTerminar: 0}
  rol ?: string;

  constructor(
    private route: Router,
    private authService: AuthService,
    private rhService: RHService,
    private candidatoService: CandidatoService){
    }
    
    
    ngOnInit(): void {
      this.fetchRHInfo();
  }

  fetchRHInfo() {
    const email = this.authService.getEmail();
    if (email !== null) {
      this.rhService.getRHinfo(email).subscribe(
        (rh: IRH) => {
          this.currentUser = rh;
          this.cargarCandidatos(rh.usuarioID);
          // Aquí llamas a getRHNivel usando el accessId del RH.
          if (rh.nivelAccesoID) {
            this.rhService.getRHNivel(rh.nivelAccesoID).subscribe(
              (nivel: RHNivelResponse) => {
                this.rol = nivel.message;
              },
              (error) => {
                console.error('Error al obtener el nivel del RH:', error);
              }
            );
          } else {
            console.error('El RH no tiene un accessId asignado.');
          }
        },
        (error) => {
          console.error('Error al traer información del RH:', error);
        }
      );
    } else {
      console.error('Correo electrónico no encontrado en localStorage.');
    }
  }
  

  cargarCandidatos(rhId: number): void{
    this.candidatoService.getCandidatos(rhId).subscribe(
      (candidatos: ICandidato[]) => {
        this.candidatos = candidatos;
      }, (error) => {
        console.error('Error al cargar candidatos: ' + error);
      }
    );
  }
  
  goToSection(opcion: number){
    if(opcion === 1){
      this.route.navigate(['/candidatos']);
    } else {
      this.route.navigate(['/registro']);
    }
  }
}
