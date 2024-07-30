import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SharedService {
  private enviarMsjSujeto = new BehaviorSubject<string>('');
  mensaje$ = this.enviarMsjSujeto.asObservable();

  private enviarDatosRegistro = new BehaviorSubject<any>(null);
  data$ = this.enviarDatosRegistro.asObservable();

  enviarMensaje(mensaje: string){
    this.enviarMsjSujeto.next(mensaje);
  }

  enviarDatos(datos: any){
    this.enviarDatosRegistro.next(datos);
  }
}
