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
    fechaSegundaEntrevista:'',
    estatusSegundaEntrevista:'',
    tipoSegundaEntrevista: ''
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
    this.data.fechaSegundaEntrevista = this.formatDateToYYYYMMDD(this.data.fechaSegundaEntrevista)
    console.log(this.data);

    this.saveFormState();
  }

  private saveFormState(){
    this.formState.saveFormState(this.formKey ,this.entrevistaForm.value);
  }
  private checkAllFieldsFilled() {
    this.isCompleted = Object.values(this.entrevistaForm.controls).every(control => control.value !== null && control.value !== '');
  }
  private formatDateToYYYYMMDD(dateString: string): string {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = ('0' + (date.getMonth() + 1)).slice(-2);
    const day = ('0' + date.getDate()).slice(-2);
    return `${year}-${month}-${day}`;
  }
}
