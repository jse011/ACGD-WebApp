import { LOCALE_ID, NgModule } from '@angular/core';
import { BrowserModule, Title } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppComponent } from './app.component';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { HashLocationStrategy, LocationStrategy } from '@angular/common';
import { AuthService } from './auth/auth.service';
import { SessionService } from './auth/session.service';
import { JwtInterceptor } from './auth/jwt.interceptor';
import { ErrorInterceptor } from './auth/error.interceptor';
import { AuthGuard } from './auth/auth.guard';
import { AppviewsModule } from './views/appviews/appviews.module';
import { SystemService } from './services/system.service';
import { ToastrModule } from 'ngx-toastr';
// App modules/components
import { SpinKitModule } from './components/common/spinkit/spinkit.module';
import { RouterModule } from '@angular/router';
import { LayoutsModule } from './components/common/layouts/layouts.module';
import { TemplateComponent } from './pages/template/template/template.component';
import { HeaderComponent } from './pages/template/header/header.component';
import { MenuComponent } from './pages/template/menu/menu.component';
import { ContainerComponent } from './pages/template/container/container.component';
import { ImportManualComponent } from './pages/components/import-manual/import-manual.component';
import { AppRoutingModule } from './app-routing.module';

import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatMenuModule } from '@angular/material/menu';
import { MatCardModule } from '@angular/material/card';

import { FlexLayoutModule } from '@angular/flex-layout';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import {
  MatDialogModule,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MaestroParametroComponent } from './components/maestro-parametro/maestro-parametro.component';
import { MatSelectModule } from '@angular/material/select';
import { MatRadioModule } from '@angular/material/radio';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule, MAT_DATE_LOCALE } from '@angular/material/core';

import { DashboardComponent } from './components/dashboard/dashboard.component';
import { PaginationComponent } from './components/shared/pagination/pagination.component';
import { ParameterService } from './services';
import { ApiService } from './_service/api.service';
import { DetalleParametroComponent } from './components/maestro-parametro/detalle-parametro/detalle-parametro.component';
import {
  ContentDialogComponent,
  ImageDialogComponent,
} from './components/shared';
import {
  DisableControlDirective,
  OpenDialogDirective,
  UpperDirective,
} from './directives';
import { BlockUIModule } from 'ng-block-ui';
import { MaestroDataloggersComponent } from './components/maestro-dataloggers/maestro-dataloggers.component';
import { DetalleDataloggerComponent } from './components/maestro-dataloggers/detalle-datalogger/detalle-datalogger.component';
import { DataloggerService } from './_service/datalogger.service';

//import { DisableControlDirective } from './directives';
import { ConsultaDataloggerComponent } from './components/consulta-datalogger/consulta-datalogger.component';
import { ListaDataloggerComponent } from './components/consulta-datalogger/lista-datalogger/lista-datalogger.component';

import { MatTabsModule } from '@angular/material/tabs';
import { DataloggerEquipoTabComponent } from './components/consulta-datalogger/datalogger-equipo-tab/datalogger-equipo-tab.component';
import { DataloggerTabComponent } from './components/consulta-datalogger/datalogger-tab/datalogger-tab.component';
import { DataloggerGerenciaTabComponent } from './components/consulta-datalogger/datalogger-gerencia-tab/datalogger-gerencia-tab.component';
import { DataloggerDistritoTabComponent } from './components/consulta-datalogger/datalogger-distrito-tab/datalogger-distrito-tab.component';
import { MoverDataloggerComponent } from './components/maestro-dataloggers/mover-datalogger/mover-datalogger.component';
import { ExcelService } from './_service/excel.service';
import { NgChartsModule } from 'ng2-charts';
import { BarChartDataloggerPorEquipoComponent } from './components/grafico-charts/bar-chart-datalogger-por-equipo/bar-chart-datalogger-por-equipo.component';
import { BarChartDataloggerPorGerenciaComponent } from './components/grafico-charts/bar-chart-datalogger-por-gerencia/bar-chart-datalogger-por-gerencia.component';
import { BarChartDataloggerPorDistritoComponent } from './components/grafico-charts/bar-chart-datalogger-por-distrito/bar-chart-datalogger-por-distrito.component';
import { ReporteComponent } from './components/reporte/reporte.component';
import { ReporteVolumenPorEquipoComponent } from './components/reporte/reporte-volumen-por-equipo/reporte-volumen-por-equipo.component';
import { ReportePresionComponent } from './components/reporte/reporte-presion/reporte-presion.component';
import { ReporteCaudalComponent } from './components/reporte/reporte-caudal/reporte-caudal.component';
import { ReporteNivelComponent } from './components/reporte/reporte-nivel/reporte-nivel.component';
import { ReporteVolumenComponent } from './components/reporte/reporte-volumen/reporte-volumen.component';
import { ReporteBateriaComponent } from './components/reporte/reporte-bateria/reporte-bateria.component';
import { ReporteSeisValoresOemrComponent } from './components/reporte/reporte-seis-valores-oemr/reporte-seis-valores-oemr.component';
import { ReporteEstadisticosComponent } from './components/reporte/reporte-estadisticos/reporte-estadisticos.component';
import { ReporteService } from './_service/reporte.service';
import { BarChartReporteVolumenPresionComponent } from './components/grafico-charts/bar-chart-reporte-volumen-presion/bar-chart-reporte-volumen-presion.component';
import { BarChartReporteCaudalComponent } from './components/grafico-charts/bar-chart-reporte-caudal/bar-chart-reporte-caudal.component';
import { BarChartReporteNivelComponent } from './components/grafico-charts/bar-chart-reporte-nivel/bar-chart-reporte-nivel.component';
import { BarChartReporteVolumenComponent } from './components/grafico-charts/bar-chart-reporte-volumen/bar-chart-reporte-volumen.component';
import { BarChartReporteBateriaComponent } from './components/grafico-charts/bar-chart-reporte-bateria/bar-chart-reporte-bateria.component';
import { BarChartReporteSeisValoresEomrComponent } from './components/grafico-charts/bar-chart-reporte-seis-valores-eomr/bar-chart-reporte-seis-valores-eomr.component';
import { BarChartReporteEstadisticoComponent } from './components/grafico-charts/bar-chart-reporte-estadistico/bar-chart-reporte-estadistico.component';
import { ImportacionManualComponent } from './components/mantenimiento/importacion-manual/importacion-manual.component';
import { ValidacionDatosComponent } from './components/mantenimiento/validacion-datos/validacion-datos.component';
import { MantenimientoService } from './_service/mantenimiento.service';
import { CargaArchivoComponent } from './components/mantenimiento/carga-archivo/carga-archivo.component';
import { DetalleImportacionManualComponent } from './components/mantenimiento/detalle-importacion-manual/detalle-importacion-manual.component';
import { DetalleValidacionDatosComponent } from './components/mantenimiento/detalle-validacion-datos/detalle-validacion-datos.component';
import { ObservarValidacionDatosComponent } from './components/mantenimiento/observar-validacion-datos/observar-validacion-datos.component';
import { ValidacionDatosService } from './_service/validacion-datos.service';
import { MatTooltipModule } from '@angular/material/tooltip';
import { CambiarPasswordComponent } from './components/cambiar-password/cambiar-password.component';
import { PlanoGistComponent } from './components/maestro-dataloggers/plano-gis/plano-gis.component';

