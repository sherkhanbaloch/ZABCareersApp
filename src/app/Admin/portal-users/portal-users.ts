import { HttpClient } from '@angular/common/http';
import { Component, OnInit, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-portal-users',
  imports: [ReactiveFormsModule],
  templateUrl: './portal-users.html',
  styleUrl: './portal-users.css',
})
export class PortalUsers implements OnInit {

  constructor(private http: HttpClient) {
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
        error: (res) => {
          console.log("Error - Roles Fetch Failed." + res);
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
        error: (res) => {
          console.log("Error - Campuses Fetch Failed." + res);
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
        error: (res) => {
          console.log("Error - Data Fetch Failed." + res);
        }
      }
    );
  }

  SaveUser(): void {
    this.http.post('https://localhost:7147/api/Users/AddUser/', this.AddUserForm.value).subscribe(
      {
        next: (res) => {
          console.log("User Added Successfully.");
          this.ShowAllUsers();
          this.ResetData();
        },
        error: (res) => {
          console.log("Error - User Added Failed." + res)
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
        error: (res) => {
          console.log("Error - Record Not Found." + res);
        }
      }
    );
  }

  UpdateUser(): void {
    this.http.put(`https://localhost:7147/api/Users/UpdateUser/${this.UserId}`, this.EditUserForm.value).subscribe(
      {
        next: (res) => {
          console.log("User Updated Successfully.");
          this.ShowAllUsers();
          this.ResetData();
        },
        error: (res) => {
          console.log("Error - User Updated Failed." + res)
        }
      }
    );
  }

  DeleteUser(): void {
    this.http.delete(`https://localhost:7147/api/Users/DeleteUser/${this.UserId}`).subscribe(
      {
        next: (res) => {
          console.log("Record Deleted.");
          this.ShowAllUsers();
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