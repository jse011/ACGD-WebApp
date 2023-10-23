export const environment = {
  production: true,
  appname: 'sedapal',

  //##############################################CONFIGURACION ################################################
  //#########CONFIGURACION DESARROLLO-local
  //serviceEndpoint: 'http://localhost:8080/api',
  //serviceEndpointAuth: 'http://localhost:8080/auth',
  //pathImagen: '',
  //rangoFechas:60,
  //#########CONFIGURACION  DESARROLLO
  // serviceEndpoint: 'http://apitra.sedapal.com.pe/acgd-qa/api',
  // serviceEndpointAuth: 'http://apitra.sedapal.com.pe/acgd-qa/auth',
  // pathImagen: '/acgd',
  // rangoFechas:6,
  // rangoIntervalo:10

  //#########CONFIGURACION  QA
  serviceEndpoint: 'http://apin1qa.sedapal.com.pe/acgd/api',
  serviceEndpointAuth: 'http://apin1qa.sedapal.com.pe/acgd/auth',
  pathImagen: '/acgd',
  rangoFechas:6,
  rangoIntervalo:10


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
