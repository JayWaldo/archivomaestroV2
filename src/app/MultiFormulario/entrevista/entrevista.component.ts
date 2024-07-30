import { Component, Input, OnInit } from '@angular/core';
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
  dropOpciones: { [key: string]: string[] } = {
    'tipoCandidato': ['Nuevo', 'Reingreso', 'Independiente'],
    'tipoEntrevista': ['Presencial', 'Virtual', 'Telefonica'],
    'estatusEntrevista': ['Aceptado', 'Rechazado', 'No se presento'],
    'validacionSindicato': ['Aceptado', 'Rechazado', 'No se presento', 'No aplica al puesto']
  };
  
  @Input() data: IEntrevista = {
    FechaSegundaEntrevista:'',
    EstatusSegundaEntrevista:'',
    TipoSegundaEntrevista: ''
  };

  entrevistaForm!: FormGroup;
  isCompleted: boolean = false;
  private formKey = 'entrevista';

  constructor(
    private fb: FormBuilder,
    private formState: FormStateService
  ){
    this.entrevistaForm = this.fb.group({
        FechaSegundaEntrevista: ['', Validators.required],
        EstatusSegundaEntrevista: ['', Validators.required],
        TipoSegundaEntrevista: ['', Validators.required]
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
    const formValue = this.entrevistaForm.value;
    // const fechaEntrevista = this.formatDate(formValue.fechaPrimerEntrevista);
    // formValue.fechaPrimerEntrevista = fechaEntrevista;
    this.data = this.entrevistaForm.value;
    console.log(formValue);

    this.saveFormState();
  }

  formatDate(date: any): string {
    const parsedDate = new Date(date);
    if (isNaN(parsedDate.getTime())) return '';
    const day = parsedDate.getDate().toString().padStart(2, '0');
    const month = (parsedDate.getMonth() + 1).toString().padStart(2, '0');
    const year = parsedDate.getFullYear();
    return `${day}/${month}/${year}`;
  }
  private saveFormState(){
    this.formState.saveFormState(this.formKey ,this.entrevistaForm.value);
  }
  private checkAllFieldsFilled() {
    this.isCompleted = Object.values(this.entrevistaForm.controls).every(control => control.value !== null && control.value !== '');
  }
}
