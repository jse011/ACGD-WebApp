import { Injectable } from '@angular/core';
import * as logoFile from 'src/assets/js/logo.js';
import * as fs from 'file-saver';
//import * as ExcelProper from 'exceljs';
import * as ExcelProper from 'exceljs/dist/exceljs.min.js';
import * as Excel from 'exceljs/dist/exceljs.min.js';

const EXCEL_TYPE =
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
const EXCEL_EXTENSION = '.xlsx';

@Injectable()
export class ExcelService {
  async generateExcel(
    data: any[],
    excelFileName: string,
    titulo: string,
    tipoConsultaDatalogger: string
  ) {
    // Excel Title, Header
    const title = titulo;

    // Create workbook and worksheet
    // const workbook = new Excel.Workbook();
    const workbook: ExcelProper.Workbook = new Excel.Workbook();
    let worksheet = workbook.addWorksheet('DATA', {
      properties: { tabColor: { argb: '0084bc' } },
    });

    // Add Image
    const logo = workbook.addImage({
      base64: logoFile.logoBase64,
      extension: 'png',
    });

    // worksheet.addImage(logo, 'E1:F3');
    worksheet.addImage(logo, {
      tl: { col: 0, row: 0 },
      ext: { width: 200, height: 80 },
    });
    // Blank Row
    worksheet.addRow([]);
    worksheet.addRow([]);
    worksheet.addRow([]);
    worksheet.addRow([]);
    // Add Row and formatting
    const titleRow = worksheet.addRow([title]);
    titleRow.font = {
      name: 'Arial',
      family: 4,
      size: 16,
      underline: 'double',
      bold: true,
    };
    worksheet.mergeCells('A5:E5');
    // Blank Row
    worksheet.addRow([]);
    switch (tipoConsultaDatalogger) {
      case 'd':
        worksheet = this.cabeceraTitulares(worksheet, data);
        break;
      case 'de':
        worksheet = this.cabeceraDataloggerPorEquipoTitulares(worksheet, data);
        break;
      case 'dg':
        worksheet = this.cabeceraDataloggerPorGerenciaTitulares(
          worksheet,
          data
        );
        break;
      case 'rve':
        worksheet = this.cabeceraReporteVolumenPorEquipoTitulares(
          worksheet,
          data
        );
        break;
      case 'rvp':
        worksheet = this.cabeceraReportePresionTitulares(worksheet, data);
        break;
      case 'rc':
        worksheet = this.cabeceraReporteCaudalTitulares(worksheet, data);
        break;
      case 'rn':
        worksheet = this.cabeceraReporteNivelTitulares(worksheet, data);
        break;
      case 'rv':
        worksheet = this.cabeceraReporteVolumenTitulares(worksheet, data);
        break;
      case 'rb':
        worksheet = this.cabeceraReporteBateriaTitulares(worksheet, data);
        break;
      case 'rsve':
        worksheet = this.cabeceraReporteSeisValoresEomrTitulares(
          worksheet,
          data
        );
        break;
      case 're':
        worksheet = this.cabeceraReporteEstadisticoTitulares(worksheet, data);
        break;
      default:
        worksheet = this.cabeceraDataloggerPorDistritoTitulares(
          worksheet,
          data
        );
        break;
    }
    //worksheet.addRows(data);
    worksheet.eachRow(function (row, _rowNumber) {
      row.eachCell(function (cell, _colNumber) {
        cell.border = {
          top: { style: 'thin' },
          left: { style: 'thin' },
          bottom: { style: 'thin' },
          right: { style: 'thin' },
        };
      });
      row.alignment = { vertical: 'middle', horizontal: 'center' };
    });

    workbook.xlsx.writeBuffer().then((data: any) => {
      this.saveAsExcelFile(data, excelFileName);
    });
  }

