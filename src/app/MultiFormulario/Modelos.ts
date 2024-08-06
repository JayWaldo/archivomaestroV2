export interface IPrimerContacto{
    fechaPrimerContactoRedesSociales : any,
    fechaPrimerContactoReclutador : any,
    estatusPrimerContacto: string,
}
export interface IEstatus{
    estatusGeneral : string
}
export interface IAlta{
    fechCierreFolio: any,
    fechaIngreso: any,
    promDiasCobertura: number,
}

export interface ICaptacion{
    region: string;
    sistema: string;
    fuenteCaptacion: string;
    responsable: string;
    nombreCandidato: string;
    genero: string;
    telefono: string;
    puestoSolicitado: string;
    fechaCaptacion: string;
    progreso: number;
}
export interface IFiltro{
    edad: number;
    escolaridad:string;
    fechaPrimerContacto:string;
    tipoCandidato:string;
    tipoEntrevista:string;
    estatusPrimerEntrevista:string;
    progreso: number;
}

export interface IEntrevista{
    fechaSegundaEntrevista:string;
    estatusSegundaEntrevista:string;
    tipoSegundaEntrevista: string;
    progreso: number;
}

export interface IEvaluaciones {
    validacionSindicato: string;
    estatusGeneralPsicometria: string;
    referenciasLaborales: string;
    examenManejo: string;
    estatusGeneralDocumentos: string;
    estatusGeneral: string;
    fechaIngreso: string;
    progreso: number;
}

export interface User {
    email: string;
    token: string;
}
export interface IRH{
    usuarioID: number;
    nombre: string;
    correo: string;
    contrasena: string;
    regionID: number;
    puesto: string;
    nivelAccesoID: number;

}
export class CandidatoData{
    id!: number;
    captacion!: ICaptacion;
    filtro!: IFiltro;
    segundaEntrevista!: IEntrevista;
    evaluaciones !: IEvaluaciones;
    promedioDiasCobertura!: number;
    rhId!: number;
    progreso!: number;

    constructor(){
        this.captacion = {} as ICaptacion;
        this.filtro = {} as IFiltro;
        this.segundaEntrevista = {} as IEntrevista;
        this.evaluaciones = {} as IEvaluaciones;
    }

    mapCandidatoToComponents(candidato : ICandidato){
        this.id = candidato.id;
        this.captacion.region = candidato.region;
        this.captacion.sistema = candidato.sistema;
        this.captacion.fuenteCaptacion = candidato.fuenteCaptacion;
        this.captacion.responsable = candidato.responsable;
        this.captacion.nombreCandidato = candidato.nombreCandidato;
        this.captacion.genero = candidato.genero;
        this.captacion.telefono = candidato.telefono;
        this.captacion.puestoSolicitado = candidato.puestoSolicitado;
        this.captacion.fechaCaptacion = candidato.fechaCaptacion;
        this.filtro.edad = candidato.edad;
        this.filtro.escolaridad = candidato.escolaridad;
        this.filtro.fechaPrimerContacto = candidato.fechaPrimerContacto;
        this.filtro.tipoCandidato = candidato.tipoCandidato;
        this.filtro.tipoEntrevista = candidato.tipoEntrevista;
        this.filtro.estatusPrimerEntrevista = candidato.estatusPrimerEntrevista;
        this.segundaEntrevista.fechaSegundaEntrevista = candidato.fechaEntrevista;
        this.segundaEntrevista.estatusSegundaEntrevista = candidato.estatusSegundaEntrevista;
        this.segundaEntrevista.tipoSegundaEntrevista = candidato.tipoEntrevistaSegunda;
        this.evaluaciones.validacionSindicato = candidato.validacionSindicato;
        this.evaluaciones.estatusGeneralPsicometria = candidato.estatusGeneralPsicometria;
        this.evaluaciones.referenciasLaborales = candidato.referenciasLaborales;
        this.evaluaciones.examenManejo = candidato.examenManejo;
        this.evaluaciones.estatusGeneralDocumentos = candidato.estatusGeneralDocumentos;
        this.evaluaciones.estatusGeneral = candidato.estatusGeneral;
        this.evaluaciones.fechaIngreso = candidato.fechaIngreso;
        this.rhId = candidato.rhId;
        this.progreso = candidato.progreso;
    }
}
export interface ICandidato{
    id: number;
    region: string;
    sistema: string;
    fuenteCaptacion: string;
    responsable: string;
    nombreCandidato: string;
    genero: string;
    telefono: string;
    puestoSolicitado: string;
    fechaCaptacion: string;
    edad: number;
    escolaridad: string;
    fechaPrimerContacto: string;
    tipoCandidato: string;
    tipoEntrevista: string;
    estatusPrimerEntrevista: string;
    fechaEntrevista: string;
    estatusSegundaEntrevista: string;
    tipoEntrevistaSegunda: string;
    validacionSindicato: string;
    estatusGeneralPsicometria: string;
    referenciasLaborales: string;
    examenManejo: string;
    estatusGeneralDocumentos: string;
    estatusGeneral: string;
    fechaIngreso: string;
    promedioDiasCobertura: number;
    rhId: number;
    progreso: number;

}
export interface IRegion{
    regionID: number;
    region: string;
    sistema: string;
}

export interface ICandidatoTabla{
    No: number;
    Id: number;
    Nombre: string;
    Region: string;
    Sistema: string;
    Reclutador: string;
    Progreso: number;
    Estatus: string;
}

export interface RHNivelResponse {
    message: string;
}