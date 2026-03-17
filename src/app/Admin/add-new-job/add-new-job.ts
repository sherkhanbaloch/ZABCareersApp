import { HttpClient } from '@angular/common/http';
import { publishFacade } from '@angular/compiler';
import { Component, OnInit, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-add-new-job',
  imports: [ReactiveFormsModule],
  templateUrl: './add-new-job.html',
  styleUrl: './add-new-job.css',
})
export class AddNewJob {

  constructor(private http: HttpClient) {
  }

  ngOnInit(): void {
    this.LoadDepartments();
    this.LoadCampuses();
  }

  // Variables
  ListofDepartments = signal<DepartmentVM[]>([]);
  ListofCampuses = signal<CampusVM[]>([]);

  AddJobForm = new FormGroup(
    {
      jobTitle: new FormControl(''),
      featuredImage: new FormControl(),
      featuredImageUrl: new FormControl(''),
      vacancy: new FormControl(''),
      employmentStatus: new FormControl(''),
      experience: new FormControl(''),
      jobLocation: new FormControl(''),
      salary: new FormControl(''),
      gender: new FormControl(''),
      publishedOn: new FormControl(''),
      applicationDeadline: new FormControl(''),
      jobDescription: new FormControl(''),
      responsibilities: new FormControl(''),
      educationAndExperience: new FormControl(''),
      otherBenifits: new FormControl(''),
      jobStatus: new FormControl(''),
      campusId: new FormControl(''),
      departmentId: new FormControl('')
    }
  );

  selectedFile!: File;

  onFileChange(event: any) {
    this.selectedFile = event.target.files[0];
  }

  // APIs Methods
  LoadDepartments(): void {
    this.http.get<DepartmentVM[]>('https://localhost:7147/api/Departments/GetAllDepartments/').subscribe(
      {
        next: (res) => {
          this.ListofDepartments.set(res);
        },
        error: (res) => {
          console.log("Error - Department Fetch Failed." + res);
        }
      }
    );
  }

  LoadCampuses(): void {
    this.http.get<CampusVM[]>('https://localhost:7147/api/Campus/GetCampusesForDropdown/').subscribe(
      {
        next: (res) => {
          this.ListofCampuses.set(res);
        },
        error: (res) => {
          console.log("Error - Campuses Fetch Failed." + res);
        }
      }
    );
  }

  SaveJob() {
    const formData = new FormData();

    formData.append('JobTitle', this.AddJobForm.value.jobTitle!);
    formData.append('FeaturedImage', this.selectedFile);
    formData.append('Vacancy', this.AddJobForm.value.vacancy!);
    formData.append('EmploymentStatus', this.AddJobForm.value.employmentStatus!);
    formData.append('Experience', this.AddJobForm.value.experience!);
    formData.append('JobLocation', this.AddJobForm.value.jobLocation!);
    formData.append('Salary', this.AddJobForm.value.salary!);
    formData.append('Gender', this.AddJobForm.value.gender!);
    formData.append('PublishedOn', this.AddJobForm.value.publishedOn!);
    formData.append('ApplicationDeadline', this.AddJobForm.value.applicationDeadline!);
    formData.append('JobDescription', this.AddJobForm.value.jobDescription!);
    formData.append('Responsibilities', this.AddJobForm.value.responsibilities!);
    formData.append('EducationAndExperience', this.AddJobForm.value.educationAndExperience!);
    formData.append('OtherBenifits', this.AddJobForm.value.otherBenifits!);
    formData.append('JobStatus', '1');
    formData.append('CampusId', this.AddJobForm.value.campusId!);
    formData.append('DepartmentId', this.AddJobForm.value.departmentId!);

    this.http.post('https://localhost:7147/api/Jobs/AddJob/', formData)
      .subscribe({
        next: (res) => {
          console.log("Job Added Successfully.");
          this.ResetData();
        },
        error: (res) => {
          console.log("Error - Job Added Failed." + res)
        }
      });
  }

  ResetData(): void {

  }

}

// Interfaces

export interface DepartmentVM {
  departmentId: number;
  departmentName: string;
}

export interface CampusVM {
  campusId: number;
  campusName: string;
}