  cabeceraTitulares(worksheet, data: any[]) {
    worksheet.mergeCells('A7:A8');
    worksheet.getCell('A7').value = 'NRO';
    worksheet.mergeCells('B7:B8');
    worksheet.getCell('B7').value = 'EQUIPO';
    worksheet.mergeCells('C7:C8');
    worksheet.getCell('C7').value = 'SECTOR';
    worksheet.mergeCells('D7:D8');
    worksheet.getCell('D7').value = 'CÓDIGO DATALOGGER';
    worksheet.mergeCells('E7:E8');
    worksheet.getCell('E7').value = 'DESCRIPCIÓN DATALOGGER';
    worksheet.mergeCells('F7:F8');
    worksheet.getCell('F7').value = 'CÓDIGO SEDAPAL';
    worksheet.mergeCells('G7:G8');
    worksheet.getCell('G7').value = 'ZONA';
    worksheet.mergeCells('H7:H8');
    worksheet.getCell('H7').value = 'DISTRITO';
    worksheet.mergeCells('I7:I8');
    worksheet.getCell('I7').value = 'ESTADO';
    worksheet.mergeCells('J7:J8');
    worksheet.getCell('J7').value = 'INDICADOR';

    worksheet.columns = [
      { key: 'nro', width: 13, outlineLevel: 1 },
      { key: 'vCodarea', width: 15, outlineLevel: 1 },
      { key: 'nSector', width: 12, outlineLevel: 1 },
      { key: 'nCoddat', width: 18, outlineLevel: 1 },
      { key: 'vDesdat', width: 18, outlineLevel: 1 },
      { key: 'nCodseg', width: 18, outlineLevel: 1 },
      { key: 'vZona', width: 18, outlineLevel: 1 },
      {
        key: 'vDesdistrito',
        width: 15,
        outlineLevel: 1,
      },
      { key: 'vEstado', width: 20, outlineLevel: 1 },
      { key: 'vIndicador', width: 13, outlineLevel: 1 },
    ];
    for (const datalogger of data) {
      worksheet.addRow({
        nro: datalogger.nro,
        vCodarea: datalogger.areaBuscarResponse.vCodarea,
        nSector: datalogger.nSector,
        nCoddat: datalogger.nCoddat,
        vDesdat: datalogger.vDesdat,
        nCodseg: datalogger.nCodseg,
        vZona: datalogger.zonaBuscarResponse.vZona,
        vDesdistrito: datalogger.distritoBuscarResponse.vDesdistrito,
        vEstado: datalogger.estadoBuscarResponse.vEstado,
        vIndicador: datalogger.indicadorBuscarResponse.vIndicador,
      }).alignment = { horizontal: 'left' };
    }

    return worksheet;
  }

  cabeceraDataloggerPorEquipoTitulares(worksheet, data: any[]) {
    worksheet.mergeCells('A7:A8');
    worksheet.getCell('A7').value = 'NRO';
    /*worksheet.mergeCells('B7:B8');
    worksheet.getCell('B7').value = 'CÓDIGO DATALOGGER';*/
    worksheet.mergeCells('B7:B8');
    worksheet.getCell('B7').value = 'ÁREA';
    worksheet.mergeCells('C7:C8');
    worksheet.getCell('C7').value = 'CANTIDAD';

    worksheet.columns = [
      { key: 'nro', width: 13, outlineLevel: 1 },
      //{ key: 'nCoddat', width: 15, outlineLevel: 1 },
      { key: 'vCodarea', width: 12, outlineLevel: 1 },
      { key: 'cantidad', width: 15, outlineLevel: 1 },
    ];
    for (const datalogger of data) {
      worksheet.addRow({
        nro: datalogger.nro,        
        vCodarea: datalogger.areaBuscarResponse.vCodarea,
        cantidad: datalogger.cantidad,
      }).alignment = { horizontal: 'left' };
    }

    return worksheet;
  }

