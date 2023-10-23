// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  appname: 'sedapal',

  //##############################################CONFIGURACION ################################################
  //#########CONFIGURACION DESARROLLO-local
  serviceEndpoint: 'http://localhost:8080/api',
  serviceEndpointAuth: 'http://localhost:8080/auth',
  pathImagen: '',
  rangoFechas:6,
  rangoIntervalo:10
  //#########CONFIGURACION  DESARROLLO
  //serviceEndpoint: 'http://apitra.sedapal.com.pe/acgd/api',
  //serviceEndpointAuth: 'http://apitra.sedapal.com.pe/acgd/auth',
  //pathImagen: '/acgd'


  //#########CONFIGURACION  QA
  //serviceEndpoint: 'http://apitra.sedapal.com.pe/acgd-qa/api',
  //serviceEndpointAuth: 'http://apitra.sedapal.com.pe/acgd-qa/auth',
  //pathImagen: '/acgd'


  //#########CONFIGURACION  PRODUCCION
  //serviceEndpoint: 'http://apitra.sedapal.com.pe/acgd/api',
  //serviceEndpointAuth: 'http://apitra.sedapal.com.pe/acgd/auth',
  //pathImagen: '/acgd'

  // ##############################################################################################################
};

export let titulos = {
  titulo: '',
  subtitulo1: '',
  subtitulo2: '',
  marquesina: ''
}

export let imagenes = {
  urlBase: '',
  carpetaImagenes: '',
  logo: '',
  background: '',
  descCarousel1: '',
  descCarousel2: '',
  descCarousel3: '',
  descCarousel4: '',
  carousel1: '',
  carousel2: '',
  carousel3: '',
  carousel4: '',
  banner: '',
  sidenav: '',
  logo_color: ''
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
