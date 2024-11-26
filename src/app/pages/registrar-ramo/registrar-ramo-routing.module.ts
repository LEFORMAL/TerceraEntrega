import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RegistrarRamoPage } from './registrar-ramo.page';

const routes: Routes = [
  {
    path: '',
    component: RegistrarRamoPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RegistrarRamoPageRoutingModule {}
