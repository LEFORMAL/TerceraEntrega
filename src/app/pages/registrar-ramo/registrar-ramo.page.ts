import { Component, OnInit } from '@angular/core';
import { FirebaseService } from '../../services/firebase.service';
import { AngularFireAuth } from '@angular/fire/compat/auth';

@Component({
  selector: 'app-registrar-ramo',
  templateUrl: './registrar-ramo.page.html',
  styleUrls: ['./registrar-ramo.page.scss'],
})
export class RegistrarRamoPage implements OnInit {
  ramos: any[] = []; // Lista de ramos creados por los profesores
  alumnoRut: string = ''; // RUT del alumno autenticado
  isLoading: boolean = true; // Bandera para mostrar un spinner

  constructor(
    private firebaseService: FirebaseService,
    private afAuth: AngularFireAuth
  ) {}

  async ngOnInit() {
    const user = await this.afAuth.currentUser;
    if (!user) {
      console.error('Usuario no autenticado');
      return;
    }

    // Obtener RUT del alumno
    this.firebaseService.getAlumnoInfo(user.uid).subscribe((data) => {
      if (data && data.rut) {
        this.alumnoRut = data.rut;
        this.cargarRamos(); // Cargar los ramos una vez que tengamos el RUT
      } else {
        console.error('No se encontró el RUT del alumno');
      }
    });
  }

  cargarRamos() {
    // Cargar todos los ramos existentes
    this.firebaseService.getRamos().subscribe(
      (data) => {
        this.ramos = data;
        this.isLoading = false;
      },
      (error) => {
        console.error('Error al cargar ramos:', error);
        this.isLoading = false;
      }
    );
  }

  async inscribirseEnRamo(ramo: any) {
    try {
      // Agregar el RUT del alumno al ramo
      await this.firebaseService.inscribirAlumnoEnRamo(ramo.id, this.alumnoRut);
      alert(`Te has inscrito en el ramo ${ramo.nombreRamo} exitosamente.`);
    } catch (error) {
      console.error('Error al inscribirse en el ramo:', error);
    }
  }
}
