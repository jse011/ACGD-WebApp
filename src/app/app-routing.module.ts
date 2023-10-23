import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BlankLayoutComponent } from './components/common/layouts/blankLayout.component';
import { ImportManualComponent } from './pages/components/import-manual/import-manual.component';
import { MaestroParametroComponent } from './components/maestro-parametro/maestro-parametro.component';
import { LoginComponent } from './views/appviews/login.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { DefaultComponent } from './components/shared/default/default.component';
import { AuthGuard } from './auth/auth.guard';
import { MaestroDataloggersComponent } from './components/maestro-dataloggers/maestro-dataloggers.component';
import { ConsultaDataloggerComponent } from './components/consulta-datalogger/consulta-datalogger.component';
import { CambioContrasenaComponent } from './views/appviews/cambio-contrasena/cambio-contrasena.component';
import { ReporteComponent } from './components/reporte/reporte.component';
import { ReporteVolumenPorEquipoComponent } from './components/reporte/reporte-volumen-por-equipo/reporte-volumen-por-equipo.component';
import { ReportePresionComponent } from './components/reporte/reporte-presion/reporte-presion.component';
import { ReporteCaudalComponent } from './components/reporte/reporte-caudal/reporte-caudal.component';
import { ReporteNivelComponent } from './components/reporte/reporte-nivel/reporte-nivel.component';
import { ReporteVolumenComponent } from './components/reporte/reporte-volumen/reporte-volumen.component';
import { ReporteBateriaComponent } from './components/reporte/reporte-bateria/reporte-bateria.component';
import { ReporteSeisValoresOemrComponent } from './components/reporte/reporte-seis-valores-oemr/reporte-seis-valores-oemr.component';
import { ReporteEstadisticosComponent } from './components/reporte/reporte-estadisticos/reporte-estadisticos.component';
import { ImportacionManualComponent } from './components/mantenimiento/importacion-manual/importacion-manual.component';
import { ValidacionDatosComponent } from './components/mantenimiento/validacion-datos/validacion-datos.component';
import { CambiarPasswordComponent } from './components/cambiar-password/cambiar-password.component';

const routes: Routes = [
  { path: 'importManual', component: ImportManualComponent },
  { path: '', redirectTo: 'inicio', pathMatch: 'full' },
  {
    path: '',
    component: BlankLayoutComponent,
    children: [{ path: 'login', component: LoginComponent }],
  },
  {
    path: 'login/reset',
    children: [
      { path: '', component: CambioContrasenaComponent },
      { path: ':usuario', component: CambioContrasenaComponent },
    ],
  },
  {
    path: '',
    component: DashboardComponent,
    canActivate: [AuthGuard],
    canActivateChild: [AuthGuard],
    children: [
      { path: 'inicio', component: DefaultComponent },
      /* init intermediate screen */
      //{path: 'consulta-recibos', component: SuministroComponent, runGuardsAndResolvers: 'always'},
      //{path: 'consulta-recibos/:token', component: SuministroComponent}
    ],
  },
  {
    path: '',
    component: DashboardComponent,
    canActivate: [AuthGuard],
    canActivateChild: [AuthGuard],
    children: [
      { path: 'maestro/parametro', component: MaestroParametroComponent },
    ],
  },

  {
    path: '',
    component: DashboardComponent,
    canActivate: [AuthGuard],
    canActivateChild: [AuthGuard],
    children: [
      { path: 'maestro/dataloggers', component: MaestroDataloggersComponent },
    ],
  },

  {
    path: '',
    component: DashboardComponent,
    canActivate: [AuthGuard],
    canActivateChild: [AuthGuard],
    children: [
      {
        path: 'consulta/consulta-datalogger',
        component: ConsultaDataloggerComponent,
      },
    ],
  },
  {
    path: 'reporte',
    component: DashboardComponent,
    canActivate: [AuthGuard],
    canActivateChild: [AuthGuard],
    children: [
      { path: '', component: ReporteComponent },
      {
        path: 'volumen-por-equipo',
        component: ReporteVolumenPorEquipoComponent,
      },
      { path: 'presion', component: ReportePresionComponent },
      { path: 'caudal', component: ReporteCaudalComponent },
      { path: 'nivel', component: ReporteNivelComponent },
      { path: 'volumen', component: ReporteVolumenComponent },
      { path: 'bateria', component: ReporteBateriaComponent },
      { path: 'seis-valores-eomr', component: ReporteSeisValoresOemrComponent },
      { path: 'estadisticos', component: ReporteEstadisticosComponent },
    ],
  },
  {
    path: 'mantenimiento',
    component: DashboardComponent,
    canActivate: [AuthGuard],
    canActivateChild: [AuthGuard],
    children: [
      //{ path: '', component: ReporteComponent },
      {
        path: 'importacion-manual',
        component: ImportacionManualComponent,
      },
      { path: 'validacion-datos', component: ValidacionDatosComponent },
    ],
  },
  {
    path: 'cambio-contrasena',
    component: DashboardComponent,
    canActivate: [AuthGuard],
    canActivateChild: [AuthGuard],
    children: [{ path: '', component: CambiarPasswordComponent }],
  },
  /*{
    path: '', component: TemplateComponent, children: [
      { path: 'inicio', component: HomeComponent }
    ]
  },*/
  /*{
    path: '',
    component: TemplateComponent,
    children: [
      { path: 'maestro-parametro', component: MaestroParametroComponent },
    ],
  },*/
  { path: '**', redirectTo: 'inicio' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { onSameUrlNavigation: 'reload' })],
  exports: [RouterModule],
})
export class AppRoutingModule {}
