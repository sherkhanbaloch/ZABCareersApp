import { HttpClient } from '@angular/common/http';
import { Component, OnInit, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-email-accounts',
  imports: [ReactiveFormsModule],
  templateUrl: './email-accounts.html',
  styleUrl: './email-accounts.css',
})
export class EmailAccounts implements OnInit {

  constructor(private http: HttpClient, private toastr: ToastrService) {
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
        error: (err) => {
          this.toastr.error("Error - " + err.error, 'Error', { closeButton: true });
        }
      }
    );
  }

  SaveEmail(): void {
    this.http.post('https://localhost:7147/api/EmailAccount/AddEmail/', this.AddEmailForm.value).subscribe(
      {
        next: (res) => {
          this.toastr.success("Email Added", 'Success', { closeButton: true });
          this.ShowAllEmails();
          this.ResetData();
        },
        error: (err) => {
          this.toastr.error("Error - " + err.error, 'Error', { closeButton: true });
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
        error: (err) => {
          this.toastr.error("Error - " + err.error, 'Error', { closeButton: true });
        }
      }
    );
  }

  UpdateEmail(): void {
    this.http.put(`https://localhost:7147/api/EmailAccount/UpdateEmail/${this.EmailId}`, this.EditEmailForm.value).subscribe(
      {
        next: (res) => {
          this.toastr.success("Email Updated.", 'Success', { closeButton: true });
          this.ShowAllEmails();
          this.ResetData();
        },
        error: (err) => {
          this.toastr.error("Error - " + err.error, 'Error', { closeButton: true });
        }
      }
    );
  }

  DeleteEmail(): void {
    this.http.delete(`https://localhost:7147/api/EmailAccount/DeleteEmail/${this.EmailId}`).subscribe(
      {
        next: (res) => {
          this.toastr.success("Email Deleted.", 'Success', { closeButton: true });
          this.ShowAllEmails();
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
export interface EmailAccountVM {
  emailAccountId: number;
  emailHost: string;
  emailPort: number;
  emailUsername: string;
  emailPassword: string;
  isDefault: boolean;
}

