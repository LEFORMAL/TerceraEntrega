import { Component, OnInit } from '@angular/core';
import { FirebaseService } from '../services/firebase.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-tab3',
  templateUrl: './tab3.page.html',
  styleUrls: ['./tab3.page.scss'],
})
export class Tab3Page implements OnInit {
  profileForm: FormGroup;
  isLoading: boolean = true;

  constructor(
    private firebaseService: FirebaseService,
    private fb: FormBuilder,
    private toastController: ToastController
  ) {
    this.profileForm = this.fb.group({
      nombre: ['', Validators.required],
      rut: ['', Validators.required],
      email: [{ value: '', disabled: true }], // Email no editable
      direccion: [''],
      fechaNacimiento: [''],
    });
  }

  async ngOnInit() {
    this.loadProfile();
  }

  async loadProfile() {
    try {
      const user = await this.firebaseService.getCurrentUser();
      this.firebaseService.getProfesorInfo(user?.uid).subscribe((data) => {
        this.profileForm.patchValue({
          nombre: data.nombre,
          rut: data.rut,
          email: data.email,
          direccion: data.direccion,
          fechaNacimiento: data.fechaNacimiento,
        });
        this.isLoading = false;
      });
    } catch (error) {
      this.showToast('Error al cargar el perfil');
      this.isLoading = false;
    }
  }

  async saveProfile() {
    if (this.profileForm.valid) {
      try {
        const user = await this.firebaseService.getCurrentUser();
        await this.firebaseService.updateProfesorInfo(user?.uid, this.profileForm.value);
        this.showToast('Perfil actualizado correctamente');
      } catch (error) {
        this.showToast('Error al actualizar el perfil');
      }
    } else {
      this.showToast('Por favor, complete todos los campos requeridos');
    }
  }

  async showToast(message: string) {
    const toast = await this.toastController.create({
      message,
      duration: 2000,
      position: 'bottom',
    });
    await toast.present();
  }
}
