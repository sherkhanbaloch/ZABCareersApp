import { HttpClient } from '@angular/common/http';
import { Component, OnInit, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { NgIf } from '@angular/common';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-email-accounts',
  imports: [ReactiveFormsModule, NgIf],
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
      emailHost: new FormControl('', Validators.required),
      emailPort: new FormControl('', Validators.required),
      emailUsername: new FormControl('', Validators.required),
      emailPassword: new FormControl('', Validators.required),
      isDefault: new FormControl(false),
    }
  );

  EditEmailForm = new FormGroup(
    {
      emailHost: new FormControl('', Validators.required),
      emailPort: new FormControl('', Validators.required),
      emailUsername: new FormControl('', Validators.required),
      emailPassword: new FormControl('', Validators.required),
      isDefault: new FormControl(false),
    }
  );

  // APIs Methods
  ShowAllEmails(): void {
    this.http.get<EmailAccountVM[]>(`${environment.apiUrl}/EmailAccount/GetAllEmails/`).subscribe(
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
    this.http.post(`${environment.apiUrl}/EmailAccount/AddEmail/`, this.AddEmailForm.value).subscribe(
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
    this.http.get<any>(`${environment.apiUrl}/EmailAccount/GetEmailByID/${this.EmailId}`).subscribe(
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
    this.http.put(`${environment.apiUrl}/EmailAccount/UpdateEmail/${this.EmailId}`, this.EditEmailForm.value).subscribe(
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
    this.http.delete(`${environment.apiUrl}/EmailAccount/DeleteEmail/${this.EmailId}`).subscribe(
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
    this.EmailId = 0;
    this.AddEmailForm.reset();
    this.EditEmailForm.reset();
  }

  // For Validation
  get AddForm() {
    return this.AddEmailForm.controls;
  }

  get EditForm() {
    return this.EditEmailForm.controls;
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

