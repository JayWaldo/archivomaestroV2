import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { IRegion, IRH, ICandidato, CandidatoData } from '../Modelos';
import { AuthService } from 'src/app/services/auth.service';
import { RHService } from 'src/app/services/rh.service';
import { CandidatoService } from 'src/app/services/candidato.service';
import { RegionService } from 'src/app/services/region.service';
import { Router } from '@angular/router';
import { CaptacionComponent } from '../captacion/captacion.component';
import { FiltroComponent } from '../filtro/filtro.component';
import { EntrevistaComponent } from '../entrevista/entrevista.component';
import { EvaluacionesComponent } from '../evaluaciones/evaluaciones.component';
import { SharedService } from 'src/app/services/shared.service';

@Component({
  selector: 'app-formulario',
  templateUrl: './formulario.component.html',
  styleUrls: ['./formulario.component.css'],
  animations: [
    trigger('fadeInOut', [
      state('void', style({
        opacity: 0
      })),
      state('*', style({
        opacity: 1
      })),
      transition('void => *', [
        animate('0.8s ease-out')
      ])
    ]),
    trigger('fadeInOutEase', [
      state('void', style({
        opacity: 0
      })),
      state('*', style({
        opacity: 1
      })),
      transition('void => *', [
        animate('0.8s ease-out')
      ]),
      transition('* => void', [
        animate('0.8s ease-out')
      ])
    ])
  ]
})
export class FormularioComponent implements OnInit, AfterViewInit {
  @ViewChild(CaptacionComponent) captacionComp!: CaptacionComponent;
  @ViewChild(FiltroComponent) filtroComp!: FiltroComponent;
  @ViewChild(EntrevistaComponent) entrevistaComp!: EntrevistaComponent;
  @ViewChild(EvaluacionesComponent) evaluacionComp!: EvaluacionesComponent;

  currentRh!: IRH;
  candidatoData = new CandidatoData();

  showPopUp = false;
  
  sectionsForm = [
    {title: 'Captacion', checked: false, component: {} as CaptacionComponent, dataComp: {} as any},
    {title: 'Filtro', checked: false, component: {} as FiltroComponent, dataComp: {} as any},
    {title: 'Entrevista', checked: false, component: {} as EntrevistaComponent, dataComp: {} as any},
    {title: 'Evaluaciones, Documentos', checked: false, component: {} as EvaluacionesComponent, dataComp: {} as any},
  ];

  constructor(
    private router: Router,
    private authService: AuthService,
    private servicioCompartido : SharedService,
    private rhService: RHService,
    private regionService: RegionService,
    private candidatoService: CandidatoService
  ) {}
  
  ngOnInit(): void {
    this.fetchRHInfo();
  }
  
  ngAfterViewInit() {
    this.sectionsForm[0].component = this.captacionComp;
    this.sectionsForm[1].component = this.filtroComp;
    this.sectionsForm[2].component = this.entrevistaComp;
    this.sectionsForm[3].component = this.evaluacionComp;
    this.currentSection();
  }

  currentPart: number = 1;
  
  currentSection() {
    this.sectionsForm[this.currentPart - 1].checked = true;
  }
   
  btnNext() {
    const currentComponent = this.getCurrentComponent();
    if (currentComponent && currentComponent.isCompleted) {
      this.saveCurrentSectionData();
      this.sectionsForm[this.currentPart - 1].checked = false;
      this.currentPart += 1;
      this.sectionsForm[this.currentPart - 1].checked = true;
    }
  }

  btnPrev() {
    this.saveCurrentSectionData();
    this.sectionsForm[this.currentPart - 1].checked = false;
    this.currentPart -= 1;
    this.sectionsForm[this.currentPart - 1].checked = true;
  }

  goToSection(index: number) {
    const currentComponent = this.getCurrentComponent();
    if (currentComponent && currentComponent.isCompleted) {
      this.saveCurrentSectionData();
      this.sectionsForm[this.currentPart - 1].checked = false;
      this.currentPart = index + 1;
      this.sectionsForm[this.currentPart - 1].checked = true;
    }
  }

  saveCurrentSection() {
    this.saveCurrentSectionData();
    this.showPopUp = true;
    setTimeout(() => {
      this.showPopUp = false;
    }, 3000);
  }

  saveCurrentSectionData(){
    const currentComponent = this.getCurrentComponent();
    if(currentComponent){
      currentComponent.saveData();
      this.sectionsForm[this.currentPart - 1].dataComp = currentComponent.data;
      console.log('Entro a la validacion para guardar datos');
      console.log(currentComponent.data);
    }
    console.log('Estado de los componentes hijos en el padre:')
    for(let hijo of this.sectionsForm){
      console.log(hijo.dataComp)
    }
  }