  cabeceraDataloggerPorGerenciaTitulares(worksheet, data: any[]) {
    worksheet.mergeCells('A7:A8');
    worksheet.getCell('A7').value = 'NRO.';
    worksheet.mergeCells('B7:B8');
    worksheet.getCell('B7').value = 'GERENCIA';
    worksheet.mergeCells('C7:C8');
    worksheet.getCell('C7').value = 'CANTIDAD';

    worksheet.columns = [
      { key: 'nro', width: 13, outlineLevel: 1 },
      { key: 'descripcion', width: 15, outlineLevel: 1 },
      { key: 'cantidad', width: 12, outlineLevel: 1 },
    ];
    for (const datalogger of data) {
      worksheet.addRow({
        nro: datalogger.nro,
        descripcion: datalogger.descripcion,
        cantidad: datalogger.cantidad,
      }).alignment = { horizontal: 'left' };
    }

    return worksheet;
  }

  cabeceraDataloggerPorDistritoTitulares(worksheet, data: any[]) {
    worksheet.mergeCells('A7:A8');
    worksheet.getCell('A7').value = 'NRO';
    worksheet.mergeCells('B7:B8');
    worksheet.getCell('B7').value = 'DISTRITO';
    worksheet.mergeCells('C7:C8');
    worksheet.getCell('C7').value = 'CANTIDAD';

    worksheet.columns = [
      { key: 'nro', width: 13, outlineLevel: 1 },
      { key: 'vDesdistrito', width: 15, outlineLevel: 1 },
      { key: 'cantidad', width: 12, outlineLevel: 1 },
    ];
    for (const datalogger of data) {
      worksheet.addRow({
        nro: datalogger.nro,
        vDesdistrito: datalogger.distritoBuscarResponse.vDesdistrito,
        cantidad: datalogger.cantidad,
      }).alignment = { horizontal: 'left' };
    }

    return worksheet;
  }

  cabeceraReporteVolumenPorEquipoTitulares(worksheet, data: any[]) {
    worksheet.mergeCells('A7:A8');
    worksheet.getCell('A7').value = 'NRO.';
    worksheet.getCell('A7').font = {
      bold: true,
    };
    worksheet.mergeCells('B7:B8');
    worksheet.getCell('B7').value = 'COD. DATALOGGER';
    worksheet.getCell('B7').font = {
      bold: true,
    };

    worksheet.mergeCells('C7:C8');
    worksheet.getCell('C7').value = 'FECHA / HORA';
    worksheet.getCell('C7').font = {
      bold: true,
    };    
    worksheet.mergeCells('D7:D8');
    worksheet.getCell('D7').value = 'LECTURA REGISTRADA EN M3';
    worksheet.getCell('D7').font = {
      bold: true,
    };
    worksheet.mergeCells('E7:E8');
    worksheet.getCell('E7').value = 'CONSUMO DIARIO M3';
    worksheet.getCell('E7').font = {
      bold: true,
    };
    worksheet.mergeCells('F7:F8');
    worksheet.getCell('F7').value = 'SECTOR';
    worksheet.getCell('F7').font = {
      bold: true,
    };

    worksheet.columns = [
      { key: 'nro', width: 13, outlineLevel: 1 },
      { key: 'vCodigoDatalogger', width: 13, outlineLevel: 1 },
      { key: 'dFecha', width: 13, outlineLevel: 1 },
      { key: 'lecturaRegistradaM3', width: 12, outlineLevel: 1 },
      { key: 'consumoDiarioM3', width: 12, outlineLevel: 1 },
      { key: 'vSector', width: 12, outlineLevel: 1 },      
    ];
    let i=0;
    for (const reporte of data) {
      i = i+1;
      worksheet.addRow({
        nro: i,
        vCodigoDatalogger: reporte.vCodigoDatalogger,
        dFecha: reporte.dFecha,
        lecturaRegistradaM3: reporte.lecturaRegistradaM3,
        consumoDiarioM3: reporte.consumoDiarioM3,
        vSector: reporte.vSector,          
      }).alignment = { horizontal: 'left' };
    }

    return worksheet;
  }

