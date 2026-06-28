import { DatePipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit, signal } from '@angular/core';
import { RouterLink } from "@angular/router";
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-home',
  imports: [RouterLink, DatePipe],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home implements OnInit {

  constructor(private http: HttpClient, private toastr: ToastrService) {
  }

  ngOnInit(): void {
    this.ShowAllJobs();
    this.ShowAllDepartments();
  }

  // Variables
  ListofJobs = signal<JobVM[]>([]);
  ListofDepartments = signal<DepartmentVM[]>([]);

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

  ShowAllDepartments(): void {
    this.http.get<DepartmentVM[]>('https://localhost:7147/api/Departments/GetTotalJobsWithDepartments/').subscribe(
      {
        next: (res) => {
          this.ListofDepartments.set(res);
        },
        error: (err) => {
          this.toastr.error("Error - " + err.error, 'Error', { closeButton: true });
        }
      }
    );
  }

}

// Interfaces
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

export interface DepartmentVM {
  departmentId: number;
  departmentName: string;
  totalJobs: number;
}
