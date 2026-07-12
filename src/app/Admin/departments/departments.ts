import { NgIf } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-departments',
  imports: [ReactiveFormsModule, NgIf],
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
      departmentName: new FormControl('', Validators.required),
    }
  );

  EditDepartmentForm = new FormGroup(
    {
      departmentName: new FormControl('', Validators.required),
    }
  );

  // APIs Methods
  ShowAllDepartments(): void {
    this.http.get<DepartmentVM[]>(`${environment.apiUrl}/Departments/GetAllDepartments/`).subscribe(
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
    this.http.post(`${environment.apiUrl}/Departments/AddDepartment/`, this.AddDepartmentForm.value).subscribe(
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
    this.http.get<any>(`${environment.apiUrl}/Departments/GetDepartmentByID/${this.DepartmentId}`).subscribe(
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
    this.http.put(`${environment.apiUrl}/Departments/UpdateDepartment/${this.DepartmentId}`, this.EditDepartmentForm.value).subscribe(
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
    this.http.delete(`${environment.apiUrl}/Departments/DeleteDepartment/${this.DepartmentId}`).subscribe(
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
    this.DepartmentId = 0;
    this.AddDepartmentForm.reset();
    this.EditDepartmentForm.reset();
  }

  // For Validation
  get AddForm() {
    return this.AddDepartmentForm.controls;
  }

  get EditForm() {
    return this.EditDepartmentForm.controls;
  }

}

// Interface
export interface DepartmentVM {
  departmentId: number;
  departmentName: string;
}