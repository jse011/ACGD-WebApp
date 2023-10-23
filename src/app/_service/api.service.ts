import {Injectable} from '@angular/core';
import {environment} from '../../environments/environment';

@Injectable()
export class ApiService {
  //login = environment.api + '/login';
  //authService = '/autenticacion-usuario';
  parameterService = '/valores';
  dataloggerService = '/dataloggers';
  reporteService = '/reporte';
  cargManualService = '/carga-manual';
  validacionDatosService = '/validacion-datos';
  validacionCodDatService = '/checkValid';

  //API PARAMETROS
  listParameters = environment.serviceEndpoint + this.parameterService + '/obtener-valores-parametro';
  addParameter = environment.serviceEndpoint + this.parameterService + '/crear-valores';
  editParameter = environment.serviceEndpoint + this.parameterService + '/actualizar-valores';
  deleteParameter = environment.serviceEndpoint + this.parameterService + '/eliminar-valores';
  listParameterCombo = environment.serviceEndpoint +  this.parameterService + '/obtener-valores-combo';

    //API DATALOGGER
    listDataloggers = environment.serviceEndpoint + this.dataloggerService + '/obtener-dataloggers';
    listDataloggersPorEquipo = environment.serviceEndpoint + this.dataloggerService + '/obtener-dataloggers-por-equipo';
    listDataloggersPorGerencia = environment.serviceEndpoint + this.dataloggerService + '/obtener-dataloggers-por-gerencia';
    listDataloggersPorDistrito = environment.serviceEndpoint + this.dataloggerService + '/obtener-dataloggers-por-distrito';

    listDataloggersPDF = environment.serviceEndpoint + this.dataloggerService + '/obtener-dataloggers-pdf';
    listDataloggersPorEquipoPDF = environment.serviceEndpoint + this.dataloggerService + '/obtener-dataloggers-por-equipo-pdf';
    listDataloggersPorGerenciaPDF = environment.serviceEndpoint + this.dataloggerService + '/obtener-dataloggers-por-gerencia-pdf';
    listDataloggersPorDistritoPDF = environment.serviceEndpoint + this.dataloggerService + '/obtener-dataloggers-por-distrito-pdf';

    addDatalogger = environment.serviceEndpoint + this.dataloggerService + '/crear-dataloggers';
    editDatalogger = environment.serviceEndpoint + this.dataloggerService + '/actualizar-dataloggers';
    deleteDatalogger = environment.serviceEndpoint + this.dataloggerService + '/eliminar-dataloggers';
    moverDatalogger = environment.serviceEndpoint + this.dataloggerService + '/mover-dataloggers';
    planoGisDatalogger  = environment.serviceEndpoint + this.dataloggerService + '/gis-dataloggers';
    listDataloggerCombo = environment.serviceEndpoint +  this.dataloggerService + '/obtener-dataloggers-combo';
    listDataloggerComboArea = environment.serviceEndpoint +  this.dataloggerService + '/obtener-dataloggers-combo-area';
    listDataloggerComboEquipo = environment.serviceEndpoint +  this.dataloggerService + '/obtener-dataloggers-combo-equipo';
    listDataloggerComboGerencia = environment.serviceEndpoint +  this.dataloggerService + '/obtener-dataloggers-combo-gerencia';
    listDataloggerComboDistrito = environment.serviceEndpoint +  this.dataloggerService + '/obtener-dataloggers-combo-distrito';
    listDataloggerComboZona = environment.serviceEndpoint +  this.dataloggerService + '/obtener-dataloggers-combo-zona';
    listDataloggerComboTiempo = environment.serviceEndpoint +  this.dataloggerService + '/obtener-dataloggers-combo-tiempo';
    listDataloggerComboSector = environment.serviceEndpoint +  this.dataloggerService + '/obtener-dataloggers-combo-sector';
    listDataloggerComboIndicador = environment.serviceEndpoint +  this.dataloggerService + '/obtener-dataloggers-combo-indicador';
    listDataloggerComboEstado = environment.serviceEndpoint +  this.dataloggerService + '/obtener-dataloggers-combo-estado';

    //API REPORTE
    listVolumenPorEquipo = environment.serviceEndpoint + this.reporteService + '/obtener-volumen-por-equipo';
    listPresion = environment.serviceEndpoint + this.reporteService + '/obtener-presion';
    listCaudal = environment.serviceEndpoint + this.reporteService + '/obtener-caudal';
    listNivel = environment.serviceEndpoint + this.reporteService + '/obtener-nivel';
    listVolumen = environment.serviceEndpoint + this.reporteService + '/obtener-volumen';
    listBateria = environment.serviceEndpoint + this.reporteService + '/obtener-bateria';
    listSeisValoresEomr = environment.serviceEndpoint + this.reporteService + '/obtener-seis-valores-eomr';
    listEstadistico = environment.serviceEndpoint + this.reporteService + '/obtener-estadistico';

    listVolumenPorEquipoPDF = environment.serviceEndpoint + this.reporteService + '/obtener-volumen-por-equipo-pdf';
    listPresionPDF = environment.serviceEndpoint + this.reporteService + '/obtener-presion-pdf';
    listCaudalPDF = environment.serviceEndpoint + this.reporteService + '/obtener-caudal-pdf';
    listNivelPDF = environment.serviceEndpoint + this.reporteService + '/obtener-nivel-pdf';
    listVolumenPDF = environment.serviceEndpoint + this.reporteService + '/obtener-volumen-pdf';
    listBateriaPDF = environment.serviceEndpoint + this.reporteService + '/obtener-bateria-pdf';
    listSeisValoresEomrPDF = environment.serviceEndpoint + this.reporteService + '/obtener-seis-valores-eomr-pdf';
    listEstadisticoPDF = environment.serviceEndpoint + this.reporteService + '/obtener-estadistico-pdf';

    //API MANTENIMIENTO
    importacionManual = environment.serviceEndpoint + this.cargManualService + '/read-excel';
    listImportacionManual = environment.serviceEndpoint + this.cargManualService + '/listar-importacion-manual';
    verDetalleImportacionManual = environment.serviceEndpoint + this.cargManualService + '/ver-detalle-importacion-manual';
    cancelarImportacion = environment.serviceEndpoint + this.cargManualService + '/cancelar-importacion';

    //API VALIDACION DATOS
    observarValidacionDatos = environment.serviceEndpoint + this.validacionDatosService + '/observar-validacion-datos';
    validar = environment.serviceEndpoint + this.validacionDatosService + '/validar';
    checkvalid = environment.serviceEndpoint + this.validacionDatosService + '/checkValid';
    listValidacionDatos = environment.serviceEndpoint + this.validacionDatosService + '/listar-validacion-datos';
    verDetalleValidacionDatos = environment.serviceEndpoint + this.validacionDatosService + '/ver-detalle-validacion-datos';
}