import { HttpClient } from '@angular/common/http';
import { Component, OnInit, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { NgIf } from '@angular/common';


@Component({
  selector: 'app-update-job',
  imports: [ReactiveFormsModule, NgIf],
  templateUrl: './update-job.html',
  styleUrl: './update-job.css',
})
export class UpdateJob implements OnInit {

  constructor(private route: ActivatedRoute, private http: HttpClient, private toastr: ToastrService, private router: Router) {
  }

  ngOnInit(): void {
    this.LoadDepartments();
    this.LoadCampuses();

    this.JobId = Number(this.route.snapshot.paramMap.get('jobId'));
    this.GetJobById(this.JobId);
  }

  // Variables
  ListofDepartments = signal<DepartmentVM[]>([]);
  ListofCampuses = signal<CampusVM[]>([]);

  JobId: number = 0;

  EditJobForm = new FormGroup(
    {
      jobId: new FormControl('', Validators.required),
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
      departmentId: new FormControl('', Validators.required),
      departmentName: new FormControl('', Validators.required),
      campusId: new FormControl('', Validators.required),
      campusName: new FormControl('', Validators.required)
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

  GetJobById(id: number): void {
    this.JobId = id;
    this.http.get<any>(`https://localhost:7147/api/Jobs/GetJobByID/${this.JobId}`).subscribe(
      {
        next: (res) => {
          const ResData = res;
          this.EditJobForm.patchValue(ResData);
        },
        error: (err) => {
          this.toastr.error("Error - " + err.error, 'Error', { closeButton: true });
        }
      }
    );
  }

  UpdateJob() {
    const formData = new FormData();

    formData.append('JobTitle', this.EditJobForm.value.jobTitle!);
    if (this.selectedFile) {
      formData.append('FeaturedImage', this.selectedFile);
    }
    formData.append('Vacancy', this.EditJobForm.value.vacancy!);
    formData.append('EmploymentStatus', this.EditJobForm.value.employmentStatus!);
    formData.append('Experience', this.EditJobForm.value.experience!);
    formData.append('JobLocation', this.EditJobForm.value.jobLocation!);
    formData.append('Salary', this.EditJobForm.value.salary!);
    formData.append('Gender', this.EditJobForm.value.gender!);
    formData.append('PublishedOn', this.EditJobForm.value.publishedOn!);
    formData.append('ApplicationDeadline', this.EditJobForm.value.applicationDeadline!);
    formData.append('JobDescription', this.EditJobForm.value.jobDescription!);
    formData.append('Responsibilities', this.EditJobForm.value.responsibilities!);
    formData.append('EducationAndExperience', this.EditJobForm.value.educationAndExperience!);
    formData.append('OtherBenefits', this.EditJobForm.value.otherBenefits!);
    formData.append('DepartmentId', this.EditJobForm.value.departmentId!);
    formData.append('CampusId', this.EditJobForm.value.campusId!);

    this.http.put(`https://localhost:7147/api/Jobs/UpdateJob/${this.JobId}`, formData)
      .subscribe({
        next: (res) => {
          this.toastr.success("Job Updated.", 'Success', { closeButton: true });
          this.ResetData();
          this.router.navigate(['/admin/all-jobs']);
        },
        error: (err) => {
          this.toastr.error("Error - " + err.error, 'Error', { closeButton: true });
        }
      });
  }

  ResetData(): void {
    this.JobId = 0;
    this.EditJobForm.reset();
  }

   // For Validation
  get EditForm() {
    return this.EditJobForm.controls;
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
