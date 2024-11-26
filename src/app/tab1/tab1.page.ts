import { Component, OnInit, OnDestroy } from '@angular/core';
import { MenuController } from '@ionic/angular';
import { Router } from '@angular/router';
import { FirebaseService } from '../services/firebase.service'; // Importamos el servicio
import { AngularFireAuth } from '@angular/fire/compat/auth'; // Firebase Auth

@Component({
  selector: 'app-tab1',
  templateUrl: './tab1.page.html',
  styleUrls: ['./tab1.page.scss'],
})
export class Tab1Page implements OnInit, OnDestroy {
  usuario: any = {
    nombre: 'Cargando...',
    rut: 'Cargando...',
    email: 'Cargando...',
  };
  isLoading: boolean = true; // Bandera de carga para mostrar spinner
  tareas: { nombre: string; fecha: string; completada: boolean }[] = [];
  nuevaTareaNombre: string = '';
  nuevaTareaFecha: string = '';
  private intervalId: any;

  // Mensajes aleatorios
  allMessages: string[] = [
    'Bienvenido a la plataforma de asistencia.',
    'Recuerda completar tus tareas a tiempo.',
    'Tu asistencia es importante para tus logros académicos.',
    'Consulta tu perfil para actualizar tu información personal.',
  ];

  displayedMessages: string[] = [];

  constructor(
    private menuController: MenuController,
    private router: Router,
    private firebaseService: FirebaseService, // Servicio para Firebase
    private afAuth: AngularFireAuth // Servicio de autenticación
  ) {}

  // Mostrar menú
  mostrarMenu() {
    this.menuController.open('first');
  }

  // Ver perfil
  verPerfil() {
    this.router.navigate(['/tabs/tab3']);
  }

  // Cargar información del usuario (reutilizando lógica de tab3)
  async loadProfile() {
    try {
      const user = await this.firebaseService.getCurrentUser(); // Obtener usuario autenticado
      this.firebaseService.getAlumnoInfo(user?.uid).subscribe((data) => {
        if (data) {
          this.usuario.nombre = data.nombre || 'Sin nombre';
          this.usuario.rut = data.rut || 'Sin RUT';
          this.usuario.email = data.email || 'Sin email';
        }
        this.isLoading = false; // Datos cargados
      });
    } catch (error) {
      console.error('Error al cargar el perfil:', error);
      this.isLoading = false; // Detener spinner en caso de error
    }
  }

  // Agregar nueva tarea
  agregarTarea() {
    if (this.nuevaTareaNombre.trim() !== '' && this.nuevaTareaFecha.trim() !== '') {
      const nuevaTarea = {
        nombre: this.nuevaTareaNombre,
        fecha: this.nuevaTareaFecha,
        completada: false,
      };
      this.firebaseService.addTarea(nuevaTarea);
      this.nuevaTareaNombre = '';
      this.nuevaTareaFecha = '';
    } else {
      console.error('El nombre y la fecha de la tarea son obligatorios.');
    }
  }

  // Cargar tareas desde Firebase
  async cargarTareas() {
    this.firebaseService.getTareas().subscribe((data) => {
      this.tareas = data;
    });
  }

  // Marcar tarea como completada
  tareaCompletada(tarea: any) {
    this.firebaseService.updateTarea(tarea);
  }

  ngOnInit() {
    this.loadProfile(); // Cargar información del usuario al iniciar
    this.cargarTareas(); // Cargar tareas al iniciar
    this.showRandomMessages(); // Muestra mensajes aleatorios al iniciar la página
    this.startMessageRotation(); // Inicia la rotación de mensajes
  }

  ngOnDestroy() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }

  // Método para mostrar mensajes aleatorios
  showRandomMessages() {
    const shuffled = this.allMessages.sort(() => 0.5 - Math.random());
    this.displayedMessages = shuffled.slice(0, 2);
  }

  // Método para iniciar la rotación de mensajes
  startMessageRotation() {
    this.intervalId = setInterval(() => {
      this.showRandomMessages();
    }, 5000); // 5000 ms = 5 segundos
  }
}
