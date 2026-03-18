import { DatePipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-resume-analysis',
  imports: [DatePipe],
  templateUrl: './resume-analysis.html',
  styleUrl: './resume-analysis.css',
})
export class ResumeAnalysis implements OnInit {

  constructor(private route: ActivatedRoute, private http: HttpClient, private toastr: ToastrService) {
  }

  ngOnInit(): void {

    this.ApplyJobId = Number(this.route.snapshot.paramMap.get('appliedJobId'));
    this.GetResumeAnalysis(this.ApplyJobId);
  }

  // Variables
  resumeDetails = signal<ResumeDetails | null>(null);
  ApplyJobId: number = 0;

  // APIs Methods
  GetResumeAnalysis(id: number): void {
    this.ApplyJobId = id;
    this.http.get<ResumeDetails>(`https://localhost:7147/api/ResumeAnalysis/GetResumeAnalysis/${this.ApplyJobId}`).subscribe(
      {
        next: (res) => {
          this.resumeDetails.set(res);
        },
        error: (err) => {
          this.toastr.error("Error - " + err.error, 'Error', { closeButton: true });
        }
      }
    );
  }

  ChangeApplicationStatus(status: string): void {

    this.http.put(`https://localhost:7147/api/AppliedJob/ChangeApplicationStatus/${this.ApplyJobId}/${status}`, {}).subscribe(
      {
        next: (res) => {
          this.toastr.success("Application Status Updated.", 'Success', { closeButton: true });
          this.GetResumeAnalysis(this.ApplyJobId);
          this.SendEmail(status);
        },
        error: (err) => {
          this.toastr.error("Error - " + err.error, 'Error', { closeButton: true });
        }
      }
    );
  }

  SendEmail(status: string): void {

    let model = {};

    if (status == "Shortlisted") {
      model = {
        "toEmail": this.resumeDetails()?.candidateEmail,
        "subject": "Application Shortlisted – Next Steps for " + this.resumeDetails()?.jobTitle,
        "body": "<p>Thank you for applying for the <b>" + this.resumeDetails()?.jobTitle + "</b> position at <b>" + this.resumeDetails()?.campusName + "</b>.</p> <p>After carefully reviewing your application, we are pleased to inform you that your profile has been <b>shortlisted for the next stage of the recruitment process</b>.</p><p>Your experience and qualifications align well with our current requirements, and we would like to learn more about your skills and professional background.</p><p>Our recruitment team will contact you shortly with details regarding the <b>interview schedule and next steps</b>.</p><p>In the meantime, if you have any questions or need further information, please feel free to reply to this email.</p><p>We appreciate your interest in joining <b>" + this.resumeDetails()?.campusName + "</b>, and we look forward to speaking with you soon.</p><p>Best regards,</p><p><b>Recruitment Team</b></p><p>" + this.resumeDetails()?.campusName + "</p>"
      }
    }
    else {
      model = {
        "toEmail": this.resumeDetails()?.candidateEmail,
        "subject": "Update on Your Application for " + this.resumeDetails()?.jobTitle,
        "body": "<p>Thank you for your interest in the <b>" + this.resumeDetails()?.jobTitle + "</b> position at <b>" + this.resumeDetails()?.campusName + "</b> and for taking the time to submit your application.</p><p>After carefully reviewing your resume and qualifications, we regret to inform you that your application has <b>not been selected for the current stage of the recruitment process</b>.</p><p>Please understand that this decision does not diminish your potential. Our evaluation identified areas where strengthening certain skills could significantly improve your alignment with similar roles in the future.</p><p>Based on our automated resume analysis, here are some <b>personalized improvement suggestions</b>:</p>" +
          "<ul>" +
          this.resumeDetails()?.aiSuggestions?.map(x => "<li>" + x + "</li>").join("") +
          "</ul>" +
          "<p>We encourage you to continue developing your skills and applying for future opportunities with us as they arise.</p><p>Thank you again for your interest in <b>" + this.resumeDetails()?.campusName + "</b>, and we wish you every success in your professional journey.</p><p>Kind regards,</p><p><b>Recruitment Team</b></p><p>" + this.resumeDetails()?.campusName + "</p>"
      }
    }

    this.http.post('https://localhost:7147/api/EmailAccount/SendEmail/', model).subscribe(
      {
        next: (res) => {
          this.toastr.success("Email Sent To Candidate.", 'Success', { closeButton: true });
        },
        error: (err) => {
          this.toastr.error("Error - " + err.error, 'Error', { closeButton: true });
        }
      }
    );
  }


}


export interface ResumeDetails {

  candidateName: string;
  candidateEmail: string;
  candidateMobile: string;
  jobTitle: string;
  campusName: string;
  resumeUsedUrl: string;
  applicationStatus: string;
  matchedScore: number;
  experience: string;
  skillsMatched: string[];
  missingSkills: string[];
  aiSuggestions: string[];
  analyzedOn: string;

}
