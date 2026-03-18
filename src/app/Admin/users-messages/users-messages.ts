import { HttpClient } from '@angular/common/http';
import { Component, OnInit, signal } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-users-messages',
  imports: [],
  templateUrl: './users-messages.html',
  styleUrl: './users-messages.css',
})
export class UsersMessages implements OnInit {

  constructor(private http: HttpClient, private toastr: ToastrService) {
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
        error: (err) => {
          this.toastr.error("Error - " + err.error, 'Error', { closeButton: true });
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
          this.toastr.success("Message Deleted.", 'Success', { closeButton: true });
          this.ShowAllMessages();
        },
        error: (err) => {
          this.toastr.error("Error - " + err.error, 'Error', { closeButton: true });
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