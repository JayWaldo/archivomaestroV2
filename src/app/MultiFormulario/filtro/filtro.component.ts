import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FormStateService } from 'src/app/services/FormState.service';
import { IFiltro } from '../Modelos';

@Component({
  selector: 'app-filtro',
  templateUrl: './filtro.component.html',
  styleUrls: ['./filtro.component.css']
})
export class FiltroComponent implements OnInit {
  title = 'Filtro';
  filtroForm !: FormGroup;
  isCompleted: boolean = false;
  private formKey = 'datosFiltro';
  escolaridadList = [
    'Primaria Terminada',
    'Primaria Trunca',
    'Secundaria Terminada',
    'Secundaria Trunca',
    'Preparatoria Terminada',
    'Preparatoria Trunca',
    'Licenciatura Terminada',
    'Licenciatura Trunca'
  ]
  dropOpciones: { [key: string]: string[] } = {
    'tipoCandidato': ['Nuevo', 'Reingreso', 'Independiente'],
    'tipoEntrevista': ['Presencial', 'Virtual', 'Telefonica'],
    'estatusEntrevista': ['Aceptado', 'Rechazado', 'No se presento']
    };
  @Input() data : IFiltro = {
    Edad: 0,
    Escolaridad:'',
    FechaContacto:'',
    TipoCandidato:'',
    TipoEntrevista:'',
    EstatusPrimeraEntrevista:''
  }

  constructor(
    private formState: FormStateService,
    private fb: FormBuilder
  ) {
    this.filtroForm = this.fb.group({
      edad: ['', Validators.required],
      escolaridad: ['', Validators.required],
      fechaContacto: ['', Validators.required],
      tipoCandidato: ['', Validators.required],
      tipoEntrevista: ['', Validators.required],
      estatusPrimerEntrevista: ['', Validators.required]
    })
   }

  ngOnInit(): void {
    const savedState = this.formState.getFormState(this.formKey);
    if (savedState) {
      this.filtroForm.patchValue(savedState);
    } else {
      this.filtroForm.patchValue(this.data);
    }

    this.filtroForm.valueChanges.subscribe(() => {
      this.saveFormState();
      this.checkAllFieldsFilled();
    });

    this.checkAllFieldsFilled();
  }

  saveData(){
    this.data = this.filtroForm.value
    console.log(this.data);
    this.saveFormState();
  }

  getOpciones(grupo: string) {
    return this.dropOpciones[grupo];
  }

  private saveFormState(){
    this.formState.saveFormState(this.formKey ,this.filtroForm.value);
  }
  private checkAllFieldsFilled()
  {
    this.isCompleted = Object.values(this.filtroForm.value).every(field => field !== '' || field !== null);
  }
}