  async sendData() {
    try {
      this.candidatoData = this.getFormDataAll();
      console.log(this.candidatoData);
      this.servicioCompartido.enviarDatos(this.candidatoData);
      await this.sendCandidato();
      this.router.navigate(['/candidatos'])
    } catch (error) {
      console.error('Error en el envío de datos: ', error);
    }
  }

  getPromDiasCobertura(fechaContacto: string, fechaIngreso: string) {
    const contacto = new Date(fechaContacto);
    const ingreso = new Date(fechaIngreso);

    const diferenciaMilisegundos = ingreso.getTime() - contacto.getTime();
    const diferenciaDias = diferenciaMilisegundos / (1000 * 3600 * 24);

    return diferenciaDias;
  }

  getFormDataAll() {
    const dataForm = new CandidatoData();
    dataForm.id = 0;
    dataForm.captacion = this.sectionsForm[0].dataComp;
    dataForm.filtro = this.sectionsForm[1].dataComp;
    dataForm.segundaEntrevista = this.sectionsForm[2].dataComp;
    dataForm.evaluaciones = this.sectionsForm[3].dataComp;
    dataForm.promedioDiasCobertura = 0;
    dataForm.rhId = this.currentRh.usuarioID;
    dataForm.progreso = 0;
    return dataForm;
  }

  sendCandidato(): Promise<ICandidato>{
    return new Promise(
        (resolve, reject) => {
          if (this.currentRh && 
            this.candidatoData.captacion && 
            this.candidatoData.evaluaciones && 
            this.candidatoData.filtro && 
            this.candidatoData.segundaEntrevista) {
            let dataForm: ICandidato = {
              id: 0,
              region: this.candidatoData.captacion.region,
              sistema: this.candidatoData.captacion.Sistema,
              FuenteCaptacion: this.candidatoData.captacion.FuenteCaptacion,
              Responsable: this.candidatoData.captacion.Responsable,
              NombreCandidato: this.candidatoData.captacion.NombreCandidato,
              Genero: this.candidatoData.captacion.Genero,
              Telefono: this.candidatoData.captacion.Telefono,
              PuestoSolicitado: this.candidatoData.captacion.PuestoSolicitado,
              fechaCaptacion: this.candidatoData.captacion.FechaCaptacion,
              edad: this.candidatoData.filtro.Edad,
              Escolaridad: this.candidatoData.filtro.Escolaridad,
              fechaPrimerContacto: this.candidatoData.filtro.FechaContacto,
              TipoCandidato: this.candidatoData.filtro.TipoCandidato,
              TipoEntrevista: this.candidatoData.filtro.TipoEntrevista,
              EstatusPrimerEntrevista: this.candidatoData.filtro.EstatusPrimeraEntrevista,
              fechaEntrevista: this.candidatoData.segundaEntrevista.FechaSegundaEntrevista,
              estatusSegundaEntrevista: this.candidatoData.segundaEntrevista.EstatusSegundaEntrevista,
              TipoEntrevistaSegunda: this.candidatoData.segundaEntrevista.TipoSegundaEntrevista,
              ValidacionSindicato: this.candidatoData.evaluaciones.ValidacionSindicato,
              EstatusGeneralPsicometria: this.candidatoData.evaluaciones.EstatusGeneralpsicometria,
              ReferenciasLaborales: this.candidatoData.evaluaciones.ReferenciasLaborales,
              ExamenManejo: this.candidatoData.evaluaciones.ExamenManejo,
              EstatusGeneralDocumentos: this.candidatoData.evaluaciones.EstatusGeneralDocumentos,
              EstatusGeneral: this.candidatoData.evaluaciones.EstatusGeneral,
              fechaIngreso: this.candidatoData.evaluaciones.Fechaingreso,
              promedioDiasCobertura: this.getPromDiasCobertura(this.candidatoData.filtro.FechaContacto, this.candidatoData.evaluaciones.Fechaingreso),
              rhId: this.currentRh.usuarioID,
              progreso:0
            };
            this.candidatoService.addCandidato(dataForm).subscribe(
              (res)=>{
                console.log('Candidato enviado exitosamente' + res);
                resolve(res);
              }, (error) =>{
                console.log(dataForm);
                console.error('Error al enviar candidato ' + error);
                reject(error);
              }
            )
          } else {
            console.log('Faltaron datos o algo salio mal');
            reject('Algo salio mal')
          }
        }
      )
  }

  fetchRHInfo(){
    const email = this.authService.getEmail()
    if(email !== null){
      this.rhService.getRHinfo(email).subscribe(
        (rh: IRH) => {
          this.currentRh = rh;
        },
        (error) => {
          console.error('Error al traer informacion ' + error);
        }
      )
    } else {
      console.error('Correo electronico no encontrado en localStorage.');
    }
  }

  getCurrentComponent(){
    switch (this.currentPart){
      case 1:
        return this.captacionComp;
      case 2:
        return this.filtroComp;
      case 3:
        return this.entrevistaComp;
      case 4:
        return this.evaluacionComp;
      default:
        return null;
    }
  }
}
// 