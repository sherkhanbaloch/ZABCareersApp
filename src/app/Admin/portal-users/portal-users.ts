import { HttpClient } from '@angular/common/http';
import { Component, OnInit, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { NgIf } from '@angular/common';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-portal-users',
  imports: [ReactiveFormsModule, NgIf],
  templateUrl: './portal-users.html',
  styleUrl: './portal-users.css',
})
export class PortalUsers implements OnInit {

  constructor(private http: HttpClient, private toastr: ToastrService) {
  }

  ngOnInit(): void {
    this.LoadRoles();
    this.LoadCampuses();
    this.ShowAllUsers();
  }

  // Variables
  ListofRoles = signal<RolesVM[]>([]);
  ListofCampuses = signal<CampusVM[]>([]);
  ListofUsers = signal<UsersVM[]>([]);

  UserId: number = 0;

  AddUserForm = new FormGroup(
    {
      userName: new FormControl('', Validators.required),
      userEmail: new FormControl('', Validators.required),
      userPassword: new FormControl('', Validators.required),
      roleId: new FormControl('', Validators.required),
      campusId: new FormControl('', Validators.required),
    }
  );

  EditUserForm = new FormGroup(
    {
      userName: new FormControl('', Validators.required),
      userEmail: new FormControl('', Validators.required),
      userPassword: new FormControl(''),
      roleId: new FormControl('', Validators.required),
      campusId: new FormControl('', Validators.required),
    }
  );

  // APIs Methods
  LoadRoles(): void {
    this.http.get<RolesVM[]>(`${environment.apiUrl}/Roles/GetAllRoles/`).subscribe(
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

  LoadCampuses(): void {
    this.http.get<CampusVM[]>(`${environment.apiUrl}/Campus/GetCampusesForDropdown/`).subscribe(
      {
        next: (res) => {
          this.ListofCampuses.set(res);
        },
        error: (err) => {
          this.toastr.error("Error - " + err.error, 'Error', { closeButton: true });
        }
      }
    );
  }

  ShowAllUsers(): void {
    this.http.get<UsersVM[]>(`${environment.apiUrl}/Users/GetAllUsers/`).subscribe(
      {
        next: (res) => {
          this.ListofUsers.set(res);
        },
        error: (err) => {
          this.toastr.error("Error - " + err.error, 'Error', { closeButton: true });
        }
      }
    );
  }

  SaveUser(): void {
    this.http.post(`${environment.apiUrl}/Users/AddUser/`, this.AddUserForm.value).subscribe(
      {
        next: (res) => {
          this.toastr.success("User Added.", 'Success', { closeButton: true });
          this.ShowAllUsers();
          this.ResetData();
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

  GetUserById(id: number): void {
    this.UserId = id;
    this.http.get<any>(`${environment.apiUrl}/Users/GetUserByID/${this.UserId}`).subscribe(
      {
        next: (res) => {
          const ResData = res;
          this.EditUserForm.patchValue(ResData);
        },
        error: (err) => {
          this.toastr.error("Error - " + err.error, 'Error', { closeButton: true });
        }
      }
    );
  }

  UpdateUser(): void {
    this.http.put(`${environment.apiUrl}/Users/UpdateUser/${this.UserId}`, this.EditUserForm.value).subscribe(
      {
        next: (res) => {
          this.toastr.success("User Updated.", 'Success', { closeButton: true });
          this.ShowAllUsers();
          this.ResetData();
        },
        error: (err) => {
          this.toastr.error("Error - " + err.error, 'Error', { closeButton: true });
        }
      }
    );
  }

  DeleteUser(): void {
    this.http.delete(`${environment.apiUrl}/Users/DeleteUser/${this.UserId}`).subscribe(
      {
        next: (res) => {
          this.toastr.success("User Deleted.", 'Success', { closeButton: true });
          this.ShowAllUsers();
        },
        error: (err) => {
          this.toastr.error("Error - " + err.error, 'Error', { closeButton: true });
        }
      }
    );
  }

  ResetData(): void {
    this.UserId = 0;
    this.AddUserForm.reset();
    this.EditUserForm.reset();
  }


  // For Validation
  get AddForm() {
    return this.AddUserForm.controls;
  }

  get EditForm() {
    return this.EditUserForm.controls;
  }

}

// Interfaces

export interface RolesVM {
  roleId: number;
  roleName: string;
}

export interface CampusVM {
  campusId: number;
  campusName: string;
}


export interface UsersVM {
  userId: number;
  userName: string;
  userEmail: string;
  roleName: string;
  campusName: string;
}