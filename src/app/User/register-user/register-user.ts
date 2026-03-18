import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-register-user',
  imports: [ReactiveFormsModule],
  templateUrl: './register-user.html',
  styleUrl: './register-user.css',
})
export class RegisterUser {

  constructor(private http: HttpClient, private router: Router, private toastr: ToastrService) {
  }

  AddUserForm = new FormGroup(
    {
      candidateName: new FormControl(''),
      candidateEmail: new FormControl(),
      candidatePassword: new FormControl(''),
      candidateMobile: new FormControl(''),
      candidateResume: new FormControl(),
      candidateResumeUrl: new FormControl(''),
      resumeLastUpdated: new FormControl(''),
      candidateStatus: new FormControl('1')
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
    formData.append('CandidateStatus', '1');

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

}
