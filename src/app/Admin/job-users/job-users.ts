import { DatePipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit, signal } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-job-users',
  imports: [DatePipe],
  templateUrl: './job-users.html',
  styleUrl: './job-users.css',
})
export class JobUsers implements OnInit {

  constructor(private http: HttpClient, private toastr: ToastrService) {
  }

  ngOnInit(): void {
    this.ShowAllJobs();
  }

  // Variables
  ListofJobUsers = signal<JobUserVM[]>([]);
  UserId: number = 0;

  // APIs Methods
  ShowAllJobs(): void {
    this.http.get<JobUserVM[]>('https://localhost:7147/api/Candidates/GetAllCandidates/').subscribe(
      {
        next: (res) => {
          this.ListofJobUsers.set(res);
        },
        error: (err) => {
           this.toastr.error("Error - " + err.error, 'Error', { closeButton: true });
        }
      }
    );
  }

  GetRecordId(id: number): void {
    this.UserId = id;
  }

  DeleteJob(): void {
    this.http.delete(`https://localhost:7147/api/Candidates/DeleteCandidate/${this.UserId}`).subscribe(
      {
        next: (res) => {
           this.toastr.success("Candidate Deleted.", 'Success', { closeButton: true });
          this.ShowAllJobs();
        },
        error: (err) => {
           this.toastr.error("Error - " + err.error, 'Error', { closeButton: true });
        }
      }
    );
  }

}


// Interfaces Class
export interface JobUserVM {
  candidateId: number;
  candidateName: string;
  candidateEmail: string;
  candidateMobile: string;
  candidateResumeUrl: string;
  resumeLastUpdated: string;
  isEmailVerified: boolean;
}