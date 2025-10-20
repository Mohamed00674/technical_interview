import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.Service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  loginForm: FormGroup;
  message = '';
  error = '';

  constructor(private authService: AuthService, private router: Router) {
    this.loginForm = new FormGroup({
      username: new FormControl('', [Validators.required]),
      password: new FormControl('', [Validators.required]),
    });
  }

  onLogin() {
    if (this.loginForm.invalid) {
      this.error = 'Please fill in both username and password.';
      return;
    }

    this.message = '';
    this.error = '';

    const { username, password } = this.loginForm.value;

    this.authService.login(username, password).subscribe({
      next: (res) => {
        if (res.success && res.data) {
          this.authService.saveToken(res.data.token, res.data.refreshToken);
          this.router.navigate(['/']); // redirect to home
        } else {
          this.error = res.message || 'Login failed';
        }
      },
      error: (err) => {
        this.error = err.error?.message || 'Server error';
      },
    });
  }
}