  cabeceraReportePresionTitulares(worksheet, data: any[]) {
    worksheet.mergeCells('A7:A8');
    worksheet.getCell('A7').value = 'NRO.';
    worksheet.getCell('A7').font = {
      bold: true,
    };
    worksheet.mergeCells('B7:B8');
    worksheet.getCell('B7').value = 'COD. DATALOGGER';
    worksheet.getCell('B7').font = {
      bold: true,
    };

    worksheet.mergeCells('C7:C8');
    worksheet.getCell('C7').value = 'FECHA / HORA';
    worksheet.getCell('C7').font = {
      bold: true,
    };    
    worksheet.mergeCells('D7:D8');
    worksheet.getCell('D7').value = 'DISTRITO';
    worksheet.getCell('D7').font = {
      bold: true,
    };
    worksheet.mergeCells('F7:F8');
    worksheet.getCell('F7').value = 'SECTOR';
    worksheet.getCell('F7').font = {
      bold: true,
    };
    worksheet.mergeCells('E7:E8');
    worksheet.getCell('E7').value = 'ZONA';
    worksheet.getCell('E7').font = {
      bold: true,
    };
    worksheet.mergeCells('G7:G8');
    worksheet.getCell('G7').value = 'EQUIPO';
    worksheet.getCell('G7').font = {
      bold: true,
    };
    worksheet.mergeCells('H7:H8');
    worksheet.getCell('H7').value = 'VALOR(m3)';
    worksheet.getCell('H7').font = {
      bold: true,
    };


    worksheet.columns = [
      { key: 'nro', width: 13, outlineLevel: 1 },
      { key: 'vCodigoDatalogger', width: 13, outlineLevel: 1 },
      { key: 'dFecha', width: 13, outlineLevel: 1 },
      { key: 'distrito', width: 15, outlineLevel: 1 },
      { key: 'vSector', width: 12, outlineLevel: 1 },      
      { key: 'vZona', width: 12, outlineLevel: 1 },
      { key: 'vEquipo', width: 12, outlineLevel: 1 },
      { key: 'vParametro1', width: 12, outlineLevel: 1 },
    ];
    let i=0;
    for (const reporte of data) {
      i = i+1;
      worksheet.addRow({
        nro: i,
        vCodigoDatalogger: reporte.vCodigoDatalogger,
        dFecha: reporte.dFecha,
        distrito: reporte.distrito,
        vSector: reporte.vSector,               
        vZona: reporte.vZona,
        vEquipo: reporte.vEquipo,
        vParametro1: reporte.vParametro1,
        

      }).alignment = { horizontal: 'left' };
    }

    return worksheet;
  }

  cabeceraReporteCaudalTitulares(worksheet, data: any[]) {
    worksheet.mergeCells('A7:A8');
    worksheet.getCell('A7').value = 'NRO.';
    worksheet.getCell('A7').font = {
      bold: true,
    };

    worksheet.mergeCells('B7:B8');
    worksheet.getCell('B7').value = 'COD. DATALOGGER';
    worksheet.getCell('B7').font = {
      bold: true,
    };


    worksheet.mergeCells('C7:C8');
    worksheet.getCell('C7').value = 'FECHA/HORA';
    worksheet.getCell('C7').font = {
      bold: true,
    };
    worksheet.mergeCells('D7:D8');
    worksheet.getCell('D7').value = 'CAUDAL';
    worksheet.getCell('D7').font = {
      bold: true,
    };
    worksheet.mergeCells('E7:E8');
    worksheet.getCell('E7').value = 'SECTOR';
    worksheet.getCell('E7').font = {
      bold: true,
    };

    worksheet.columns = [
      { key: 'numero', width: 13, outlineLevel: 1 },
      { key: 'vCodigoDatalogger', width: 13, outlineLevel: 1 },
      { key: 'fecha', width: 15, outlineLevel: 1 },
      { key: 'vParametro1', width: 12, outlineLevel: 1 },
      { key: 'vSector', width: 12, outlineLevel: 1 },  
    ];
    let i=0;
    for (const reporte of data  ) {
       i = i+1;
      worksheet.addRow({
        numero: i ,
        vCodigoDatalogger: reporte.vCodigoDatalogger,
        fecha: reporte.fecha ,
        vParametro1: reporte.vParametro1,
        vSector: reporte.vSector,  
      }).alignment = { horizontal: 'left' };
    }

    return worksheet;
  }

