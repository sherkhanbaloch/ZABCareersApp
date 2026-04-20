import { HttpClient } from '@angular/common/http';
import { Component, signal } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../../services/auth-service';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-user-applied-jobs',
  imports: [DatePipe],
  templateUrl: './user-applied-jobs.html',
  styleUrl: './user-applied-jobs.css',
})
export class UserAppliedJobs {

  constructor(private http: HttpClient, private toastr: ToastrService, private auth: AuthService) {
  }

  ngOnInit(): void {
    this.UserId = Number(this.auth.getUserId());
    this.ShowAppliedJobs();

    this.UserName = this.auth.getUserName();
  }

  // Variables
  UserId: number = 0;
  UserName: string | null = '';
  ListOfJobs = signal<AppliedJobVM[]>([]);


  // APIs Methods
  ShowAppliedJobs(): void {
    this.http.get<AppliedJobVM[]>(`https://localhost:7147/api/AppliedJob/GetAppliedJobsForUser/${this.UserId}`).subscribe(
      {
        next: (res) => {
          this.ListOfJobs.set(res);
        },
        error: (err) => {
          this.toastr.error("Error - " + err.error, 'Error', { closeButton: true });
        }
      }
    );
  }

}


// Interface
export interface AppliedJobVM {
  appliedJobId: number;
  jobTitle: string;
  jobLocation: string;
  applicationDeadline: string;
  appliedOn: string;
  applicationStatus: string;
}