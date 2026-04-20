import { DatePipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit, signal } from '@angular/core';
import { FormControl, FormControlName, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../services/auth-service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-job-details',
  imports: [DatePipe],
  templateUrl: './job-details.html',
  styleUrl: './job-details.css',
})
export class JobDetails implements OnInit {

  constructor(private route: ActivatedRoute, private router: Router, private http: HttpClient, private auth: AuthService, private toastr: ToastrService) {
  }

  ngOnInit(): void {

    this.JobId = Number(this.route.snapshot.paramMap.get('jobId'));
    this.UserId = Number(this.auth.getUserId());

    this.GetJobById(this.JobId);

    if (this.auth.isLoggedIn()) {
      this.CheckIsApplied();
    }

  }

  // Variables
  job = signal<JobDetails | null>(null);
  JobId: number = 0;
  UserId: number = 0;
  isApplied: boolean = false;

  // APIs Methods
  GetJobById(id: number): void {
    this.JobId = id;
    this.http.get<JobDetails>(`https://localhost:7147/api/Jobs/GetJobDetailsForUser/${this.JobId}`).subscribe(
      {
        next: (res) => {
          this.job.set(res);
        },
        error: (err) => {
          this.toastr.error("Error - " + err.error, 'Error', { closeButton: true });
        }
      }
    );
  }

  CheckIsApplied(): void {
    this.http.get<boolean>(`https://localhost:7147/api/AppliedJob/GetIsJobApplied/${this.JobId}/${this.UserId}`)
      .subscribe({
        next: (res) => {
          this.isApplied = res;
        },
        error: (err) => {
          this.isApplied = false;
        }
      });
  }

  AddApplication(): void {

    if (this.auth.isLoggedIn()) {
      
      const model = {
        jobId: this.JobId,
        candidateId: this.UserId
      };

      this.http.post('https://localhost:7147/api/AppliedJob/AddApplication', model).subscribe(
        {
          next: (res) => {
            this.toastr.success("Job Applied", 'Success', { closeButton: true });
            this.router.navigate([`/user/job-details/${this.JobId}`]);
            this.CheckIsApplied();
          },
          error: (err) => {
            this.toastr.error("Error - " + err.error, 'Error', { closeButton: true });
          }
        });
    }
    else {
      this.router.navigate(["/user/user-login/"]);
    }
  }

}


export interface JobDetails {
  jobId: number;
  jobTitle: string;
  featuredImage: string | null;
  featuredImageUrl: string | null;
  vacancy: number;
  employmentStatus: string;
  experience: string;
  jobLocation: string;
  salary: number;
  gender: string;
  publishedOn: string;
  applicationDeadline: string;
  jobDescription: string;
  responsibilities: string;
  educationAndExperience: string;
  otherBenefits: string;
  departmentId: number;
  departmentName: string;
  campusId: number;
  campusName: string;
  campusLogoUrl: string;
}

export interface IsAppliedVM {
  appliedJobId: number,
  jobId: number,
  candidateId: number
}