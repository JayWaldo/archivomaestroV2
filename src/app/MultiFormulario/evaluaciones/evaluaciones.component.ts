import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
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
    validacionSindicato: '',
    estatusGeneralPsicometria: '',
    referenciasLaborales: '',
    examenManejo: '',
    estatusGeneralDocumentos: '',
    estatusGeneral: '',
    fechaIngreso: '',
    progreso: 0
  };
  evaluacionForm !: FormGroup;
  isCompleted: boolean = false;
  progreso = 0;
  @Output() progresoChange = new EventEmitter<number>();
  private formKey = 'evaluaciones';
  constructor(
    private fb: FormBuilder,
    private formState: FormStateService
  ) { 
    this.evaluacionForm = this.fb.group({
      validacionSindicato: ['', Validators.required],
      estatusGeneralPsicometria: ['', Validators.required],
      referenciasLaborales: ['', Validators.required],
      examenManejo: ['', Validators.required],
      estatusGeneralDocumentos: ['', Validators.required],
      estatusGeneral: ['', Validators.required],
      fechaIngreso: ['', Validators.required]
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
    this.data.progreso = this.progreso;
    this.data.fechaIngreso = this.formatDateToYYYYMMDD(this.data.fechaIngreso);
    console.log(this.data);
    this.saveFormState();
    this.progresoChange.emit(this.data.progreso)
  }

  private saveFormState(){
    this.formState.saveFormState(this.formKey ,this.evaluacionForm.value);
  }
  private checkAllFieldsFilled()
  {
    this.isCompleted = Object.values(this.evaluacionForm.value).every(field => field !== '' || field !== null);
    if(this.isCompleted){
      this.progreso = 25;
      this.progresoChange.emit(this.data.progreso);
    }
  }
  private formatDateToYYYYMMDD(dateString: string): string {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = ('0' + (date.getMonth() + 1)).slice(-2);
    const day = ('0' + date.getDate()).slice(-2);
    return `${year}-${month}-${day}`;
  }
}
