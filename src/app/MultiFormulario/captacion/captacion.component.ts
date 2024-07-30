import { Component, Input, OnInit } from '@angular/core';
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
    'chofer',
    'vendedor',
    'Admin Contable',
    'Desarrollador'
  ]

  @Input() data: ICaptacion = {
    region: '',
    Sistema: '',
    FuenteCaptacion: '',
    Responsable: '',
    NombreCandidato: '',
    Genero: '',
    Telefono: '',
    PuestoSolicitado: '',
    FechaCaptacion: ''
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
    const savedState = this.formState.getFormState(this.formKey);
    if (savedState) {
      this.captacionForm.patchValue(savedState);
    } else {
      this.captacionForm.patchValue(this.data);
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
        this.updateFilteredSystems();  // Inicializar los sistemas filtrados
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
    console.log(this.data);
    this.saveFormState();
  }

  private saveFormState(): void {
    this.formState.saveFormState(this.formKey, this.captacionForm.value);
  }

  private checkAllFieldsFilled(): void {
    this.isCompleted = Object.values(this.captacionForm.value).every(field => field !== '');
  }
}
