import { HttpClient } from '@angular/common/http';
import { Component, OnInit, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-campuses',
  imports: [ReactiveFormsModule],
  templateUrl: './campuses.html',
  styleUrl: './campuses.css',
})
export class Campuses implements OnInit {


  constructor(private http: HttpClient) {
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
        error: (res) => {
          console.log("Error - Data Fetch Failed." + res);
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
          console.log("Campus Added Successfully.");
          this.ShowAllCampuses();
          this.ResetData();
        },
        error: (res) => {
          console.log("Error - Campus Added Failed." + res)
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
        error: (res) => {
          console.log("Error - Record Not Found." + res);
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
          console.log("Campus Updated Successfully.");
          this.ShowAllCampuses();
          this.ResetData();
        },
        error: (res) => {
          console.log(this.EditCampusForm.value);
          console.log("Error - Campus Updated Failed." + res)
        }
      }
    );
  }

  DeleteCampus(): void {
    this.http.delete(`https://localhost:7147/api/Campus/DeleteCampus/${this.CampusId}`).subscribe(
      {
        next: (res) => {
          console.log("Record Deleted.");
          this.ShowAllCampuses();
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

export interface CampusVM {
  campusId: number;
  campusName: string;
  campusLogoUrl: string;
  campusLocation: string
}
