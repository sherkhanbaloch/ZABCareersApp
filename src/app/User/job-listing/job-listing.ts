import { DatePipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit, signal } from '@angular/core';
import { RouterLink } from "@angular/router";
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-job-listing',
  imports: [RouterLink, DatePipe],
  templateUrl: './job-listing.html',
  styleUrl: './job-listing.css',
})
export class JobListing implements OnInit {

  constructor(private http: HttpClient, private toastr: ToastrService) {
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
        error: (err) => {
           this.toastr.error("Error - " + err.error, 'Error', { closeButton: true });
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
