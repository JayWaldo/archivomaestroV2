import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { SharedService } from '../services/shared.service';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { AuthService } from '../services/auth.service';
import { RHService } from '../services/rh.service';
import { CandidatoService } from '../services/candidato.service';
import { CandidatoData, ICandidato, ICandidatoTabla, IRH, RHNivelResponse } from '../MultiFormulario/Modelos';
import { RegionService } from '../services/region.service';
import { CaptacionComponent } from '../MultiFormulario/captacion/captacion.component';
import { FiltroComponent } from '../MultiFormulario/filtro/filtro.component';
import { EntrevistaComponent } from '../MultiFormulario/entrevista/entrevista.component';
import { EvaluacionesComponent } from '../MultiFormulario/evaluaciones/evaluaciones.component';

@Component({
  selector: 'app-candidatos',
  templateUrl: './candidatos.component.html',
  styleUrls: ['./candidatos.component.css'],
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
    ])
  ],
})
export class CandidatosComponent implements OnInit, AfterViewInit {

  title = 'Candidatos';
  currentUser ?: IRH;
  candidatosList: ICandidato[] = [];
  tableData: ICandidatoTabla[] = [];
  columnNames: string[] = ['No', 'Id', 'Nombre', 'Region', 'Sistema', 'Reclutador', 'Progreso', 'Estatus', 'Opciones'];
  opcionesPagina = [5, 10, 20]
  noPaginas = 5;
  currentPagina = 0;
  sortColumn: string = '';
  sortDirection: 'asc' | 'desc' = 'asc';
  areUSure = false;
  editView = false;
  candidatoToEdit = new CandidatoData();
  candidatoDeleteId : number = 0;
  rol?: string;
  selectedOption = 1;
  
  @ViewChild(CaptacionComponent) captacionComp!: CaptacionComponent;
  @ViewChild(FiltroComponent) filtroComp!: FiltroComponent;
  @ViewChild(EntrevistaComponent) entrevistaComp!: EntrevistaComponent;
  @ViewChild(EvaluacionesComponent) evaluacionComp!: EvaluacionesComponent;

  constructor(
    private router: Router,
    private authService: AuthService,
    private rhService: RHService,
    private candidatoService: CandidatoService,
    private regionService: RegionService) { }
  ngOnInit(): void {
    this.fetchRHInfo();
  }
  ngAfterViewInit(): void {
    setTimeout(() => {
      this.cargarDatosEnComponentes();
    }, 0);
  }
  
  fetchRHInfo() {
    const email = this.authService.getEmail();
    if (email !== null) {
      this.rhService.getRHinfo(email).subscribe(
        (rh: IRH) => {
          this.currentUser = rh;
          this.cargarCandidatos(rh.usuarioID);
          // Aquí llamas a getRHNivel usando el accessId del RH.
          if (rh.nivelAccesoID) {
            this.rhService.getRHNivel(rh.nivelAccesoID).subscribe(
              (nivel: RHNivelResponse) => {
                this.rol = nivel.message;
              },
              (error) => {
                console.error('Error al obtener el nivel del RH:', error);
              }
            );
          } else {
            console.error('El RH no tiene un accessId asignado.');
          }
        },
        (error) => {
          console.error('Error al traer información del RH:', error);
        }
      );
    } else {
      console.error('Correo electrónico no encontrado en localStorage.');
    }
  }
  

  cargarCandidatos(rhId: number): void{
    this.candidatoService.getCandidatos(rhId).subscribe(
      (candidatos: ICandidato[]) => {
        this.candidatosList = candidatos;
        this.cargarDatosEnArray();
      }, (error) => {
        console.error('Error al cargar candidatos: ' + error);
      }
    );
  }

  cargarReclutadorDelCandidato(rhId: number): Promise<string>{
    return new Promise((resolve, reject) => {
      this.rhService.getRHById(rhId).subscribe(
        (res) => {
          resolve(res.nombre);
        }, (error) => {
          console.error('No se pudo recuperar el nombre del Reclutador ' + error);
        }
      )
    })
  }

  getRegionById(id: number): Promise<string>{
    return new Promise((resolve, reject) => {
      this.regionService.getRegionById(id).subscribe(
        (res) => {
          resolve(res.region);
        }, (error) => {
          console.error('No se pudo traer la region ' + error);
          reject("No se pudo traer la region")
        }
      )
    })
  }
  getSistemaByRegionId(id: number): Promise<string>{
    return new Promise((resolve, reject) => {
      this.regionService.getRegionById(id).subscribe(
        (res) => {
          resolve(res.sistema);
        }, (error) => {
          console.error('No se pudo traer el sistema ' + error);
          reject("No se pudo traer el sistema")
        }
      )
    })
  }

  async cargarDatosEnArray(){
    try{
      for(let candi of this.candidatosList){
        const reclutador = await this.cargarReclutadorDelCandidato(candi.rhId);
        let candidato : ICandidatoTabla = {
          No: 0,
          Id: candi.id,
          Nombre: candi.nombreCandidato,
          Region: candi.region,
          Sistema: candi.sistema,
          Reclutador: reclutador,
          Progreso: candi.progreso,
          Estatus: candi.estatusGeneral
        }
        this.tableData.push(candidato);
        this.tableData[this.tableData.indexOf(candidato)].No = this.tableData.indexOf(candidato) + 1;
      }
    } catch (error){
      console.error(error);
    }
  }

