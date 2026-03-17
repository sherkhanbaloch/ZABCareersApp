import { HttpClient } from '@angular/common/http';
import { Component, OnInit, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-departments',
  imports: [ReactiveFormsModule],
  templateUrl: './departments.html',
  styleUrl: './departments.css',
})
export class Departments implements OnInit {

  constructor(private http: HttpClient) {
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
        error: (res) => {
          console.log("Error - Data Fetch Failed." + res);
        }
      }
    );
  }

  SaveDepartment(): void {
    this.http.post('https://localhost:7147/api/Departments/AddDepartment/', this.AddDepartmentForm.value).subscribe(
      {
        next: (res) => {
          console.log("Department Added Successfully.");
          this.ShowAllDepartments();
          this.ResetData();
        },
        error: (res) => {
          console.log("Error - Department Added Failed." + res)
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
        error: (res) => {
          console.log("Error - Record Not Found." + res);
        }
      }
    );
  }

  UpdateDepartment(): void {
    this.http.put(`https://localhost:7147/api/Departments/UpdateDepartment/${this.DepartmentId}`, this.EditDepartmentForm.value).subscribe(
      {
        next: (res) => {
          console.log("Department Updated Successfully.");
          this.ShowAllDepartments();
          this.ResetData();
        },
        error: (res) => {
          console.log("Error - Department Updated Failed." + res)
        }
      }
    );
  }

  DeleteDepartment(): void {
    this.http.delete(`https://localhost:7147/api/Departments/DeleteDepartment/${this.DepartmentId}`).subscribe(
      {
        next: (res) => {
          console.log("Record Deleted.");
          this.ShowAllDepartments();
        },
        error: (res) => {
          console.log("Error - Record Not Deleted." + res);
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