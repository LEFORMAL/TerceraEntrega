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
  ramos: any[] = []; // Array de ramos desde Firebase
  tareas: { nombre: string; fecha: string; completada: boolean }[] = [];
  nuevaTareaNombre: string = '';
  nuevaTareaFecha: string = '';
  private intervalId: any;

  // Mensajes aleatorios
  allMessages: string[] = [
    'A fin de año habrá un espectáculo en el auditorio.',
    'Recuerda solicitar que se complete la encuesta docente',
    'Recuerda que puedes denunciar bullying marcando al número falso.',
    'Recuerda que no hacer evaluaciones el 18 de septiembre.',
    'Si necesitas suplente puedes hacerlo llamando al número falso 2.',
    'Los sueldos son depositados el último día hábil del mes.',
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

  // Ir a la página de agregar ramos
  irAAgregarRamo() {
    this.router.navigate(['/tabs/tab2']);
  }

  // Obtener información del usuario actual
  async obtenerInformacionUsuario() {
    const user = await this.afAuth.currentUser; // Obtener el usuario autenticado
    if (user) {
      this.usuario.email = user.email || 'No disponible';

      // Consultar información adicional del usuario en Firestore
      this.firebaseService.getProfesorInfo(user.uid).subscribe((data: any) => {
        if (data) {
          this.usuario.nombre = data.nombre || 'Sin nombre';
          this.usuario.rut = data.rut || 'Sin RUT';
        }
      });
    } else {
      console.error('Usuario no autenticado');
    }
  }

  // Cargar ramos desde Firebase
  async cargarRamos() {
    try {
      console.log('Iniciando la carga de ramos...');
      const user = await this.firebaseService.getCurrentUser(); // Obtener usuario autenticado
      if (!user) {
        console.error('Usuario no autenticado.');
        return;
      }
      console.log('Usuario autenticado:', user.uid);
  
      // Obtener información del profesor
      this.firebaseService.getProfesorInfo(user.uid).subscribe(
        (profesorDoc) => {
          if (!profesorDoc || !profesorDoc.rut) {
            console.error('Error: No se pudo obtener el RUT del profesor.');
            return;
          }
  
          const profesorRut = profesorDoc.rut;
          console.log('RUT del profesor:', profesorRut);
  
          // Obtener ramos del profesor
          this.firebaseService.getRamosPorProfesorRut(profesorRut).subscribe(
            (data) => {
              console.log('Ramos obtenidos:', data);
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
      console.error('Error general al cargar ramos:', error);
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
  irAAgregarRamos() {
    this.router.navigate(['/tabs/tab2']); // Método público para navegar
  }

  ngOnInit() {
    this.obtenerInformacionUsuario(); // Cargar información del usuario al iniciar
    this.cargarRamos(); // Cargar ramos al iniciar
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
