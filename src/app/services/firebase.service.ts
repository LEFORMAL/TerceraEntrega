import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable} from 'rxjs';
import { map, mergeMap } from 'rxjs/operators'; // Corregida la importación
import { arrayUnion, FieldValue } from 'firebase/firestore';


export interface Profesor {
  uid: string;
  nombre: string;
  rut: string;
  email: string;
  direccion: string;
  fechaNacimiento: string;
}

@Injectable({
  providedIn: 'root',
})
export class FirebaseService {
  constructor(private afAuth: AngularFireAuth, private firestore: AngularFirestore) {}

  // Registrar un nuevo profesor
  async registerProfesor(profesor: {
    nombre: string;
    rut: string;
    fechaNacimiento: string;
    direccion: string;
    email: string;
    password: string;
  }) {
    const userCredential = await this.afAuth.createUserWithEmailAndPassword(profesor.email, profesor.password);

    return this.firestore.collection('profesores').doc(userCredential.user?.uid).set({
      uid: userCredential.user?.uid,
      nombre: profesor.nombre,
      rut: profesor.rut,
      fechaNacimiento: profesor.fechaNacimiento,
      direccion: profesor.direccion,
      email: profesor.email,
    });
  }

  // Iniciar sesión
  async login(email: string, password: string): Promise<void> {
    try {
      await this.afAuth.signInWithEmailAndPassword(email, password);
    } catch (error: any) {
      throw new Error(error.message || 'Error al iniciar sesión');
    }
  }

  // Cerrar sesión
  async logout(): Promise<void> {
    try {
      await this.afAuth.signOut();
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
      throw error;
    }
  }

  // Obtener información del profesor basado en el UID
  getProfesorInfo(uid: string): Observable<any> {
    return this.firestore.collection('profesores').doc(uid).valueChanges();
  }

  // Añadir un nuevo ramo
  async addRamo(ramo: { nombreRamo: string; seccion: string; sede: string; profesorRut: string }) {
    const ramoId = this.firestore.createId();
    return this.firestore.collection('ramos').doc(ramoId).set({
      id: ramoId,
      ...ramo,
    });
  }

  // Obtener ramos
  getRamos(): Observable<any[]> {
    return this.firestore.collection('ramos').valueChanges({ idField: 'id' });
  }

  getRamosPorProfesorRut(rut: string): Observable<any[]> {
    console.log('Consultando ramos en Firestore para el RUT:', rut);
    return this.firestore
      .collection('ramos', (ref) => ref.where('profesorRut', '==', rut))
      .valueChanges({ idField: 'id' });
  }

  // Obtener tareas
  getTareas(): Observable<any[]> {
    return this.firestore.collection('tareas').valueChanges({ idField: 'id' }).pipe(
      map((data: any[]) =>
        data.map((tarea) => ({
          id: tarea.id,
          nombre: tarea.nombre || '',
          fecha: tarea.fecha || '',
          completada: tarea.completada || false,
        }))
      )
    );
  }

  // Añadir nueva tarea
  addTarea(tarea: { nombre: string; fecha: string; completada: boolean }) {
    return this.firestore.collection('tareas').add(tarea);
  }

  // Actualizar tarea (marcar como completada o no)
  updateTarea(tarea: any) {
    return this.firestore.collection('tareas').doc(tarea.id).update({ completada: tarea.completada });
  }

  // Obtener alumnos inscritos en un ramo
  getAlumnosPorRamo(ramoId: string): Observable<any[]> {
    return new Observable<any[]>((observer) => {
      this.firestore
        .collection('ramos')
        .doc(ramoId)
        .valueChanges()
        .subscribe(
          (ramo: any) => {
            if (!ramo || !ramo.alumnos || !Array.isArray(ramo.alumnos) || ramo.alumnos.length === 0) {
              console.log('No hay alumnos en este ramo:', ramoId);
              observer.next([]); // Devuelve un array vacío si no hay alumnos
              observer.complete();
              return;
            }
  
            // Lista para almacenar los resultados de alumnos
            const alumnos: any[] = [];
            let consultasRestantes = ramo.alumnos.length;
  
            // Consultar cada RUT en la colección de alumnos
            ramo.alumnos.forEach((rut: string) => {
              this.firestore
                .collection('alumnos', (ref) => ref.where('rut', '==', rut))
                .valueChanges()
                .subscribe(
                  (resultados: any[]) => {
                    if (resultados.length > 0) {
                      alumnos.push(resultados[0]); // Agrega el primer resultado encontrado
                    }
                    consultasRestantes--;
  
                    // Cuando todas las consultas hayan finalizado
                    if (consultasRestantes === 0) {
                      observer.next(alumnos); // Enviar los datos
                      observer.complete();
                    }
                  },
                  (error) => {
                    console.error(`Error al obtener datos para el RUT ${rut}:`, error);
                    consultasRestantes--;
  
                    // Cuando todas las consultas hayan finalizado
                    if (consultasRestantes === 0) {
                      observer.next(alumnos); // Enviar los datos acumulados
                      observer.complete();
                    }
                  }
                );
            });
          },
          (error) => {
            console.error('Error al cargar el ramo:', error);
            observer.error(error);
          }
        );
    });
  }

  // Obtener asistencia por rut, ramo y fecha
  getAsistencia(rut: string, ramoId: string, fecha: string): Observable<any[]> {
    return this.firestore
      .collection('asistencias', (ref) =>
        ref.where('rut', '==', rut).where('ramoId', '==', ramoId).where('fecha', '==', fecha)
      )
      .valueChanges();
  }
  async updateProfesorInfo(uid: string, data: any): Promise<void> {
    return this.firestore.collection('profesores').doc(uid).update(data);
  }
  async getCurrentUser(): Promise<any> {
    return new Promise((resolve, reject) => {
      this.afAuth.onAuthStateChanged((user) => {
        if (user) {
          resolve(user);
        } else {
          reject('No hay usuario autenticado');
        }
      });
    });
  }
  async addAsistencia(ramoId: string, alumnoRut: string, fecha: string): Promise<void> {
    try {
      const ramoRef = this.firestore.collection('ramos').doc(ramoId);
  
      await ramoRef.update({
        alumnos: arrayUnion({
          rut: alumnoRut,
          asistencia: arrayUnion(fecha),
        }),
      });
  
      console.log(`Asistencia registrada para el alumno ${alumnoRut} en el ramo ${ramoId}`);
    } catch (error) {
      console.error('Error al registrar la asistencia:', error);
      throw error;
    }
  }
  
  
  
  
}
