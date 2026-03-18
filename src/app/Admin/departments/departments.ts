import { HttpClient } from '@angular/common/http';
import { Component, OnInit, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-departments',
  imports: [ReactiveFormsModule],
  templateUrl: './departments.html',
  styleUrl: './departments.css',
})
export class Departments implements OnInit {

  constructor(private http: HttpClient, private toastr: ToastrService) {
  }

  ngOnInit(): void {
    this.ShowAllDepartments();
  }

  // Variables
  ListofDepartments = signal<DepartmentVM[]>([]);
  DepartmentId: number = 0;

  AddDepartmentForm = new FormGroup(
    {
      departmentName: new FormControl(''),
      departmentStatus: new FormControl('1')
    }
  );

  EditDepartmentForm = new FormGroup(
    {
      departmentName: new FormControl(''),
    }
  );

  // APIs Methods
  ShowAllDepartments(): void {
    this.http.get<DepartmentVM[]>('https://localhost:7147/api/Departments/GetAllDepartments/').subscribe(
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

  SaveDepartment(): void {
    this.http.post('https://localhost:7147/api/Departments/AddDepartment/', this.AddDepartmentForm.value).subscribe(
      {
        next: (res) => {
          this.toastr.success("Department Added.", 'Success', { closeButton: true });
          this.ShowAllDepartments();
          this.ResetData();
        },
        error: (err) => {
          this.toastr.error("Error - " + err.error, 'Error', { closeButton: true });
        }
      }
    );
  }

  GetRecordId(id: number): void {
    this.DepartmentId = id;
  }

  GetDepartmentById(id: number): void {
    this.DepartmentId = id;
    this.http.get<any>(`https://localhost:7147/api/Departments/GetDepartmentByID/${this.DepartmentId}`).subscribe(
      {
        next: (res) => {
          const ResData = res;
          this.EditDepartmentForm.patchValue(ResData);
        },
        error: (err) => {
          this.toastr.error("Error - " + err.error, 'Error', { closeButton: true });
        }
      }
    );
  }

  UpdateDepartment(): void {
    this.http.put(`https://localhost:7147/api/Departments/UpdateDepartment/${this.DepartmentId}`, this.EditDepartmentForm.value).subscribe(
      {
        next: (res) => {
          this.toastr.success("Department Updated.", 'Success', { closeButton: true });
          this.ShowAllDepartments();
          this.ResetData();
        },
        error: (err) => {
          this.toastr.error("Error - " + err.error, 'Error', { closeButton: true });
        }
      }
    );
  }

  DeleteDepartment(): void {
    this.http.delete(`https://localhost:7147/api/Departments/DeleteDepartment/${this.DepartmentId}`).subscribe(
      {
        next: (res) => {
          this.toastr.success("Department Deleted.", 'Success', { closeButton: true });
          this.ShowAllDepartments();
        },
        error: (err) => {
           this.toastr.error("Error - " + err.error, 'Error', { closeButton: true });
        }
      }
    );
  }

  ResetData(): void {

  }

}

// Interface
export interface DepartmentVM {
  departmentId: number;
  departmentName: string;
}