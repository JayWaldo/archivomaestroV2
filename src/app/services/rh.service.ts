import { HttpClient, HttpHandler, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { BehaviorSubject, Observable } from 'rxjs';
import { IRH, RHNivelResponse } from '../MultiFormulario/Modelos';

@Injectable({
  providedIn: 'root'
})
export class RHService {
  private api = 'https://localhost:7153';

  constructor(private http: HttpClient, private authService: AuthService) { }

  getRHinfo(email: string): Observable<IRH>{
    const token = this.authService.getToken();
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    return this.http.get<IRH>(`${this.api}/rh/find?mail=${email}`, { headers });
  }
  
  getRHById(rhId: number): Observable<IRH>{
    const token = this.authService.getToken();
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    return this.http.get<IRH>(`${this.api}/rh/${rhId}`, { headers });
  }

  getRHNivel(accessId: number): Observable<RHNivelResponse>{
    const token = this.authService.getToken();
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    return this.http.get<RHNivelResponse>(`${this.api}/rh/access/${accessId}`, { headers });
  }
}