@NgModule({
  declarations: [
    AppComponent,
    JwtInterceptor,
    TemplateComponent,
    HeaderComponent,
    MenuComponent,
    ContainerComponent,
    ImportManualComponent,
    MaestroParametroComponent,
    DashboardComponent,
    PaginationComponent,
    DetalleParametroComponent,
    ImageDialogComponent,
    ContentDialogComponent,
    DisableControlDirective,
    OpenDialogDirective,
    UpperDirective,
    MaestroDataloggersComponent,
    DetalleDataloggerComponent,
    MoverDataloggerComponent,
    PlanoGistComponent,
    DisableControlDirective,
    ConsultaDataloggerComponent,
    ListaDataloggerComponent,
    DataloggerTabComponent,
    DataloggerEquipoTabComponent,
    DataloggerTabComponent,
    DataloggerGerenciaTabComponent,
    DataloggerDistritoTabComponent,
    BarChartDataloggerPorEquipoComponent,
    BarChartDataloggerPorGerenciaComponent,
    BarChartDataloggerPorDistritoComponent,
    BarChartReporteVolumenPresionComponent,
    BarChartReporteCaudalComponent,
    BarChartReporteNivelComponent,
    BarChartReporteVolumenComponent,
    BarChartReporteBateriaComponent,
    BarChartReporteSeisValoresEomrComponent,
    BarChartReporteEstadisticoComponent,
    ReporteComponent,
    ReporteVolumenPorEquipoComponent,
    ReportePresionComponent,
    ReporteCaudalComponent,
    ReporteNivelComponent,
    ReporteVolumenComponent,
    ReporteBateriaComponent,
    ReporteSeisValoresOemrComponent,
    ReporteEstadisticosComponent,
    ImportacionManualComponent,
    ValidacionDatosComponent,
    CargaArchivoComponent,
    DetalleImportacionManualComponent,
    DetalleValidacionDatosComponent,
    ObservarValidacionDatosComponent,
    CambiarPasswordComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    MatSidenavModule,
    MatListModule,
    MatIconModule,
    MatTabsModule,
    MatButtonModule,
    MatToolbarModule,
    MatMenuModule,
    FlexLayoutModule,
    MatCardModule,
    HttpClientModule,
    MatTableModule,
    MatPaginatorModule,
    MatDialogModule,
    MatRadioModule,
    MatCheckboxModule,
    /** Forms */
    MatFormFieldModule,
    MatSelectModule,
    FormsModule,
    SpinKitModule,
    ReactiveFormsModule,
    MatSidenavModule,
    MatExpansionModule,
    MatTooltipModule,
    /** */
    MatInputModule,
    ToastrModule.forRoot({ closeButton: true }),
    AppviewsModule,
    LayoutsModule,
    MatSlideToggleModule,
    MatDatepickerModule,
    MatNativeDateModule,
    NgChartsModule,
    BlockUIModule.forRoot(),
  ],

  providers: [
    { provide: LocationStrategy, useClass: HashLocationStrategy },
    Title,
    AuthService,
    SessionService,
    SystemService,
    ParameterService,
    DataloggerService,
    ExcelService,
    ApiService,
    ReporteService,
    MantenimientoService,
    ValidacionDatosService,
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
    { provide: MAT_DIALOG_DATA, useValue: {} },
    //{ provide: LOCALE_ID, useValue: 'es-PE' },
    { provide: MAT_DATE_LOCALE, useValue: 'es-CL' },
    AuthGuard,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}