import { HttpClient } from '@angular/common/http';
import { Component, OnInit, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-update-job',
  imports: [ReactiveFormsModule],
  templateUrl: './update-job.html',
  styleUrl: './update-job.css',
})
export class UpdateJob implements OnInit {

  constructor(private route: ActivatedRoute, private http: HttpClient, private toastr: ToastrService) {
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
      jobId: new FormControl(),
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
      otherBenefits: new FormControl(''),
      departmentId: new FormControl(''),
      departmentName: new FormControl(''),
      campusId: new FormControl(''),
      campusName: new FormControl('')
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
        },
        error: (err) => {
          this.toastr.error("Error - " + err.error, 'Error', { closeButton: true });
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
