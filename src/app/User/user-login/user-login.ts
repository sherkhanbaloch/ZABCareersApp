import { HttpClient } from '@angular/common/http';
import { Component, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth-service';

@Component({
  selector: 'app-user-login',
  imports: [ReactiveFormsModule],
  templateUrl: './user-login.html',
  styleUrl: './user-login.css',
})
export class UserLogin {

  constructor(private http: HttpClient, private router: Router, private auth: AuthService) {
  }

  LoginForm = new FormGroup(
    {
      userName: new FormControl(''),
      password: new FormControl(''),
    }
  );

  UserLogin(): void {
    this.http.post('https://localhost:7147/api/Auth/UserLogin', this.LoginForm.value, { responseType: 'text' }).subscribe(
      {
        next: (res) => {
          this.auth.setToken(res);
          console.log(res);
          this.router.navigate(['/user/profile']);
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
