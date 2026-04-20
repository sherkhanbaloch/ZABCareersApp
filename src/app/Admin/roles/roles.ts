import { HttpClient } from '@angular/common/http';
import { Component, OnInit, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { NgIf } from '@angular/common';


@Component({
  selector: 'app-roles',
  imports: [ReactiveFormsModule, NgIf],
  templateUrl: './roles.html',
  styleUrl: './roles.css',
})
export class Roles implements OnInit {

  constructor(private http: HttpClient, private toastr: ToastrService) {
  }

  ngOnInit(): void {
    this.ShowAllRoles();
  }

  // Variables
  ListofRoles = signal<RoleVM[]>([]);
  RoleId: number = 0;

  AddRoleForm = new FormGroup(
    {
      roleName: new FormControl('', Validators.required),
    }
  );

  EditRoleForm = new FormGroup(
    {
      roleName: new FormControl('', Validators.required),
    }
  );

  // APIs Methods
  ShowAllRoles(): void {
    this.http.get<RoleVM[]>('https://localhost:7147/api/Roles/GetAllRoles/').subscribe(
      {
        next: (res) => {
          this.ListofRoles.set(res);
        },
        error: (err) => {
          this.toastr.error("Error - " + err.error, 'Error', { closeButton: true });
        }
      }
    );
  }

  SaveRole(): void {
    this.http.post('https://localhost:7147/api/Roles/AddRole/', this.AddRoleForm.value).subscribe(
      {
        next: (res) => {
          this.toastr.success("Role Added.", 'Success', { closeButton: true });
          this.ShowAllRoles();
          this.ResetData();
        },
        error: (err) => {
          this.toastr.error("Error - " + err.error, 'Error', { closeButton: true });
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
        error: (err) => {
          this.toastr.error("Error - " + err.error, 'Error', { closeButton: true });
        }
      }
    );
  }

  UpdateRole(): void {
    this.http.put(`https://localhost:7147/api/Roles/UpdateRole/${this.RoleId}`, this.EditRoleForm.value).subscribe(
      {
        next: (res) => {
          this.toastr.success("Role Updated.", 'Success', { closeButton: true });
          this.ShowAllRoles();
          this.ResetData();
        },
        error: (err) => {
          this.toastr.error("Error - " + err.error, 'Error', { closeButton: true });
        }
      }
    );
  }

  DeleteRole(): void {
    this.http.delete(`https://localhost:7147/api/Roles/DeleteRole/${this.RoleId}`).subscribe(
      {
        next: (res) => {
          this.toastr.success("Role Deleted.", 'Success', { closeButton: true });
          this.ShowAllRoles();
        },
        error: (err) => {
          this.toastr.error("Error - " + err.error, 'Error', { closeButton: true });
        }
      }
    );
  }

  ResetData(): void {
    this.RoleId = 0;
    this.AddRoleForm.reset();
    this.EditRoleForm.reset();
  }

  // For Validation
  get AddForm() {
    return this.AddRoleForm.controls;
  }

  get EditForm() {
    return this.EditRoleForm.controls;
  }



}

// Interface
export interface RoleVM {
  roleId: number;
  roleName: string;
}
