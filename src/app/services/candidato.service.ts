import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { ICandidato, IRH } from '../MultiFormulario/Modelos';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CandidatoService {
  private api = 'https://localhost:7153';

  constructor(
    private http: HttpClient, 
    private authService: AuthService,
) { }

  getCandidatos(rhId: number): Observable<ICandidato[]>{
    
    const token = this.authService.getToken();
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    const url = `${this.api}/candidato/${rhId}`;

    return this.http.get<ICandidato[]>(url);
  }

  getCandidatoById(rhId : number, candidatoId : number) : Observable<ICandidato>{
    const token = this.authService.getToken();
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    const url = `${this.api}/candidato/${rhId}/${candidatoId}`;

    return this.http.get<ICandidato>(url, { headers });
  }

  getCandidatoByName(rhId: number, name: string): Observable<ICandidato[]>{
    const token = this.authService.getToken();
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    const url = `${this.api}/candidato/${rhId}/find?name=${name}`;

    return this.http.get<ICandidato[]>(url, { headers });
  }

  
  addCandidato(candidato: ICandidato): Observable<ICandidato>{
    const token = this.authService.getToken();
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });

    const url = `${this.api}/candidato`
    return this.http.post<ICandidato>(url, candidato, { headers })
  }

  updateCandidato(candidato: ICandidato): Observable<ICandidato>{
    const token = this.authService.getToken();
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });

    const url = `${this.api}/candidato/${candidato.id}`
    return this.http.put<ICandidato>(url, candidato, { headers })
  }

  deleteCandidato(id: number): Observable<void>{
    const token = this.authService.getToken();
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });

    const url = `${this.api}/candidato/${id}`
    return this.http.delete<void>(url, { headers })
  }
}