  cabeceraReporteNivelTitulares(worksheet, data: any[]) {
    worksheet.mergeCells('A7:A8');
    worksheet.getCell('A7').value = 'NRO.';
    worksheet.getCell('A7').font = {
      bold: true,
    };
    worksheet.mergeCells('B7:B8');
    worksheet.getCell('B7').value = 'COD. DATALOGGER';
    worksheet.getCell('B7').font = {
      bold: true,
    };


    worksheet.mergeCells('C7:C8');
    worksheet.getCell('C7').value = 'FECHA/HORA';
    worksheet.getCell('C7').font = {
      bold: true,
    };

    worksheet.mergeCells('D7:D8');
    worksheet.getCell('D7').value = 'NIVEL';
    worksheet.getCell('D7').font = {
      bold: true,
    };

    worksheet.columns = [      
      { key: 'nro', width: 13, outlineLevel: 1 },
      { key: 'vCodigoDatalogger', width: 13, outlineLevel: 1 },
      { key: 'fecha', width: 15, outlineLevel: 1 },
      { key: 'vParametro1', width: 13, outlineLevel: 1 }
    ]; let i=0;
    for (const reporte of data) {
      i = i+1;
      worksheet.addRow({
        nro: i,
        vCodigoDatalogger: reporte.vCodigoDatalogger,
        fecha: reporte.fecha,
        vParametro1: reporte.vParametro1,
        vSector: reporte.vSector,
      }).alignment = { horizontal: 'left' };
    }

    return worksheet;
  }

  cabeceraReporteVolumenTitulares(worksheet, data: any[]) {
    worksheet.mergeCells('A7:A8');
    worksheet.getCell('A7').value = 'NRO.';
    worksheet.getCell('A7').font = {
      bold: true,
    };
    worksheet.mergeCells('B7:B8');
    worksheet.getCell('B7').value = 'COD. DATALOGGER';
    worksheet.getCell('B7').font = {
      bold: true,
    };
    worksheet.mergeCells('C7:C8');
    worksheet.getCell('C7').value = 'FECHA / HORA';
    worksheet.getCell('C7').font = {
      bold: true,
    };
    worksheet.mergeCells('D7:D8');
    worksheet.getCell('D7').value = 'VOLUMEN';
    worksheet.getCell('D7').font = {
      bold: true,
    };

    worksheet.mergeCells('E7:E8');
    worksheet.getCell('E7').value = 'SECTOR';
    worksheet.getCell('E7').font = {
      bold: true,
    };

    worksheet.columns = [
      { key: 'nro', width: 13, outlineLevel: 1 },
      { key: 'vCodigoDatalogger', width: 13, outlineLevel: 1 },
      { key: 'fecha_hora', width: 15, outlineLevel: 1 },
      { key: 'volumen', width: 12, outlineLevel: 1 },
      { key: 'sector', width: 12, outlineLevel: 1 },
    ];
    let i=0;
    for (const reporte of data) {
      i = i+1;
      worksheet.addRow({
        nro: i,
        vCodigoDatalogger: reporte.vCodigoDatalogger,
        fecha_hora: reporte.fecha,
        volumen: reporte.vParametro1,
        sector: reporte.vSector
      }).alignment = { horizontal: 'left' };
    }

    return worksheet;
  }

