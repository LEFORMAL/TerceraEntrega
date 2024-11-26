import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ListaRamosPage } from './lista-ramos.page';

const routes: Routes = [
  {
    path: '',
    component: ListaRamosPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ListaRamosPageRoutingModule {}
