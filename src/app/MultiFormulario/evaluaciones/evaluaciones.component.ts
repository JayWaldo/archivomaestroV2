import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FormStateService } from 'src/app/services/FormState.service';
import { IEvaluaciones } from '../Modelos';

@Component({
  selector: 'app-evaluaciones',
  templateUrl: './evaluaciones.component.html',
  styleUrls: ['./evaluaciones.component.css']
})
export class EvaluacionesComponent implements OnInit {
  title = 'Evaluaciones, Documentos y Alta'
  dropOpciones: { [key: string]: string[] } = {
    'validacionSindicato': ['Aceptado', 'Rechazado', 'No se presento', 'No aplica al puesto'],
    'estatus': ['APROBADA', 'NO APRUEBA INTEGRITEST', 'NO APRUEBA TT', 'NO APRUEBA AVATAR', 'NO APRUEBA POTENCIAL INTELECTUAL', 'NO APRUEBA TERMAN', 'NO APRUEBA REDDIN'],
    'referenciasLaborales': ['CON RECOMENDACION', 'CON CONSTANCIA', 'CON RESERVAS', 'NO APTO POR CIRCULO LABORAL', 'NO APTO POR ESE', 'NO APTO POR REFERENCIAS LABORALES'],
    'examManejo': ['APROBADO', 'NO APROBADO', 'CON RESERVAS', 'NO LE APLICA AL PUESTO'],
    'documentos' : ['ENTREGADO', 'NO ENTREGADO'],
    'estatusGral': ['DECLINO POR MEJOR OFERTA ECONOMICA',
    'NO APRUEBA PSICOMETRIAS',
    'DEJO DE RESPONDER',
    'NO QUEDO POR DISTANCIA',
    'NO APRUEBA MEDICO',
    'NO ENTREGO DOCUMENTOS COMPLETOS',
    'CONTRATADO',
    'PROCESO EN PAUSA',
    'NO INICIO PROCESO',
    'PROBLEMAS DE HORARIOS',
    'PROBLEMAS CON BANCOS',
    'FAMILIARES EN LA EMPRESA',
    'CSF NO ACTUALIZADA',
    'REINGRESO NO VIABLE',
    'VACANTE DETENIDA',
    'NO TIENE EQUIPO COMPATIBLE CON APK']
  };
  @Input() data: IEvaluaciones = {
    ValidacionSindicato: '',
    EstatusGeneralpsicometria: '',
    ReferenciasLaborales: '',
    ExamenManejo: '',
    EstatusGeneralDocumentos: '',
    EstatusGeneral: '',
    Fechaingreso: ''
  };
  evaluacionForm !: FormGroup;
  isCompleted: boolean = false;
  private formKey = 'evaluaciones';
  constructor(
    private fb: FormBuilder,
    private formState: FormStateService
  ) { 
    this.evaluacionForm = this.fb.group({
      ValidacionSindicato: ['', Validators.required],
      EstatusGeneralpsicometria: ['', Validators.required],
      ReferenciasLaborales: ['', Validators.required],
      ExamenManejo: ['', Validators.required],
      EstatusGeneralDocumentos: ['', Validators.required],
      EstatusGeneral: ['', Validators.required],
      Fechaingreso: ['', Validators.required]
    })
  }

  ngOnInit(): void {
    const savedState = this.formState.getFormState(this.formKey);
    if(savedState){
      this.evaluacionForm.patchValue(savedState);
    }else{
      this.evaluacionForm.patchValue(this.data);
    }
    this.evaluacionForm.valueChanges.subscribe(
      ()=> {
        this.checkAllFieldsFilled();
      }
    );
    this.checkAllFieldsFilled();
  }

  getOpciones(grupo: string) {
    return this.dropOpciones[grupo];
  }

  saveData(){
    this.data = this.evaluacionForm.value
    console.log(this.data);
    this.saveFormState();
  }

  private saveFormState(){
    this.formState.saveFormState(this.formKey ,this.evaluacionForm.value);
  }
  private checkAllFieldsFilled()
  {
    this.isCompleted = Object.values(this.evaluacionForm.value).every(field => field !== '' || field !== null);
  }
}
