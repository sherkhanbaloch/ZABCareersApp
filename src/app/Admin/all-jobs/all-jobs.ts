import { DatePipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit, Pipe, signal } from '@angular/core';
import { RouterLink } from "@angular/router";
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-all-jobs',
  imports: [RouterLink, DatePipe],
  templateUrl: './all-jobs.html',
  styleUrl: './all-jobs.css',
})
export class AllJobs implements OnInit {

  constructor(private http: HttpClient, private toastr: ToastrService) {
  }

  ngOnInit(): void {
    this.ShowAllJobs();
  }

  // Variables
  ListofJobs = signal<JobListVM[]>([]);
  JobId: number = 0;

  // APIs Methods
  ShowAllJobs(): void {
    this.http.get<JobListVM[]>('https://localhost:7147/api/Jobs/ViewJobsForAdmin/').subscribe(
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

  GetRecordId(id: number): void {
    this.JobId = id;
  }

  DeleteJob(): void {
    this.http.delete(`https://localhost:7147/api/Jobs/DeleteJob/${this.JobId}`).subscribe(
      {
        next: (res) => {
          this.toastr.success("Job Deleted.", 'Success', { closeButton: true });
          this.ShowAllJobs();
        },
        error: (res) => {
          console.log("Error - Record Not Deleted." + res);
        }
      }
    );
  }

}


// Interfaces Class
export interface JobListVM {
  jobId: number;
  jobTitle: string;
  employmentStatus: string;
  publishedOn: string;
  applicationDeadline: string;
  departmentName: string;
  campusName: string;
}