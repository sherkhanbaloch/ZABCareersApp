import { NgIf } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth-service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-admin-login',
  imports: [ReactiveFormsModule, NgIf],
  templateUrl: './admin-login.html',
  styleUrl: './admin-login.css',
})
export class AdminLogin {

  constructor(private http: HttpClient, private router: Router, private auth: AuthService, private toastr: ToastrService) {
  }

  LoginForm = new FormGroup(
    {
      userName: new FormControl('', Validators.required),
      password: new FormControl('', Validators.required),
    }
  );

  AdminLogin(): void {
    this.http.post('https://localhost:7147/api/Auth/AdminLogin', this.LoginForm.value, { responseType: 'text' }).subscribe(
      {
        next: (res) => {
          this.auth.setToken(res);
          this.router.navigate(['/admin/dashboard']);
        },
        error: (err) => {
          this.toastr.error("Error - " + err.error, 'Error', { closeButton: true });
        }
      }
    );
  }

  ResetData(): void {
    this.LoginForm.reset();
  }

  // For Validation
  get loginForm() {
    return this.LoginForm.controls;
  }



}
