import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { FirebaseService } from '../../services/firebase.service';

@Component({
  selector: 'app-generar-qr',
  templateUrl: './generar-qr.page.html',
  styleUrls: ['./generar-qr.page.scss'],
})
export class GenerarQrPage implements OnInit {
  ramo: any; // Datos del ramo seleccionado
  qrData: string = ''; // Datos que irán al QR
  alumno: any; // Datos del alumno autenticado

  constructor(
    private router: Router,
    private firebaseService: FirebaseService,
    private afAuth: AngularFireAuth
  ) {}

  async ngOnInit() {
    const navigation = this.router.getCurrentNavigation();
    if (navigation?.extras.state?.['ramo']) {
      this.ramo = navigation.extras.state['ramo']; // Acceso con corchetes
    } else {
      console.error('No se encontró información del ramo en el estado de navegación.');
      this.volver();
      return;
    }
    
    // Obtener datos del alumno autenticado
    const user = await this.afAuth.currentUser;
    if (user) {
      this.firebaseService.getAlumnoInfo(user.uid).subscribe((alumnoData) => {
        this.alumno = alumnoData;
  
        // Generar datos para el QR
        this.qrData = JSON.stringify({
          alumnoUid: user.uid,
          alumnoRut: this.alumno.rut,
          ramoId: this.ramo.id,
          timestamp: new Date().toISOString(),
        });
      });
    } else {
      console.error('Usuario no autenticado.');
      this.volver();
    }
  }
  
  volver() {
    this.router.navigate(['/tabs/tab2']);
  }
}
