import { NgIf } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { publishFacade } from '@angular/compiler';
import { Component, OnInit, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-add-new-job',
  imports: [ReactiveFormsModule, NgIf],
  templateUrl: './add-new-job.html',
  styleUrl: './add-new-job.css',
})
export class AddNewJob {

  constructor(private http: HttpClient, private toastr: ToastrService) {
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
      jobTitle: new FormControl('', Validators.required),
      featuredImage: new FormControl(null),
      vacancy: new FormControl('', Validators.required),
      employmentStatus: new FormControl('', Validators.required),
      experience: new FormControl('', Validators.required),
      jobLocation: new FormControl('', Validators.required),
      salary: new FormControl('', Validators.required),
      gender: new FormControl('', Validators.required),
      publishedOn: new FormControl('', Validators.required),
      applicationDeadline: new FormControl('', Validators.required),
      jobDescription: new FormControl('', Validators.required),
      responsibilities: new FormControl('', Validators.required),
      educationAndExperience: new FormControl('', Validators.required),
      otherBenefits: new FormControl('', Validators.required),
      campusId: new FormControl('', Validators.required),
      departmentId: new FormControl('', Validators.required)
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
        error: (err) => {
          this.toastr.error("Error - " + err.error, 'Error', { closeButton: true });
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
        error: (err) => {
          this.toastr.error("Error - " + err.error, 'Error', { closeButton: true });
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
    formData.append('OtherBenefits', this.AddJobForm.value.otherBenefits!);
    formData.append('CampusId', this.AddJobForm.value.campusId!);
    formData.append('DepartmentId', this.AddJobForm.value.departmentId!);

    this.http.post('https://localhost:7147/api/Jobs/AddJob/', formData)
      .subscribe({
        next: (res) => {
          this.toastr.success("Job Added.", 'Success', { closeButton: true });
          this.ResetData();
        },
        error: (err) => {
          this.toastr.error("Error - " + err.error, 'Error', { closeButton: true });
        }
      });
  }

  ResetData(): void {
    this.AddJobForm.reset();
  }

  // For Validation
  get AddForm() {
    return this.AddJobForm.controls;
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
