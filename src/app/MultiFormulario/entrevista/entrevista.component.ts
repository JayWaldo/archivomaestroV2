import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IEntrevista, IFiltro } from '../Modelos';
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
  @Output() dataChange = new EventEmitter<IEntrevista>();
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

  onFormChange(){
    this.dataChange.emit(this.data);
  }

  ngOnInit(): void {
    this.loadData(this.data);
    this.checkAllFieldsFilled();
  }

  loadData(entrevistaData : IEntrevista){
    this.data = entrevistaData;
    if(entrevistaData){
      this.entrevistaForm.patchValue(entrevistaData);
    }
    this.entrevistaForm.valueChanges.subscribe(
      () => {
        this.saveFormState();
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
    this.saveFormState();
    this.progresoChange.emit(this.data.progreso)
  }

  private saveFormState(){
    this.formState.saveFormState(this.formKey ,this.entrevistaForm.value);
  }
  private checkAllFieldsFilled() {
    this.isCompleted = Object.values(this.entrevistaForm.value).every(field => field !== '' || field !== null);
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
