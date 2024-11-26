import { Component } from '@angular/core';
import { AlertController, MenuController } from '@ionic/angular';
import { Router } from '@angular/router';
import { FirebaseService } from './services/firebase.service';

interface Menu{
  icon:string;
  name:string;
  redirecTo:string;
}

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {

  menu:Menu[]=[
    {
      icon:'home',
      name:'Home',
      redirecTo:'/tabs/tab1'
    },
    {
      icon:'qr-code',
      name:'Ingreso asistencia',
      redirecTo:'/lista-ramos'
    },
    {
      icon:'person-circle-outline',
      name:'Mi Perfil',
      redirecTo:'/tabs/tab3'
    }
   

  ]

  constructor(
    private alertCtrl: AlertController,
    private firebaseService: FirebaseService,
    private router: Router,
    private menuCtrl: MenuController
  ) {}

  async confirmLogout() {
    const alert = await this.alertCtrl.create({
      header: 'Cerrar Sesión',
      message: '¿Estás seguro de que deseas cerrar sesión?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          handler: () => {
            console.log('Cerrar sesión cancelado');
          },
        },
        {
          text: 'Cerrar Sesión',
          handler: async () => {
            await this.firebaseService.logout();
            this.menuCtrl.close(); // Cierra el menú
            this.router.navigate(['/login']); // Redirige al login
          },
        },
      ],
    });

    await alert.present();
  }
}
