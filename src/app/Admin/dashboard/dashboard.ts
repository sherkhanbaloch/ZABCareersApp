import { HttpClient } from '@angular/common/http';
import { Component, OnInit, signal } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-dashboard',
  imports: [],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard implements OnInit {

  constructor(private http: HttpClient, private toastr: ToastrService) {
  }

  ngOnInit(): void {
    this.GetDashboardData();
  }

  // Variables
  data = signal<DashboardData | null>(null);

  // APIs Methods
  GetDashboardData(): void {
    this.http.get<DashboardData>(`https://localhost:7147/api/Dashboard/GetDashboardData/`).subscribe(
      {
        next: (res) => {
          this.data.set(res);
        },
        error: (err) => {
           this.toastr.error("Error - " + err.error, 'Error', { closeButton: true });
        }
      }
    );
  }

}


export interface DashboardData {
  totalJobs: number;
  totalJobUsers: number;
  totalUserQueries: number;
  totalCampuses: number;
  totalPortalUsers: number;
  totalRoles: number;
  totalDepartments: number;
}


