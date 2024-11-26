import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' }, // Redirigir al login como inicio
  {
    path: 'login',
    loadChildren: () => import('./pages/login/login.module').then((m) => m.LoginPageModule),
  },
  {
    path: 'tabs',
    loadChildren: () => import('./tabs/tabs.module').then((m) => m.TabsPageModule),
  },
  {
    path: 'registro',
    loadChildren: () => import('./pages/registro/registro.module').then((m) => m.RegistroPageModule),
  },
  {
    path: 'lista-ramos',
    loadChildren: () =>
      import('./pages/lista-ramos/lista-ramos.module').then((m) => m.ListaRamosPageModule),
  },
  {
    path: 'lista-alumnos/:ramoId',
    loadChildren: () =>
      import('./pages/lista-alumnos/lista-alumnos.module').then((m) => m.ListaAlumnosPageModule),
  },
  {
    path: 'escaneo-qr/:ramoId',
    loadChildren: () =>
      import('./pages/escaneo-qr/escaneo-qr.module').then((m) => m.EscaneoQrPageModule),
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
