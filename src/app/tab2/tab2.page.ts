import { Component, OnInit } from '@angular/core';
import { FirebaseService } from '../services/firebase.service';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Router } from '@angular/router';

@Component({
  selector: 'app-tab2',
  templateUrl: './tab2.page.html',
  styleUrls: ['./tab2.page.scss'],
})
export class Tab2Page implements OnInit {
  ramos: any[] = []; // Lista de ramos del alumno
  alumnoRut: string = ''; // RUT del alumno autenticado
  isLoading: boolean = true; // Bandera para el spinner de carga

  constructor(
    private firebaseService: FirebaseService,
    private afAuth: AngularFireAuth,
    private router: Router
  ) {}

  async ngOnInit() {
    this.cargarRamos();
  }

  async cargarRamos() {
    try {
      const user = await this.afAuth.currentUser; // Obtener usuario autenticado
      if (!user) {
        console.error('Usuario no autenticado');
        return;
      }

      // Obtener información del alumno desde Firestore
      this.firebaseService.getAlumnoInfo(user.uid).subscribe(
        (alumnoData) => {
          if (!alumnoData || !alumnoData.rut) {
            console.error('No se encontró el RUT del alumno.');
            return;
          }

          this.alumnoRut = alumnoData.rut; // Guardar el RUT del alumno

          // Obtener ramos asociados al alumno
          this.firebaseService.getRamosPorAlumnoRut(this.alumnoRut).subscribe(
            (ramos) => {
              this.ramos = ramos;
              this.isLoading = false; // Detener spinner
            },
            (error) => {
              console.error('Error al obtener los ramos:', error);
              this.isLoading = false;
            }
          );
        },
        (error) => {
          console.error('Error al obtener la información del alumno:', error);
          this.isLoading = false;
        }
      );
    } catch (error) {
      console.error('Error general al cargar los ramos:', error);
      this.isLoading = false;
    }
  }

  // Redirigir a la página de registrar ramo
  irARegistrarRamo() {
    this.router.navigate(['/registrar-ramo']);
  }

  // Redirigir a la página de generar QR con la información del ramo
  irAGenerarQR(ramo: any) {
    this.router.navigate(['/generar-qr'], { state: { ramo } });
  }
  
}
