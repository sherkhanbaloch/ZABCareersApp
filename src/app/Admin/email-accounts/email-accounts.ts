import { HttpClient } from '@angular/common/http';
import { Component, OnInit, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-email-accounts',
  imports: [ReactiveFormsModule],
  templateUrl: './email-accounts.html',
  styleUrl: './email-accounts.css',
})
export class EmailAccounts implements OnInit {

  constructor(private http: HttpClient) {
  }

  ngOnInit(): void {
    this.ShowAllEmails();
  }

  // Variables
  ListofEmails = signal<EmailAccountVM[]>([]);
  EmailId: number = 0;

  AddEmailForm = new FormGroup(
    {
      emailHost: new FormControl(''),
      emailPort: new FormControl(),
      emailUsername: new FormControl(''),
      emailPassword: new FormControl(''),
      isDefault: new FormControl(),
      emailAccountStatus: new FormControl(1)
    }
  );

  EditEmailForm = new FormGroup(
    {
      emailHost: new FormControl(''),
      emailPort: new FormControl(),
      emailUsername: new FormControl(''),
      emailPassword: new FormControl(''),
      isDefault: new FormControl(),
    }
  );

  // APIs Methods
  ShowAllEmails(): void {
    this.http.get<EmailAccountVM[]>('https://localhost:7147/api/EmailAccount/GetAllEmails/').subscribe(
      {
        next: (res) => {
          this.ListofEmails.set(res);
        },
        error: (res) => {
          console.log("Error - Data Fetch Failed." + res);
        }
      }
    );
  }

  SaveEmail(): void {
    this.http.post('https://localhost:7147/api/EmailAccount/AddEmail/', this.AddEmailForm.value).subscribe(
      {
        next: (res) => {
          console.log("Email Added Successfully.");
          this.ShowAllEmails();
          this.ResetData();
        },
        error: (res) => {
          console.log("Error - Email Added Failed." + res)
        }
      }
    );
  }

  GetRecordId(id: number): void {
    this.EmailId = id;
  }

  GetEmailById(id: number): void {
    this.EmailId = id;
    this.http.get<any>(`https://localhost:7147/api/EmailAccount/GetEmailByID/${this.EmailId}`).subscribe(
      {
        next: (res) => {
          const ResData = res;
          this.EditEmailForm.patchValue(ResData);
        },
        error: (res) => {
          console.log("Error - Record Not Found." + res);
        }
      }
    );
  }

  UpdateEmail(): void {
    this.http.put(`https://localhost:7147/api/EmailAccount/UpdateEmail/${this.EmailId}`, this.EditEmailForm.value).subscribe(
      {
        next: (res) => {
          console.log("Email Updated Successfully.");
          this.ShowAllEmails();
          this.ResetData();
        },
        error: (res) => {
          console.log("Error - Email Updated Failed." + res)
        }
      }
    );
  }

  DeleteEmail(): void {
    this.http.delete(`https://localhost:7147/api/EmailAccount/DeleteEmail/${this.EmailId}`).subscribe(
      {
        next: (res) => {
          console.log("Record Deleted.");
          this.ShowAllEmails();
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
export interface EmailAccountVM {
  emailAccountId: number;
  emailHost: string;
  emailPort: number;
  emailUsername: string;
  emailPassword: string;
  isDefault: boolean;
}

