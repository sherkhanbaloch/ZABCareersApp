import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-contact',
  imports: [ReactiveFormsModule],
  templateUrl: './contact.html',
  styleUrl: './contact.css',
})
export class Contact {

  constructor(private http: HttpClient, private toastr: ToastrService) {
  }

  AddMessageForm = new FormGroup(
    {
      name: new FormControl(''),
      email: new FormControl(''),
      subject: new FormControl(''),
      messageText: new FormControl(''),
      checkStatus: new FormControl('Pending')
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

  }

}
