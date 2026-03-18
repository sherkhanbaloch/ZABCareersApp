import { HttpClient } from '@angular/common/http';
import { Component, OnInit, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-campuses',
  imports: [ReactiveFormsModule],
  templateUrl: './campuses.html',
  styleUrl: './campuses.css',
})
export class Campuses implements OnInit {


  constructor(private http: HttpClient, private toastr: ToastrService) {
  }

  ngOnInit(): void {
    this.ShowAllCampuses();
  }

  // Variables
  ListofCampuses = signal<CampusVM[]>([]);
  CampusId: number = 0;

  AddCampusForm = new FormGroup(
    {
      campusName: new FormControl(''),
      campusLogo: new FormControl(),
      campusLogoUrl: new FormControl(''),
      campusLocation: new FormControl(''),
      campusStatus: new FormControl('1')
    }
  );

  EditCampusForm = new FormGroup(
    {
      campusName: new FormControl(''),
      campusLogo: new FormControl(),
      campusLogoUrl: new FormControl(''),
      campusLocation: new FormControl(''),
    }
  );

  selectedFile!: File;

  onFileChange(event: any) {
    this.selectedFile = event.target.files[0];
  }

  // APIs Methods
  ShowAllCampuses(): void {
    this.http.get<CampusVM[]>('https://localhost:7147/api/Campus/GetAllCampuses/').subscribe(
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

  SaveCampus() {
    const formData = new FormData();

    formData.append('CampusName', this.AddCampusForm.value.campusName!);
    formData.append('CampusLogo', this.selectedFile);
    formData.append('CampusLocation', this.AddCampusForm.value.campusLocation!);
    formData.append('CampusStatus', '1');

    this.http.post('https://localhost:7147/api/Campus/AddCampus', formData)
      .subscribe({
        next: (res) => {
          this.toastr.success("Campus Added.", 'Success', { closeButton: true });
          this.ShowAllCampuses();
          this.ResetData();
        },
        error: (err) => {
          this.toastr.error("Error - " + err.error, 'Error', { closeButton: true });
        }
      });
  }


  GetRecordId(id: number): void {
    this.CampusId = id;
  }

  GetCampusById(id: number): void {
    this.CampusId = id;
    this.http.get<any>(`https://localhost:7147/api/Campus/GetCampusByID/${this.CampusId}`).subscribe(
      {
        next: (res) => {
          const ResData = res;
          this.EditCampusForm.patchValue(ResData);
        },
        error: (err) => {
          this.toastr.error("Error - " + err.error, 'Error', { closeButton: true });
        }
      }
    );
  }

  UpdateCampus(): void {
    const formData = new FormData();

    formData.append('CampusName', this.EditCampusForm.value.campusName!);
    formData.append('CampusLocation', this.EditCampusForm.value.campusLocation!);
    if (this.selectedFile) {
      formData.append('CampusLogo', this.selectedFile);
    }

    this.http.put(`https://localhost:7147/api/Campus/UpdateCampus/${this.CampusId}`, formData).subscribe(
      {
        next: (res) => {
          this.toastr.success("Campus Updated.", 'Success', { closeButton: true });
          this.ShowAllCampuses();
          this.ResetData();
        },
        error: (err) => {
          this.toastr.error("Error - " + err.error, 'Error', { closeButton: true });
        }
      }
    );
  }

  DeleteCampus(): void {
    this.http.delete(`https://localhost:7147/api/Campus/DeleteCampus/${this.CampusId}`).subscribe(
      {
        next: (res) => {
          this.toastr.success("Campus Deleted.", 'Success', { closeButton: true });
          this.ShowAllCampuses();
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

export interface CampusVM {
  campusId: number;
  campusName: string;
  campusLogoUrl: string;
  campusLocation: string
}
