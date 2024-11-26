import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { RegistrarRamoPageRoutingModule } from './registrar-ramo-routing.module';

import { RegistrarRamoPage } from './registrar-ramo.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RegistrarRamoPageRoutingModule
  ],
  declarations: [RegistrarRamoPage]
})
export class RegistrarRamoPageModule {}
