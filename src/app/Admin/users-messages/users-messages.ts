import { HttpClient } from '@angular/common/http';
import { Component, OnInit, signal } from '@angular/core';

@Component({
  selector: 'app-users-messages',
  imports: [],
  templateUrl: './users-messages.html',
  styleUrl: './users-messages.css',
})
export class UsersMessages implements OnInit {

  constructor(private http: HttpClient) {
  }

  ngOnInit(): void {
    this.ShowAllMessages();
  }

  // Variables
  ListofMessages = signal<MessageVM[]>([]);
  MessageId: number = 0;

  // APIs Methods
  ShowAllMessages(): void {
    this.http.get<MessageVM[]>('https://localhost:7147/api/Messages/GetAllMessages').subscribe(
      {
        next: (res) => {
          this.ListofMessages.set(res);
        },
        error: (res) => {
          console.log("Error - Messages Fetch Failed." + res);
        }
      }
    );
  }

  GetRecordId(id: number): void {
    this.MessageId = id;
  }

  DeleteMessage(): void {
    this.http.delete(`https://localhost:7147/api/Messages/DeleteMessage/${this.MessageId}`).subscribe(
      {
        next: (res) => {
          console.log("Record Deleted.");
          this.ShowAllMessages();
        },
        error: (res) => {
          console.log("Error - Record Not Deleted." + res);
        }
      }
    );
  }

}

// Interfaces Class
export interface MessageVM {
  messageId: number;
  name: string;
  email: string;
  subject: string;
  messageText: string;
  checkStatus: string;
}