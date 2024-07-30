import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'
import { BehaviorSubject, Observable } from 'rxjs';
import { Router } from '@angular/router';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private api = 'https://localhost:7153';
  private loggedInSubject = new BehaviorSubject<boolean>(false);
  public authStatus = this.loggedInSubject.asObservable();
  apiStatus = false;

  constructor(private http: HttpClient, private router: Router) {
    this.loggedInSubject.next(this.isLoggedIn());
  }

  validateUser() {
    const email = this.getEmail();
    if (email) {
      this.http.get(`${this.api}/auth/validateUser`, { params: { email } }).subscribe(
        (response: any) => {
          if (response.exists) {
            this.loggedInSubject.next(true);
          } else {
            this.logout(); // Si el usuario no existe, cerrar sesión
          }
        },
        error => {
          console.error('Error al validar usuario', error);
          this.logout(); // En caso de error, cerrar sesión
        }
      );
    } else {
      this.logout(); // Si no hay email, cerrar sesión
    }
  }

  login(email: string, password: string):Observable<any>{
    // Guardar en localstorage JWT para la sesion
    return this.http.post<{token: string}>(`${this.api}/auth/login`, { email, password })
    .pipe(
      tap(res => {
        const token = res.token;
        localStorage.setItem('token', token);
        localStorage.setItem('email', email);
        this.loggedInSubject.next(true);
      })
    );
  }
  logout() {
    // Quitar del localstorage cuando cierra sesion
    localStorage.removeItem('token');
    localStorage.removeItem('email');
    this.loggedInSubject.next(false);
    this.router.navigate(['/login'])
  }

  getToken() : string | null {
    return localStorage.getItem('token');
  }

  getEmail() : string | null {
    return localStorage.getItem('email');
  }

  isLoggedIn() : boolean{
    const token = this.getToken();
    return !!token;
  }

  checkApiConnection() {
    this.http.get(`${this.api}/ping`).subscribe(
      () => {
        console.log('API is working');
        this.apiStatus = true;
        this.loggedInSubject.next(this.isLoggedIn());
      },
      error => {
        console.error('API is not listening', error);
        this.apiStatus = false;
        this.loggedInSubject.next(false);
        this.router.navigate(['/login']);
      }
    );
  }
}
