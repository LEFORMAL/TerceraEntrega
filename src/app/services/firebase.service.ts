import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { arrayUnion } from 'firebase/firestore';


export interface Alumno {
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

  //Registro de Alumno
  async registerAlumno(alumno: {
    nombre: string;
    rut: string;
    fechaNacimiento: string;
    direccion: string;
    email: string;
    password: string;
  }) {
    const userCredential = await this.afAuth.createUserWithEmailAndPassword(alumno.email, alumno.password);

    return this.firestore.collection('alumnos').doc(userCredential.user?.uid).set({
      uid: userCredential.user?.uid,
      nombre: alumno.nombre,
      rut: alumno.rut,
      fechaNacimiento: alumno.fechaNacimiento,
      direccion: alumno.direccion,
      email: alumno.email,
    });
  }

  //Autenticación
  async login(email: string, password: string): Promise<void> {
    try {
      await this.afAuth.signInWithEmailAndPassword(email, password);
    } catch (error: any) {
      throw new Error(error.message || 'Error al iniciar sesión');
    }
  }

  async logout(): Promise<void> {
    try {
      await this.afAuth.signOut();
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
      throw error;
    }
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

  //Gestión de Alumno
  getAlumnoInfo(uid: string): Observable<any> {
    return this.firestore.collection('alumnos').doc(uid).valueChanges();
  }

  async updateAlumnoInfo(uid: string, data: any): Promise<void> {
    return this.firestore.collection('alumnos').doc(uid).update(data);
  }

  //Gestión de Tareas
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

  addTarea(tarea: { nombre: string; fecha: string; completada: boolean }) {
    return this.firestore.collection('tareas').add(tarea);
  }

  updateTarea(tarea: any) {
    return this.firestore.collection('tareas').doc(tarea.id).update({ completada: tarea.completada });
  }
  getRamosPorAlumnoRut(alumnoRut: string): Observable<any[]> {
    return this.firestore
      .collection('ramos', (ref) => ref.where('alumnos', 'array-contains', alumnoRut))
      .valueChanges();
  }
  getRamos(): Observable<any[]> {
    return this.firestore.collection('ramos').valueChanges({ idField: 'id' });
  }
  async inscribirAlumnoEnRamo(ramoId: string, alumnoRut: string): Promise<void> {
    const ramoRef = this.firestore.collection('ramos').doc(ramoId);
    return ramoRef.update({
      alumnos: arrayUnion(alumnoRut),
    });
  }
    
}
