import { Component, Input, OnInit, Output, EventEmitter, SimpleChange, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';
import { RegionService } from 'src/app/services/region.service';
import { FormStateService } from 'src/app/services/FormState.service';
import { ICaptacion, IRegion } from 'src/app/MultiFormulario/Modelos';

@Component({
  selector: 'app-captacion',
  templateUrl: './captacion.component.html',
  styleUrls: ['./captacion.component.css']
})
export class CaptacionComponent implements OnInit {
  title = 'Captacion'
  regionList: IRegion[] = [];
  filteredSystems: string[] = [];
  captacionForm: FormGroup;
  isCompleted: boolean = false;
  progreso = 0;
  @Output() progresoChange = new EventEmitter<number>();
  @Output() dataChange = new EventEmitter<ICaptacion>();
  private formKey = 'captacionForm';
  fuentesCaptacion = [
    'AGENCIAS LOCALES',
    'ANUNCIOS DE TRANSPORTE',
    'BOLSA DE EMPLEO MEGA',
    'CETIS',
    'COMPUTRABAJO',
    'CONALEP',
    'DGTI',
    'EMPLEOS TI',
    'FERIA PRESENCIAL MEGA',
    'FERIA VIRTUAL MEGA',
    'HAWAIANA',
    'HEAD HUNTERS',
    'INDEED',
    'LINKEDIN',
    'LONA',
    'OCC',
    'PERIFONEO',
    'PERIODICO',
    'RADIO',
    'REDES SOCIALES EMPLEOS MEGA',
    'REDES SOCIALES RECLUTADOR',
    'REFERIDO',
    'UNIVERSIDADES',
    'VOLANTE'
  ]
  vacantes = [
    'Chofer',
    'Vendedor',
    'Admin Contable',
    'Desarrollador',
    'Promotor de Cambaceo',
    'Administrador',
    'Ingeniero'
  ]
  @Input() editMode: boolean = false;
  @Input() data: ICaptacion = {
    region: '',
    sistema: '',
    fuenteCaptacion: '',
    responsable: '',
    nombreCandidato: '',
    genero: '',
    telefono: '',
    puestoSolicitado: '',
    fechaCaptacion: '',
    progreso: 0
  }

  constructor(
    private authService: AuthService,
    private regionService: RegionService,
    private formState: FormStateService,
    private fb: FormBuilder
  ) {
    this.captacionForm = this.fb.group({
      region: ['', Validators.required],
      sistema: ['', Validators.required],
      fuenteCaptacion: ['', Validators.required],
      responsable: ['', Validators.required],
      nombreCandidato: ['', Validators.required],
      genero: ['', Validators.required],
      telefono: ['', [
        Validators.required,
        Validators.pattern('^[0-9]*$'),
        Validators.minLength(10),
        Validators.maxLength(10)
      ]],
      puestoSolicitado: ['', Validators.required],
      fechaCaptacion: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.fetchRegion();
    this.loadData(this.data);
  }

  ngOnChanges(changes: SimpleChanges){
    if(changes.data && !changes.data.firstChange){
      this.loadData(this.data);
    }
  }

  onFormChange(){
    this.dataChange.emit(this.data)
  }

  loadData(candidatoData : ICaptacion): void{
    this.data = candidatoData;
    if(candidatoData){
      this.captacionForm.patchValue(candidatoData);
      this.updateFilteredSystems(candidatoData.region);
    }
    this.captacionForm.valueChanges.subscribe(() => {
      this.saveFormState();
      this.checkAllFieldsFilled();
    });
    this.checkAllFieldsFilled();
  }

  fetchRegion(): void {
    this.regionService.getRegionInfo().subscribe(
      (region: IRegion[]) => {
        this.regionList = region;
        this.updateFilteredSystems();
      },
      (error) => {
        console.error('Error al cargar las regiones: ' + error);
      }
    );
  }

  onRegionChange(event: Event): void {
    const selectElement = event.target as HTMLSelectElement;
    const selectedRegion = selectElement.value;
    this.updateFilteredSystems(selectedRegion);
  }

  updateFilteredSystems(selectedRegion?: string): void {
    if (!selectedRegion) {
      selectedRegion = this.captacionForm.get('region')?.value;
    }
    
    if (selectedRegion) {
      const selectedRegionObject = this.regionList.find(reg => reg.region === selectedRegion);
      if (selectedRegionObject) {
        this.filteredSystems = this.regionList
          .filter(reg => reg.region === selectedRegion)
          .map(reg => reg.sistema);
      } else {
        this.filteredSystems = [];
      }
    } else {
      this.filteredSystems = [];
    }
  }

  saveData(): void {
    this.data = this.captacionForm.value;
    this.data.progreso = this.progreso
    this.data.fechaCaptacion = this.formatDateToYYYYMMDD(this.data.fechaCaptacion);
    console.log(this.data);
    this.saveFormState();
    this.progresoChange.emit(this.data.progreso);
  }

  private saveFormState(): void {
    if(this.editMode || this.isCompleted){
      this.formState.saveFormState(this.formKey, this.captacionForm.value);
    }
  }

  private checkAllFieldsFilled(): void {
    this.isCompleted = Object.values(this.captacionForm.value).every(field => field !== '');
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
