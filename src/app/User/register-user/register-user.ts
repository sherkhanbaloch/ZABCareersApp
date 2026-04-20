import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-register-user',
  imports: [ReactiveFormsModule, NgIf],
  templateUrl: './register-user.html',
  styleUrl: './register-user.css',
})
export class RegisterUser {

  constructor(private http: HttpClient, private router: Router, private toastr: ToastrService) {
  }

  AddUserForm = new FormGroup(
    {
      candidateName: new FormControl('', Validators.required),
      candidateEmail: new FormControl('', Validators.required),
      candidatePassword: new FormControl('', Validators.required),
      candidateMobile: new FormControl('', Validators.required),
      candidateResume: new FormControl(null, Validators.required),
      candidateResumeUrl: new FormControl('', Validators.required),
      resumeLastUpdated: new FormControl('', Validators.required),
    }
  );

  selectedFile!: File;

  onFileChange(event: any) {
    this.selectedFile = event.target.files[0];
  }

  SaveUser() {

    const formData = new FormData();

    let date = new Date();

    formData.append('CandidateName', this.AddUserForm.value.candidateName!);
    formData.append('CandidateEmail', this.AddUserForm.value.candidateEmail!);
    formData.append('CandidatePassword', this.AddUserForm.value.candidatePassword!);
    formData.append('CandidateMobile', this.AddUserForm.value.candidateMobile!);
    formData.append('CandidateResume', this.selectedFile);
    formData.append('ResumeLastUpdated', date.toDateString());

    this.http.post('https://localhost:7147/api/Candidates/AddCandidate/', formData)
      .subscribe({
        next: (res) => {
          this.toastr.success("User Registered. Verify Your Email.", 'Success', { closeButton: true });
          this.router.navigate(['/user/user-email-verify'], { queryParams: { email: this.AddUserForm.get('candidateEmail')?.value } });
        },
        error: (err) => {
          this.toastr.error("Error - " + err.error, 'Error', { closeButton: true });
        }
      });
  }

  // For Validation
  get AddForm() {
    return this.AddUserForm.controls;
  }


}
