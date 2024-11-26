import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FirebaseService } from '../../services/firebase.service';
import { LoadingController, ToastController } from '@ionic/angular';
import { Router } from '@angular/router'; // Importar Router

@Component({
  selector: 'app-registro',
  templateUrl: './registro.page.html',
  styleUrls: ['./registro.page.scss'],
})
export class RegistroPage {
  registerForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private firebaseService: FirebaseService,
    private loadingCtrl: LoadingController,
    private toastCtrl: ToastController,
    private router: Router // Inyectar Router
  ) {
    this.registerForm = this.fb.group({
      nombre: ['', Validators.required],
      rut: ['', [Validators.required, this.validateRUT]],
      fechaNacimiento: ['', Validators.required],
      direccion: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required],
    }, { validator: this.matchPasswords('password', 'confirmPassword') });
  }

  getFormControl(controlName: string) {
    return this.registerForm.get(controlName);
  }

  validateRUT(control: any) {
    const rutRegex = /^\d{7,8}-[0-9kK]$/;
    if (!rutRegex.test(control.value)) {
      return { invalidRUT: true };
    }
    return null;
  }

  matchPasswords(password: string, confirmPassword: string) {
    return (formGroup: FormGroup) => {
      const pass = formGroup.controls[password];
      const confirmPass = formGroup.controls[confirmPassword];
      if (pass.value !== confirmPass.value) {
        confirmPass.setErrors({ notMatching: true });
      } else {
        confirmPass.setErrors(null);
      }
    };
  }

  async onRegister() {
    if (this.registerForm.invalid) {
      this.showToast('Por favor, complete todos los campos correctamente.');
      return;
    }
  
    const loading = await this.loadingCtrl.create({
      message: 'Registrando...',
    });
    await loading.present();
  
    const { nombre, rut, fechaNacimiento, direccion, email, password } = this.registerForm.value;
  
    try {
      await this.firebaseService.registerProfesor({
        nombre,
        rut,
        fechaNacimiento,
        direccion,
        email,
        password,
      });
      await loading.dismiss();
      this.showToast('Registro exitoso');
      this.registerForm.reset();
      this.router.navigate(['/login']); // Redirigir al login
    } catch (error: any) {
      await loading.dismiss();
      this.showToast(`Error: ${error.message}`);
    }
  }

  async showToast(message: string) {
    const toast = await this.toastCtrl.create({
      message,
      duration: 2000,
    });
    await toast.present();
  }
}
