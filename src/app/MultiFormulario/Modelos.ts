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

    constructor(){}

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