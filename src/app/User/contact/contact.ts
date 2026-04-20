import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { NgIf } from '@angular/common';


@Component({
  selector: 'app-contact',
  imports: [ReactiveFormsModule, NgIf],
  templateUrl: './contact.html',
  styleUrl: './contact.css',
})

export class Contact {

  constructor(private http: HttpClient, private toastr: ToastrService) {
  }

  AddMessageForm = new FormGroup(
    {
      name: new FormControl('', Validators.required),
      email: new FormControl('', Validators.required),
      subject: new FormControl('', Validators.required),
      messageText: new FormControl('', Validators.required),
    }
  );

  SaveMessage(): void {
    this.http.post('https://localhost:7147/api/Messages/AddMessage/', this.AddMessageForm.value).subscribe(
      {
        next: (res) => {
          this.toastr.success("Message Sent.", 'Success', { closeButton: true });
          this.ResetData();
        },
        error: (err) => {
          this.toastr.error("Error - " + err.error, 'Error', { closeButton: true });
        }
      }
    );
  }

  ResetData(): void { 
    this.AddMessageForm.reset();
  }

  // For Validation
  get AddForm() {
    return this.AddMessageForm.controls;
  }



}
