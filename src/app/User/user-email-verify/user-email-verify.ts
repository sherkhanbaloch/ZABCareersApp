import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-user-email-verify',
  imports: [ReactiveFormsModule],
  templateUrl: './user-email-verify.html',
  styleUrl: './user-email-verify.css',
})
export class UserEmailVerify implements OnInit {

  constructor(private route: ActivatedRoute, private router: Router, private http: HttpClient, private toastr: ToastrService) {
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
          this.toastr.success("OTP Verified.", 'Success', { closeButton: true });
          this.router.navigate(['/user/user-login']);
        },
        error: (err) => {
          this.toastr.error("Error - " + err.error, 'Error', { closeButton: true });
        }
      }
    );
  }


}

