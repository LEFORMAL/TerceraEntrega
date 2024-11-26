import { Component } from '@angular/core';
import { FirebaseService } from '../../services/firebase.service';
import { Router } from '@angular/router';
import { Camera } from '@capacitor/camera'; // Importar Camera de Capacitor
import { Capacitor } from '@capacitor/core';

@Component({
  selector: 'app-escanear-qr',
  templateUrl: './escaneo-qr.page.html',
  styleUrls: ['./escaneo-qr.page.scss'],
})
export class EscaneoQrPage {
  qrData: any = null; // Datos escaneados del QR

  constructor(private firebaseService: FirebaseService, private router: Router) {}

  // Solicitar permisos de cámara en dispositivos Android
  async solicitarPermisoCamara() {
    if (Capacitor.isNativePlatform()) {
      try {
        const permissions = await Camera.requestPermissions();
        if (permissions.camera !== 'granted') {
          alert('Permiso de cámara denegado. No se puede escanear QR.');
        }
      } catch (error) {
        console.error('Error al solicitar permiso de cámara:', error);
        alert('Hubo un problema al solicitar el permiso de cámara.');
      }
    } else {
      console.log('No es un dispositivo nativo, no se necesitan permisos.');
    }
  }

  // Inicializar permisos en ngOnInit
  async ngOnInit() {
    await this.solicitarPermisoCamara(); // Solicitar permiso de cámara
  }

  // Evento al escanear el código QR
  onCodeScanned(data: string) {
    try {
      this.qrData = JSON.parse(data); // Convertir el string del QR en objeto
      console.log('Datos del QR escaneados:', this.qrData);
    } catch (error) {
      console.error('Error al parsear datos del QR:', error);
      this.qrData = null; // Limpiar datos en caso de error
    }
  }

  // Registrar la asistencia en Firestore
  registrarAsistencia() {
    if (this.qrData) {
      this.firebaseService
        .addAsistencia(this.qrData.ramoId, this.qrData.alumnoRut, this.qrData.timestamp)
        .then(() => {
          console.log('Asistencia registrada exitosamente.');
          this.qrData = null; // Limpiar datos después de registrar
          alert('Asistencia registrada con éxito.');
        })
        .catch((error) => {
          console.error('Error al registrar asistencia:', error);
          alert('Hubo un error al registrar la asistencia.');
        });
    }
  }

  // Navegar de vuelta
  volver() {
    this.router.navigate(['/lista-ramos']);
  }
}
