import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ReactiveFormsModule,
  FormGroup,
  FormControl,
  Validators,
} from '@angular/forms';
import { AuthService } from '../../core/services/auth.Service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent {
  registerForm: FormGroup;
  message = '';
  error = '';

  constructor(private authService: AuthService) {
    this.registerForm = new FormGroup({
      username: new FormControl('', [
        Validators.required,
        Validators.minLength(3),
      ]),
      fullname: new FormControl('', [Validators.required]),
      password: new FormControl('', [
        Validators.required,
        Validators.minLength(6),
      ]),
    });
  }

  onRegister() {
    if (this.registerForm.invalid) {
      this.error = 'Please fill out all fields correctly.';
      return;
    }

    this.message = '';
    this.error = '';

    const { username, fullname, password } = this.registerForm.value;

    this.authService.register(username, password, fullname).subscribe({
      next: (res) => {
        if (res.success) {
          this.message = 'Registration successful! You can now login.';
          this.registerForm.reset();
        } else {
          this.error = res.message || 'Registration failed';
        }
      },
      error: (err) => {
        this.error = err.error?.message || 'Server error';
      },
    });
  }
}
