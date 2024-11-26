import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FirebaseService } from '../../services/firebase.service';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-lista-alumnos',
  templateUrl: './lista-alumnos.page.html',
  styleUrls: ['./lista-alumnos.page.scss'],
})
export class ListaAlumnosPage implements OnInit {
  ramoId: string = ''; // ID del ramo seleccionado
  alumnos: any[] = []; // Alumnos inscritos en el ramo

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private firebaseService: FirebaseService
  ) {}

  ngOnInit() {
    // Obtener el ID del ramo desde la URL
    this.ramoId = this.route.snapshot.paramMap.get('ramoId') || '';

    if (this.ramoId) {
      this.cargarAlumnos(); // Cargar alumnos inscritos
    }
  }

  cargarAlumnos() {
    this.firebaseService.getAlumnosPorRamo(this.ramoId).subscribe(
      (data) => {
        this.alumnos = data;
        console.log('Alumnos obtenidos:', this.alumnos);
      },
      (error) => {
        console.error('Error al cargar los alumnos:', error);
      }
    );
  }  

  // Método para navegar al escáner QR (si es necesario)
  escanearQR() {
    console.log('Abrir escáner QR para este ramo');
  }
  volver() {
    this.router.navigate(['/lista-ramos']);
  }
  
}
