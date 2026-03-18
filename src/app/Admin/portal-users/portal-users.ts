import { HttpClient } from '@angular/common/http';
import { Component, OnInit, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-portal-users',
  imports: [ReactiveFormsModule],
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
      userName: new FormControl(''),
      userEmail: new FormControl(''),
      userPassword: new FormControl(''),
      roleId: new FormControl(''),
      campusId: new FormControl(''),
      userStatus: new FormControl('1')
    }
  );

  EditUserForm = new FormGroup(
    {
      userName: new FormControl(''),
      userEmail: new FormControl(''),
      userPassword: new FormControl(''),
      roleId: new FormControl(''),
      campusId: new FormControl(''),
      userStatus: new FormControl('1')
    }
  );

  // APIs Methods
  LoadRoles(): void {
    this.http.get<RolesVM[]>('https://localhost:7147/api/Roles/GetAllRoles/').subscribe(
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
    this.http.get<CampusVM[]>('https://localhost:7147/api/Campus/GetCampusesForDropdown/').subscribe(
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
    this.http.get<UsersVM[]>('https://localhost:7147/api/Users/GetAllUsers/').subscribe(
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
    this.http.post('https://localhost:7147/api/Users/AddUser/', this.AddUserForm.value).subscribe(
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
    this.http.get<any>(`https://localhost:7147/api/Users/GetUserByID/${this.UserId}`).subscribe(
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
    this.http.put(`https://localhost:7147/api/Users/UpdateUser/${this.UserId}`, this.EditUserForm.value).subscribe(
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
    this.http.delete(`https://localhost:7147/api/Users/DeleteUser/${this.UserId}`).subscribe(
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