  cabeceraReporteBateriaTitulares(worksheet, data: any[]) {  
    worksheet.mergeCells('A7:A8');
    worksheet.getCell('A7').value = 'NRO.';
    worksheet.getCell('A7').font = {
      bold: true,
    };
    worksheet.mergeCells('B7:B8');
    worksheet.getCell('B7').value = 'COD. DATALOGGER';
    worksheet.getCell('B7').font = {
      bold: true,
    };

    worksheet.mergeCells('C7:C8');
    worksheet.getCell('C7').value = 'FECHA/HORA';
    worksheet.getCell('C7').font = {
      bold: true,
    };
    worksheet.mergeCells('D7:D8');
    worksheet.getCell('D7').value = 'BATERÍA';
    worksheet.getCell('D7').font = {
      bold: true,
    };
    worksheet.mergeCells('E7:E8');
    worksheet.getCell('E7').value = 'SECTOR';
    worksheet.getCell('E7').font = {
      bold: true,
    };
    worksheet.columns = [
    { key: 'nro', width: 13, outlineLevel: 1 },
      { key: 'vCodigoDatalogger', width: 13, outlineLevel: 1 },
      { key: 'fecha_hora', width: 15, outlineLevel: 1 },
      { key: 'vParametro1', width: 12, outlineLevel: 1 },
      { key: 'vSector', width: 12, outlineLevel: 1 },
    ];
    let i=0;
    for (const reporte of data) {
      i = i+1;
      worksheet.addRow({
        nro: i,
        vCodigoDatalogger: reporte.vCodigoDatalogger,
        fecha_hora: reporte.fecha ,
        vParametro1: reporte.vParametro1,
        vSector: reporte.vSector,
      }).alignment = { horizontal: 'left' };
    }

    return worksheet;
  }

  cabeceraReporteSeisValoresEomrTitulares(worksheet, data: any[]) {
    worksheet.mergeCells('A7:A8');
    worksheet.getCell('A7').value = 'NRO.';
    worksheet.getCell('A7').font = {
      bold: true,
    };
    worksheet.mergeCells('B7:B8');
    worksheet.getCell('B7').value = 'COD. DATALOGGER';
    worksheet.getCell('B7').font = {
      bold: true,
    };
    worksheet.mergeCells('C7:C8');
    worksheet.getCell('C7').value = 'FECHA/HORA';
    worksheet.getCell('C7').font = {
      bold: true,
    };
    worksheet.mergeCells('D7:D8');
    worksheet.getCell('D7').value = 'VOLUMEN DE INGRESO';
    worksheet.getCell('D7').font = {
      bold: true,
    };
    worksheet.mergeCells('E7:E8');
    worksheet.getCell('E7').value = 'VOLUMEN DE SALIDA';
    worksheet.getCell('E7').font = {
      bold: true,
    };
    worksheet.mergeCells('F7:F8');
    worksheet.getCell('F7').value = 'VOLUMEN RPS';
    worksheet.getCell('F7').font = {
      bold: true,
    };
    worksheet.mergeCells('G7:G8');
    worksheet.getCell('G7').value = 'CAUDAL INGRESO';
    worksheet.getCell('G7').font = {
      bold: true,
    };
    worksheet.mergeCells('H7:H8');
    worksheet.getCell('H7').value = 'CAUDAL SALIDA';
    worksheet.getCell('H7').font = {
      bold: true,
    };
    worksheet.mergeCells('I7:I8');
    worksheet.getCell('I7').value = 'CAUDAL RPS';
    worksheet.getCell('I7').font = {
      bold: true,
    };

    worksheet.columns = [
      { key: 'nro', width: 13, outlineLevel: 1 },
      { key: 'vCodigoDatalogger', width: 13, outlineLevel: 1 },
      { key: 'fecha_hora', width: 15, outlineLevel: 1 },
      { key: 'volumenIngreso', width: 12, outlineLevel: 1 },
      { key: 'volumenSalida', width: 13, outlineLevel: 1 },
      { key: 'volumenRps', width: 15, outlineLevel: 1 },
      { key: 'caudalIngreso', width: 12, outlineLevel: 1 },
      { key: 'caudalSalida', width: 12, outlineLevel: 1 },
      { key: 'caudalRps', width: 12, outlineLevel: 1 },
    ];
    let i=0;
    for (const reporte of data) {
      i = i+1;
      worksheet.addRow({
        nro: i,
        vCodigoDatalogger: reporte.vCodigoDatalogger,
        fecha_hora: reporte.fecha,
        volumenIngreso: reporte.volumenIngreso,
        volumenSalida: reporte.volumenSalida,
        volumenRps: reporte.volumenRps,
        caudalIngreso: reporte.caudalIngreso,
        caudalSalida: reporte.caudalSalida,
        caudalRps: reporte.caudalRps,
      }).alignment = { horizontal: 'left' };
    }

    return worksheet;
  }

