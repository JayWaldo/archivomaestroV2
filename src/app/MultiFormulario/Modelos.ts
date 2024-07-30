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
    Sistema: string;
    FuenteCaptacion: string;
    Responsable: string;
    NombreCandidato: string;
    Genero: string;
    Telefono: string;
    PuestoSolicitado: string;
    FechaCaptacion: string;
}
export interface IFiltro{
    Edad: number;
    Escolaridad:string;
    FechaContacto:string;
    TipoCandidato:string;
    TipoEntrevista:string;
    EstatusPrimeraEntrevista:string;
}

export interface IEntrevista{
    FechaSegundaEntrevista:string;
    EstatusSegundaEntrevista:string;
    TipoSegundaEntrevista: string;
}

export interface IEvaluaciones {
    ValidacionSindicato: string;
    EstatusGeneralpsicometria: string;
    ReferenciasLaborales: string;
    ExamenManejo: string;
    EstatusGeneralDocumentos: string;
    EstatusGeneral: string;
    Fechaingreso: string;
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
    FuenteCaptacion: string;
    Responsable: string;
    NombreCandidato: string;
    Genero: string;
    Telefono: string;
    PuestoSolicitado: string;
    fechaCaptacion: string;
    edad: number;
    Escolaridad: string;
    fechaPrimerContacto: string;
    TipoCandidato: string;
    TipoEntrevista: string;
    EstatusPrimerEntrevista: string;
    fechaEntrevista: string;
    estatusSegundaEntrevista: string;
    TipoEntrevistaSegunda: string;
    ValidacionSindicato: string;
    EstatusGeneralPsicometria: string;
    ReferenciasLaborales: string;
    ExamenManejo: string;
    EstatusGeneralDocumentos: string;
    EstatusGeneral: string;
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