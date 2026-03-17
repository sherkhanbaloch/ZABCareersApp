import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-contact',
  imports: [ReactiveFormsModule],
  templateUrl: './contact.html',
  styleUrl: './contact.css',
})
export class Contact {

  constructor(private http: HttpClient) {
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
          console.log("Message Added Successfully.");
          this.ResetData();
        },
        error: (res) => {
          console.log("Error - Message Added Failed." + res)
        }
      }
    );
  }

  ResetData(): void {

  }

}
