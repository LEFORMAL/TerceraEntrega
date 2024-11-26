import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { ZXingScannerModule } from '@zxing/ngx-scanner';

import { EscaneoQrPageRoutingModule } from './escaneo-qr-routing.module';
import { EscaneoQrPage } from './escaneo-qr.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ZXingScannerModule, // Agrega el módulo del escáner QR
    EscaneoQrPageRoutingModule,
  ],
  declarations: [EscaneoQrPage], // Asegúrate de que el nombre coincide con el archivo .ts
})
export class EscaneoQrPageModule {}
