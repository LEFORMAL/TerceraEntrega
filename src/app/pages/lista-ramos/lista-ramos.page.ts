import { Component, OnInit } from '@angular/core';
import { MenuController } from '@ionic/angular';
import { FirebaseService } from '../../services/firebase.service';
import { AngularFireAuth } from '@angular/fire/compat/auth'; // Firebase Auth
import { Router } from '@angular/router';

@Component({
  selector: 'app-lista-ramos',
  templateUrl: './lista-ramos.page.html',
  styleUrls: ['./lista-ramos.page.scss'],
})
export class ListaRamosPage implements OnInit {
  ramos: any[] = []; // Lista de ramos del profesor
  profesorRut: string = ''; // Rut del profesor autenticado

  constructor(
    private menuController: MenuController,
    private firebaseService: FirebaseService,
    private afAuth: AngularFireAuth,
    private router: Router // Asegúrate de mantener el `Router` aquí
  ) {}

  async ngOnInit() {
    try {
      console.log('Iniciando carga de ramos...');
      const user = await this.afAuth.currentUser;
      if (!user) {
        console.error('Usuario no autenticado.');
        return;
      }

      console.log('UID del usuario autenticado:', user.uid);

      // Obtener información del profesor desde Firestore
      this.firebaseService.getProfesorInfo(user.uid).subscribe(
        (profesorDoc) => {
          if (!profesorDoc) {
            console.error('No se encontró el documento del profesor.');
            return;
          }

          console.log('Documento del profesor obtenido:', profesorDoc);

          if (!profesorDoc.rut) {
            console.error('El documento del profesor no tiene el campo RUT.');
            return;
          }

          this.profesorRut = profesorDoc.rut;
          console.log('RUT del profesor:', this.profesorRut);

          // Consultar los ramos del profesor por su RUT
          this.firebaseService.getRamosPorProfesorRut(this.profesorRut).subscribe(
            (data) => {
              console.log('Ramos obtenidos desde Firestore:', data);
              this.ramos = data;
            },
            (error) => {
              console.error('Error al obtener los ramos:', error);
            }
          );
        },
        (error) => {
          console.error('Error al obtener la información del profesor:', error);
        }
      );
    } catch (error) {
      console.error('Error general en la carga de ramos:', error);
    }
  }

  irAAgregarRamos() {
    this.router.navigate(['/tabs/tab2']); // Método público para navegar
  }

  irAlEscaner(ramoId: string) {
    this.router.navigate(['/escaneo-qr', ramoId]);
  }
  irAlAlumno(ramoId: string) {
    this.router.navigate(['/lista-alumnos', ramoId]);
  }

  mostrarMenu() {
    this.menuController.open('first');
  }
}
