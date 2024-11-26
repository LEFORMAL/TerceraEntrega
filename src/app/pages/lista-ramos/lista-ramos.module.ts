import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ListaRamosPageRoutingModule } from './lista-ramos-routing.module';

import { ListaRamosPage } from './lista-ramos.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ListaRamosPageRoutingModule
  ],
  declarations: [ListaRamosPage]
})
export class ListaRamosPageModule {}
