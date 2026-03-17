import { DatePipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';

@Component({
  selector: 'app-job-application-details',
  imports: [RouterLink, DatePipe],
  templateUrl: './job-application-details.html',
  styleUrl: './job-application-details.css',
})
export class JobApplicationDetails implements OnInit {

  constructor(private route: ActivatedRoute, private http: HttpClient) {
  }

  ngOnInit(): void {
    this.JobId = Number(this.route.snapshot.paramMap.get('jobId'));
    this.GetApplicationsByJob(this.JobId);
  }

  // Variables
  ListofJobApplications = signal<JobApplicationDetailsVM[]>([]);
  JobId: number = 0;

  // APIs Methods
  GetApplicationsByJob(id: number): void {
    this.JobId = id;
    this.http.get<JobApplicationDetailsVM[]>(`https://localhost:7147/api/AppliedJob/GetApplicationsByJob/${this.JobId}`).subscribe(
      {
        next: (res) => {
          this.ListofJobApplications.set(res);
        },
        error: (res) => {
          console.log("Error - Data Fetch Failed." + res);
        }
      }
    );
  }

  GetRecordId(id: number): void {
    this.JobId = id;
  }

}


// Interfaces Class
export interface JobApplicationDetailsVM {
  appliedJobId: number;
  jobId: number;
  jobTitle: string;
  departmentName: string;
  applicationDeadline: string;
  totalApplications: number;
  candidateName: string;
  candidateEmail: string;
  resumeUsedUrl: string;
  matchedScore: number;
  applicationStatus: string;
}
