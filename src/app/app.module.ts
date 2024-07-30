import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'
import { AppComponent } from './app.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MAT_DATE_LOCALE, MatNativeDateModule } from '@angular/material/core';
import localMx from '@angular/common/locales/en-Gb'
import { HttpClientModule } from '@angular/common/http';

import { DashboardComponent } from './dashboard/dashboard.component';
import { RegistroComponent } from './registro/Registro.component';
import { FormularioComponent } from './MultiFormulario/formulario/formulario.component';
import { InicioComponent } from './inicio/inicio.component';
import { registerLocaleData } from '@angular/common';
import { SharedService } from './services/shared.service';
import { CandidatosComponent } from './candidatos/candidatos.component';
import { AppRoutingModule } from './app-routing.module';
import { EditarComponent } from './editar/editar.component';
import { LoginComponent } from './login/login.component';
import { CaptacionComponent } from './MultiFormulario/captacion/captacion.component';
import { FiltroComponent } from './MultiFormulario/filtro/filtro.component';
import { EntrevistaComponent } from './MultiFormulario/entrevista/entrevista.component';
import { MatButtonModule } from '@angular/material/button';
import { EvaluacionesComponent } from './MultiFormulario/evaluaciones/evaluaciones.component';

registerLocaleData(localMx, 'en-GB');

@NgModule({
  declarations: [
    AppComponent,
    DashboardComponent,
    RegistroComponent,
    FormularioComponent,
    InicioComponent,
    CandidatosComponent,
    EditarComponent,
    LoginComponent,
    CaptacionComponent,
    FiltroComponent,
    EntrevistaComponent,
    EvaluacionesComponent
  ],
  imports: [
    AppRoutingModule,
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    MatDatepickerModule,
    MatInputModule,
    MatNativeDateModule,
    MatButtonModule,
    HttpClientModule,
    CommonModule,
    ReactiveFormsModule
  ],
  providers: [{provide: MAT_DATE_LOCALE, useValue: 'es-GB'}, SharedService],
  bootstrap: [AppComponent]
})
export class AppModule { }
