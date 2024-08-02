import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IEntrevista } from '../Modelos';
import { FormStateService } from 'src/app/services/FormState.service';

@Component({
  selector: 'app-entrevista',
  templateUrl: './entrevista.component.html',
  styleUrls: ['./entrevista.component.css']
})
export class EntrevistaComponent implements OnInit {

  title = 'Entrevista';
  progreso = 0;
  @Output() progresoChange = new EventEmitter<number>();
  dropOpciones: { [key: string]: string[] } = {
    'tipoCandidato': ['Nuevo', 'Reingreso', 'Independiente'],
    'tipoEntrevista': ['Presencial', 'Virtual', 'Telefonica'],
    'estatusEntrevista': ['Aceptado', 'Rechazado', 'No se presento'],
    'validacionSindicato': ['Aceptado', 'Rechazado', 'No se presento', 'No aplica al puesto']
  };
  
  @Input() data: IEntrevista = {
    fechaSegundaEntrevista:'',
    estatusSegundaEntrevista:'',
    tipoSegundaEntrevista: '',
    progreso: 0
  };

  entrevistaForm!: FormGroup;
  isCompleted: boolean = false;
  private formKey = 'entrevista';

  constructor(
    private fb: FormBuilder,
    private formState: FormStateService
  ){
    this.entrevistaForm = this.fb.group({
        fechaSegundaEntrevista: ['', Validators.required],
        estatusSegundaEntrevista: ['', Validators.required],
        tipoSegundaEntrevista: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    const savedState = this.formState.getFormState(this.formKey);
    if(savedState){
      this.entrevistaForm.patchValue(savedState);
    }else{
      this.entrevistaForm.patchValue(this.data);
    }
    this.entrevistaForm.valueChanges.subscribe(
      ()=> {
        this.checkAllFieldsFilled();
      }
    );
    this.checkAllFieldsFilled();
  }

  getOpciones(grupo: string) {
    return this.dropOpciones[grupo];
  }

  saveData() {
    this.data = this.entrevistaForm.value;
    this.data.progreso = this.progreso;
    this.data.fechaSegundaEntrevista = this.formatDateToYYYYMMDD(this.data.fechaSegundaEntrevista)
    console.log(this.data);
    this.saveFormState();
    this.progresoChange.emit(this.data.progreso)
  }

  private saveFormState(){
    this.formState.saveFormState(this.formKey ,this.entrevistaForm.value);
  }
  private checkAllFieldsFilled() {
    this.isCompleted = Object.values(this.entrevistaForm.controls).every(control => control.value !== null && control.value !== '');
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
