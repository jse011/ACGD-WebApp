import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
//import { SpinKitModule } from '../../components/common/spinkit/spinkit.module';

//import { StarterViewComponent } from './starterview.component';
import { LoginComponent } from './login.component';
import { CambioContrasenaComponent } from './cambio-contrasena/cambio-contrasena.component';
//import { ResetComponent } from './reset.component';
//import { ChangeComponent } from './change/change.component';

@NgModule({
  declarations: [
    //StarterViewComponent,
    LoginComponent,
    CambioContrasenaComponent,
    //ResetComponent,
    //ChangeComponent,
  ],
  imports: [
    FormsModule,
    BrowserModule,
    RouterModule,
    //, SpinKitModule
  ],
  exports: [
    //StarterViewComponent,
    LoginComponent,
    //ResetComponent,
    //ChangeComponent,
  ],
})
export class AppviewsModule {}