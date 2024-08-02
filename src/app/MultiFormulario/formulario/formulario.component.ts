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
import { FormStateService } from 'src/app/services/FormState.service';

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
  progresoGral = 0;
  showPopUp = false;
  
  sectionsForm = [
    {title: 'Captacion', checked: false, component: this.captacionComp, dataComp: {} as any},
    {title: 'Filtro', checked: false, component: this.filtroComp, dataComp: {} as any},
    {title: 'Entrevista', checked: false, component: this.entrevistaComp, dataComp: {} as any},
    {title: 'Evaluaciones, Documentos', checked: false, component: this.evaluacionComp, dataComp: {} as any},
  ];

  constructor(
    private router: Router,
    private authService: AuthService,
    private servicioCompartido : SharedService,
    private formState : FormStateService,
    private rhService: RHService,
    private regionService: RegionService,
    private candidatoService: CandidatoService
  ) {}
  
  ngOnInit(): void {
    this.fetchRHInfo();
    this.currentSection();
  }
  
  ngAfterViewInit() {
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
      this.sectionsForm[this.currentPart - 1].component = currentComponent;
      this.sectionsForm[this.currentPart - 1].dataComp = currentComponent.data;
      console.log('Entro a la validacion para guardar datos');
      console.log(currentComponent.data);
    }
    // console.log('Estado de los componentes hijos en el padre:')
    // for(let hijo of this.sectionsForm){
    //   console.log(hijo.dataComp)
    // }
  }

  async sendData() {
    try {
      this.saveCurrentSectionData();
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
    console.log('Datos del formulario completo');
    console.log(dataForm);
    return dataForm;
  }

  mapCandidatoDataToICandidato(data: CandidatoData): ICandidato {
    return {
      id: data.id,
      region: data.captacion?.region ?? '',
      sistema: data.captacion?.sistema ?? '',
      fuenteCaptacion: data.captacion?.fuenteCaptacion ?? '',
      responsable: data.captacion?.responsable ?? '',
      nombreCandidato: data.captacion?.nombreCandidato ?? '',
      genero: data.captacion?.genero ?? '',
      telefono: data.captacion?.telefono ?? '',
      puestoSolicitado: data.captacion?.puestoSolicitado ?? '',
      fechaCaptacion: data.captacion?.fechaCaptacion ?? '',
      edad: data.filtro?.edad ?? 0,
      escolaridad: data.filtro?.escolaridad ?? '',
      fechaPrimerContacto: data.filtro?.fechaPrimerContacto ?? '',
      tipoCandidato: data.filtro?.tipoCandidato ?? '',
      tipoEntrevista: data.filtro?.tipoEntrevista ?? '',
      estatusPrimerEntrevista: data.filtro?.estatusPrimerEntrevista ?? '',
      fechaEntrevista: data.segundaEntrevista?.fechaSegundaEntrevista ?? '',
      estatusSegundaEntrevista: data.segundaEntrevista?.estatusSegundaEntrevista ?? '',
      tipoEntrevistaSegunda: data.segundaEntrevista?.tipoSegundaEntrevista ?? '',
      validacionSindicato: data.evaluaciones?.validacionSindicato ?? '',
      estatusGeneralPsicometria: data.evaluaciones?.estatusGeneralPsicometria ?? '',
      referenciasLaborales: data.evaluaciones?.referenciasLaborales ?? '',
      examenManejo: data.evaluaciones?.examenManejo ?? '',
      estatusGeneralDocumentos: data.evaluaciones?.estatusGeneralDocumentos ?? '',
      estatusGeneral: data.evaluaciones?.estatusGeneral ?? '',
      fechaIngreso: data.evaluaciones?.fechaIngreso ?? '',
      promedioDiasCobertura: this.getPromDiasCobertura(
        data.filtro?.fechaPrimerContacto ?? '',
        data.evaluaciones?.fechaIngreso ?? ''
      ),
      rhId: data.rhId ?? 0,
      progreso: this.setProgresoGral() ?? 0
    };
  }
  
  

  sendCandidato(): Promise<ICandidato> {
    return new Promise((resolve, reject) => {
      if (this.currentRh && this.candidatoData) {
        let dataForm = this.mapCandidatoDataToICandidato(this.candidatoData);
        dataForm.rhId = this.currentRh.usuarioID;
        dataForm.promedioDiasCobertura = this.getPromDiasCobertura(
          this.candidatoData.filtro?.fechaPrimerContacto ?? '',
          this.candidatoData.evaluaciones?.fechaIngreso ?? ''
        );
  
        this.candidatoService.addCandidato(dataForm).subscribe(
          (res) => {
            console.log('Candidato enviado exitosamente', res);
            resolve(res);
          },
          (error) => {
            console.error('Error al enviar candidato', error);
            reject(error);
          }
        );
      } else {
        console.log('Faltaron datos o algo salió mal');
        reject('Algo salió mal');
      }
    });
  }

  updateProgreso(progreso : number, index : number){
    console.log('Progreso recibido: ' + progreso)
    this.sectionsForm[index].dataComp.progreso = progreso;
    console.log(this.sectionsForm[index])
    this.setProgresoGral();
  }
  
  setProgresoGral(){
    let progreso = 0
    for(let comp of this.sectionsForm){
      progreso += comp.dataComp.progreso;
      //console.log(comp.dataComp)
    }
    this.candidatoData.progreso = progreso;
    return progreso;
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