  cabeceraReporteEstadisticoTitulares(worksheet, data: any[]) {
    worksheet.mergeCells('A7:A8');
    worksheet.getCell('A7').value = 'NRO.';
    worksheet.getCell('A7').font = {
      bold: true,
    };
    worksheet.mergeCells('B7:B8');
    worksheet.getCell('B7').value = 'FECHA/HORA';
    worksheet.getCell('B7').font = {
      bold: true,
    };
    worksheet.mergeCells('C7:C8');
    worksheet.getCell('C7').value = 'ZONA BAJA';
    worksheet.getCell('C7').font = {
      bold: true,
    };
    worksheet.mergeCells('D7:D8');
    worksheet.getCell('D7').value = 'ZONA MEDIA';
    worksheet.getCell('D7').font = {
      bold: true,
    };
    worksheet.mergeCells('E7:E8');
    worksheet.getCell('E7').value = 'ZONA ALTA';
    worksheet.getCell('E7').font = {
      bold: true,
    };

    worksheet.mergeCells('F7:F8');
    worksheet.getCell('F7').value = 'SECTOR';
    worksheet.getCell('F7').font = {
      bold: true,
    };

    worksheet.columns = [
      { key: 'nro', width: 13, outlineLevel: 1 },
      { key: 'fecha_hora', width: 15, outlineLevel: 1 },
      { key: 'zonaBaja', width: 12, outlineLevel: 1 },
      { key: 'zonaMedia', width: 12, outlineLevel: 1 },
      { key: 'zonaAlta', width: 12, outlineLevel: 1 },
      { key: 'vSector', width: 12, outlineLevel: 1 },    
    ];
    let i=0;
    for (const reporte of data) {
      i = i+1;
      worksheet.addRow({
        nro: i,
        fecha_hora: reporte.fecha ,
        zonaBaja: reporte.zonaBaja,
        zonaMedia: reporte.zonaMedia,
        zonaAlta: reporte.zonaAlta,
        vSector: reporte.vSector,          
      }).alignment = { horizontal: 'left' };
    }

    return worksheet;
  }

  private saveAsExcelFile(buffer: any, fileName: string): void {
    const data: Blob = new Blob([buffer], {
      type: EXCEL_TYPE,
    });
    fs.saveAs(
      data,
      //fileName + '_' + this.formattedDate(new Date()) + EXCEL_EXTENSION
      fileName + EXCEL_EXTENSION
    );
  }

  formattedDate(d: Date) {
    let month = String(d.getMonth() + 1);
    let day = String(d.getDate());
    const year = String(d.getFullYear());

    const hr = String(d.getHours());
    const min = String(d.getMinutes());
    const sg = String(d.getSeconds());
    const hora = hr + '_' + min + '_' + sg;

    if (month.length < 2) {
      month = '0' + month;
    }
    if (day.length < 2) {
      day = '0' + day;
    }

    return `${year}${month}${day}-${hora}`;
  }
}