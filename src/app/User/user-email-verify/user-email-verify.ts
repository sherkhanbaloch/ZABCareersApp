import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-user-email-verify',
  imports: [ReactiveFormsModule],
  templateUrl: './user-email-verify.html',
  styleUrl: './user-email-verify.css',
})
export class UserEmailVerify implements OnInit {

  constructor(private route: ActivatedRoute, private router: Router, private http: HttpClient) {
  }

  ngOnInit(): void {
    this.UserEmail = this.route.snapshot.queryParams['email'];
  }

  // Variables

  UserEmail: string | null = "";

  VerifyForm = new FormGroup(
    {
      OTPNumber: new FormControl(),
    }
  );

  // APIS Methods

  VerifyOTP(): void {

      const model = {
      email: this.UserEmail,
      otp: this.VerifyForm.value.OTPNumber
    };

    this.http.post<any>('https://localhost:7147/api/Auth/UserOTPVerify', model).subscribe(
      {
        next: (res) => {
          console.log("OTP Verified Successfully.");
          this.router.navigate(['/user/user-login'])
        },
        error: (res) => {
          console.log("Error - OTP Failed." + res)
        }
      }
    );
  }


}