  goToRegistro(){
    this.router.navigate(['/registro']);
  }

  private cargarDatosEnComponentes() {
    if (this.selectedOption === 1 && this.captacionComp) {
      this.captacionComp.loadData(this.candidatoToEdit.captacion);
    }
  
    if (this.selectedOption === 2 && this.filtroComp) {
      this.filtroComp.loadData(this.candidatoToEdit.filtro);
    }
  
    if (this.selectedOption === 3 && this.entrevistaComp) {
      this.entrevistaComp.loadData(this.candidatoToEdit.segundaEntrevista);
    }
  
    if (this.selectedOption === 4 && this.evaluacionComp) {
      this.evaluacionComp.loadData(this.candidatoToEdit.evaluaciones);
    }
  }

  editarRegistro(index: number) {
    this.candidatoToEdit.mapCandidatoToComponents(this.candidatosList[index]);
    console.log(this.candidatoToEdit);
    this.editView = true;
  
    setTimeout(() => {
      if (this.selectedOption === 1 && this.captacionComp) {
        this.captacionComp.loadData(this.candidatoToEdit.captacion);
      }
  
      if (this.selectedOption === 2 && this.filtroComp) {
        this.filtroComp.loadData(this.candidatoToEdit.filtro);
      }
  
      if (this.selectedOption === 3 && this.entrevistaComp) {
        this.entrevistaComp.loadData(this.candidatoToEdit.segundaEntrevista);
      }
  
      if (this.selectedOption === 4 && this.evaluacionComp) {
        this.evaluacionComp.loadData(this.candidatoToEdit.evaluaciones);
      }
    }, 0);
  }
  
  
  btnPrev(){
    if(this.selectedOption > 1){
      this.selectedOption --;
    }
  }
  btnNext(){
    if(this.selectedOption < 4){
      this.selectedOption ++;
    }
  }

  closeEdit(){
    this.editView = false;
  }

  onDataChange(data: any, section: string) {
    switch (section) {
      case 'captacion':
        this.candidatoToEdit.captacion = data;
        break;
      case 'filtro':
        this.candidatoToEdit.filtro = data;
        break;
      case 'segundaEntrevista':
        this.candidatoToEdit.segundaEntrevista = data;
        break;
      case 'evaluaciones':
        this.candidatoToEdit.evaluaciones = data;
        break;
      default:
        console.error('Sección desconocida:', section);
    }
  }

  saveEdit(){
    this.updateCandidatoEdit();
    this.editView = !this.editView;
  }
  msgEliminar(index:number){
    this.areUSure = true;
    if(index > -1 && index < this.candidatosList.length){
      this.candidatoDeleteId = this.candidatosList[index].id;
    }
  }
  eliminarRegistro(){
    this.candidatoService.deleteCandidato(this.candidatoDeleteId).subscribe(
      ()=> {
        this.candidatosList = this.candidatosList.filter(c => c.id !== this.candidatoDeleteId);
        this.tableData = this.tableData.filter(c => c.Id !== this.candidatoDeleteId);
        this.areUSure = false;
      }, (error) => {
        console.log('Error al eliminar el candidato: ' + error);
      }
    )
  }
  updateCandidatoEdit(){
    this.candidatoToEdit.captacion = this.captacionComp.data;
    this.candidatoToEdit.filtro = this.filtroComp.data;
    this.candidatoToEdit.segundaEntrevista = this.entrevistaComp.data;
    this.candidatoToEdit.evaluaciones = this.evaluacionComp.data;
    console.log(this.candidatoToEdit);
  }

  currentComp(index : number){
    if(index === 1){
      return this.captacionComp
    } else if (index === 2){
      return this.filtroComp
    } else if (index === 3){
      return this.entrevistaComp
    } else if (index === 4){
      return this.evaluacionComp
    }
  }

  cancelar(){
    this.areUSure = false;
  }

  startIndex(): number{
    return this.currentPagina * this.noPaginas;
  }
  endIndex(): number{
    return Math.min(this.startIndex() + this.noPaginas, this.tableData.length);
  }

  nextPage(){
    this.currentPagina++;
  }
  prevPage(){
    this.currentPagina--;
  }

  hasPrevPage(): boolean{
    return this.currentPagina !== 0;
  }

  hasNextPage(): boolean{
    return (this.currentPagina + 1) * this.noPaginas < this.tableData.length
  }

  sortData(column: string) {
    if (this.sortColumn === column) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortColumn = column;
      this.sortDirection = 'asc';
    }
  
    this.tableData.sort((a, b) => {
      let comparison = 0;
      const valueA = a[column as keyof ICandidatoTabla];
      const valueB = b[column as keyof ICandidatoTabla];

      if (typeof valueA === 'string' && typeof valueB === 'string') {
        comparison = valueA.localeCompare(valueB);
      } else if (typeof valueA === 'number' && typeof valueB === 'number') {
        comparison = valueA - valueB;
      } else {
        comparison = valueA > valueB ? 1 : valueA < valueB ? -1 : 0;
      }
  
      return this.sortDirection === 'asc' ? comparison : -comparison;
    });
  }
  
}

