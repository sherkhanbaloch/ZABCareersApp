import { DatePipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit, signal } from '@angular/core';
import { RouterLink } from "@angular/router";

@Component({
  selector: 'app-job-applications',
  imports: [DatePipe, RouterLink],
  templateUrl: './job-applications.html',
  styleUrl: './job-applications.css',
})
export class JobApplications implements OnInit {

  constructor(private http: HttpClient) {
  }

  ngOnInit(): void {
    this.ShowAllApplications();
  }

  // Variables
  ListofJobApplications = signal<JobApplicationsVM[]>([]);
  JobId: number = 0;

  // APIs Methods
  ShowAllApplications(): void {
    this.http.get<JobApplicationsVM[]>('https://localhost:7147/api/AppliedJob/GetJobApplications/').subscribe(
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
export interface JobApplicationsVM {
  jobId: number;
  jobTitle: string;
  departmentName: string;
  publishedOn: string;
  applicationDeadline: string;
  totalApplications: number;
}
