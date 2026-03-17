import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth-service';

@Component({
  selector: 'app-admin-login',
  imports: [ReactiveFormsModule],
  templateUrl: './admin-login.html',
  styleUrl: './admin-login.css',
})
export class AdminLogin {


  constructor(private http: HttpClient, private router: Router, private auth: AuthService) {
  }

  LoginForm = new FormGroup(
    {
      userName: new FormControl(''),
      password: new FormControl(''),
    }
  );

  AdminLogin(): void {
    this.http.post('https://localhost:7147/api/Auth/AdminLogin', this.LoginForm.value, { responseType: 'text' }).subscribe(
      {
        next: (res) => {
          this.auth.setToken(res);
          console.log(res);
          this.router.navigate(['/admin/dashboard']);

        },
        error: (res) => {
          console.log("Error - Login Failed." + res)
        }
      }
    );
  }

  ResetData(): void {

  }


}
