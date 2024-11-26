import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FirebaseService } from '../services/firebase.service';
import { LoadingController, ToastController } from '@ionic/angular';
import { MenuController } from '@ionic/angular';
import { Router } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/compat/auth'; // Firebase Auth

@Component({
  selector: 'app-tab2',
  templateUrl: './tab2.page.html',
  styleUrls: ['./tab2.page.scss'],
})
export class Tab2Page {
  ramoForm: FormGroup;

  constructor(
    private menuController: MenuController,
    private fb: FormBuilder,
    private firebaseService: FirebaseService,
    private loadingCtrl: LoadingController,
    private toastCtrl: ToastController,
    private router: Router,
    private afAuth: AngularFireAuth // Servicio de autenticación
  ) {
    this.ramoForm = this.fb.group({
      nombreRamo: ['', Validators.required],
      seccion: ['', Validators.required],
      sede: ['', Validators.required],
    });
  }

  mostrarMenu() {
    this.menuController.open('first');
  }

  getFormControl(controlName: string) {
    return this.ramoForm.get(controlName);
  }

  async onAddRamo() {
    if (this.ramoForm.invalid) {
      this.showToast('Por favor, complete todos los campos correctamente.');
      return;
    }
  
    const loading = await this.loadingCtrl.create({
      message: 'Añadiendo ramo...',
    });
    await loading.present();
  
    const { nombreRamo, seccion, sede } = this.ramoForm.value;
  
    try {
      const user = await this.afAuth.currentUser; // Obtener usuario autenticado
      if (!user) {
        this.showToast('Error: No estás autenticado. Inicia sesión nuevamente.');
        await loading.dismiss();
        return;
      }
  
      console.log('UID del usuario autenticado:', user.uid);
  
      // Agregar logs para verificar la consulta a Firestore
      console.log('Consultando Firestore con UID:', user.uid);
      this.firebaseService.getProfesorInfo(user.uid).subscribe(
        (profesorDoc) => {
          console.log('Resultado de Firestore:', profesorDoc);
  
          if (!profesorDoc || !profesorDoc.rut) {
            console.error('No se encontró el campo RUT en el documento del profesor.');
            this.showToast('Error: No se pudo obtener el RUT del profesor.');
            loading.dismiss();
            return;
          }
  
          const profesorRut = profesorDoc.rut;
          console.log('RUT del profesor:', profesorRut);
  
          // Guardar el ramo con el RUT del profesor
          this.firebaseService.addRamo({
            nombreRamo,
            seccion,
            sede,
            profesorRut, // Guardar el RUT del profesor
          }).then(() => {
            loading.dismiss();
            this.showToast('Ramo añadido exitosamente');
            this.ramoForm.reset();
          }).catch((error) => {
            loading.dismiss();
            console.error('Error al guardar el ramo:', error);
            this.showToast(`Error: ${error.message}`);
          });
        },
        (error) => {
          console.error('Error al consultar Firestore:', error);
          this.showToast(`Error: ${error.message}`);
          loading.dismiss();
        }
      );
    } catch (error: any) {
      await loading.dismiss();
      console.error('Error inesperado:', error);
      this.showToast(`Error: ${error.message || 'Error desconocido'}`);
    }
  }
  
  
  
  async verificarFirestore() {
    try {
      const prueba = await this.firebaseService.getRamos().toPromise();
      console.log('Conexión con Firebase exitosa:', prueba);
    } catch (error) {
      console.error('Error conectando a Firebase:', error);
    }
  }
  

  async showToast(message: string) {
    const toast = await this.toastCtrl.create({
      message,
      duration: 2000,
    });
    await toast.present();
  }
  ngOnInit() {
    this.verificarFirestore();
  }
  
}
