import { HttpClient } from '@angular/common/http';
import { Component, OnInit, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-roles',
  imports: [ReactiveFormsModule],
  templateUrl: './roles.html',
  styleUrl: './roles.css',
})
export class Roles implements OnInit {

  constructor(private http: HttpClient) {
  }

  ngOnInit(): void {
    this.ShowAllRoles();
  }

  // Variables
  ListofRoles = signal<RoleVM[]>([]);
  RoleId: number = 0;

  AddRoleForm = new FormGroup(
    {
      roleName: new FormControl(''),
      roleStatus: new FormControl('1')
    }
  );

  EditRoleForm = new FormGroup(
    {
      roleName: new FormControl(''),
    }
  );

  // APIs Methods
  ShowAllRoles(): void {
    this.http.get<RoleVM[]>('https://localhost:7147/api/Roles/GetAllRoles/').subscribe(
      {
        next: (res) => {
          this.ListofRoles.set(res);
        },
        error: (res) => {
          console.log("Error - Data Fetch Failed." + res);
        }
      }
    );
  }

  SaveRole(): void {
    this.http.post('https://localhost:7147/api/Roles/AddRole/', this.AddRoleForm.value).subscribe(
      {
        next: (res) => {
          console.log("Role Added Successfully.");
          this.ShowAllRoles();
          this.ResetData();
        },
        error: (res) => {
          console.log("Error - Role Added Failed." + res)
        }
      }
    );
  }

  GetRecordId(id: number): void {
    this.RoleId = id;
  }

  GetRoleById(id: number): void {
    this.RoleId = id;
    this.http.get<any>(`https://localhost:7147/api/Roles/GetRoleByID/${this.RoleId}`).subscribe(
      {
        next: (res) => {
          const ResData = res;
          this.EditRoleForm.patchValue(ResData);
        },
        error: (res) => {
          console.log("Error - Record Not Found." + res);
        }
      }
    );
  }

  UpdateRole(): void {
    this.http.put(`https://localhost:7147/api/Roles/UpdateRole/${this.RoleId}`, this.EditRoleForm.value).subscribe(
      {
        next: (res) => {
          console.log("Role Updated Successfully.");
          this.ShowAllRoles();
          this.ResetData();
        },
        error: (res) => {
          console.log("Error - Role Updated Failed." + res)
        }
      }
    );
  }

  DeleteRole(): void {
    this.http.delete(`https://localhost:7147/api/Roles/DeleteRole/${this.RoleId}`).subscribe(
      {
        next: (res) => {
          console.log("Record Deleted.");
          this.ShowAllRoles();
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
export interface RoleVM {
  roleId: number;
  roleName: string;
}
