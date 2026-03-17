import { DatePipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth-service';

@Component({
  selector: 'app-user-profile',
  imports: [ReactiveFormsModule],
  templateUrl: './user-profile.html',
  styleUrl: './user-profile.css',
})
export class UserProfile {

  constructor(private http: HttpClient, private auth: AuthService) {

  }

  ngOnInit(): void {

    this.UserId = Number(this.auth.getUserId());
    this.GetCandidateByID(this.UserId);
  }

  // Variables
  UserId: number = 0;

  UserProfileForm = new FormGroup(
    {
      candidateId: new FormControl(),
      candidateName: new FormControl(),
      candidateEmail: new FormControl(),
      candidatePassword: new FormControl(),
      candidateMobile: new FormControl(),
      candidateResumeUrl: new FormControl(),
      resumeLastUpdated: new FormControl()
    }
  );

  selectedFile!: File;

  onFileChange(event: any) {
    this.selectedFile = event.target.files[0];
  }

  // APIs Methods
  GetCandidateByID(id: number): void {
    this.http.get<any>(`https://localhost:7147/api/Candidates/GetCandidateByID/${this.UserId}`).subscribe(
      {
        next: (res) => {
          const ResData = res;
          this.UserProfileForm.patchValue(ResData);
        },
        error: (res) => {
          console.log("Error - Record Not Found." + res);
        }
      }
    );
  }

  UpdateProfile(): void {
    const formData = new FormData();

    let date = new Date();

    formData.append('CandidateName', this.UserProfileForm.value.candidateName!);
    formData.append('CandidateEmail', this.UserProfileForm.value.candidateEmail!);
    formData.append('CandidatePassword', this.UserProfileForm.value.candidatePassword!);
    formData.append('CandidateMobile', this.UserProfileForm.value.candidateMobile!);

    if (this.selectedFile) {
      formData.append('CandidateResume', this.selectedFile);
      formData.append('ResumeLastUpdated', date.toDateString());
    }

    this.http.put(`https://localhost:7147/api/Candidates/UpdateCandidate/${this.UserId}`, formData)
      .subscribe({
        next: (res) => {
          console.log("User Updated Successfully.");
        },
        error: (res) => {
          console.log("Error - User Updated Failed." + res)
        }
      });
  }


}

