import { DatePipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit, signal } from '@angular/core';
import { RouterLink } from "@angular/router";

@Component({
  selector: 'app-job-listing',
  imports: [RouterLink, DatePipe],
  templateUrl: './job-listing.html',
  styleUrl: './job-listing.css',
})
export class JobListing implements OnInit {

  constructor(private http: HttpClient) {
  }

  ngOnInit(): void {
    this.ShowAllJobs();
  }

  // Variables
  ListofJobs = signal<JobVM[]>([]);

  // APIs Methods
  ShowAllJobs(): void {
    this.http.get<JobVM[]>('https://localhost:7147/api/Jobs/ViewJobsForUsers/').subscribe(
      {
        next: (res) => {
          this.ListofJobs.set(res);
        },
        error: (res) => {
          console.log("Error - Data Fetch Failed." + res);
        }
      }
    );
  }

}

export interface JobVM {
  jobId: number;
  campusLogoUrl: string;
  jobTitle: string;
  departmentName: string;
  campusName: string;
  salary: string;
  employmentStatus: string;
  publishedOn: string;
}
