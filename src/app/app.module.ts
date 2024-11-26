import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

// Firebase imports
import { AngularFireModule } from '@angular/fire/compat';
import { AngularFirestoreModule } from '@angular/fire/compat/firestore';
import { AngularFireAuthModule } from '@angular/fire/compat/auth'; // Módulo de autenticación
// Importar el environment
import { environment } from '../environments/environment';

// QRScanner import (versión actualizada)
import { QRScanner } from '@ionic-native/qr-scanner/ngx';


@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    IonicModule.forRoot(),
    AppRoutingModule,
    // Initialize Firebase
    AngularFireModule.initializeApp(environment.firebaseConfig), // Inicializar Firebase con firebaseConfig
    AngularFirestoreModule, // Firestore module
    AngularFireAuthModule,  // Auth module
  ],
  providers: [
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    QRScanner, 
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
