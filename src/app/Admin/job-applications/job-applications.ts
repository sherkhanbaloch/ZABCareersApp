import { DatePipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit, signal } from '@angular/core';
import { RouterLink } from "@angular/router";
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-job-applications',
  imports: [DatePipe, RouterLink],
  templateUrl: './job-applications.html',
  styleUrl: './job-applications.css',
})
export class JobApplications implements OnInit {

  constructor(private http: HttpClient, private toastr: ToastrService) {
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
        error: (err) => {
           this.toastr.error("Error - " + err.error, 'Error', { closeButton: true });
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
