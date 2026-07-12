import { DatePipe, DecimalPipe, JsonPipe, NgClass } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit, computed, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { FormsModule } from '@angular/forms';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-resume-analysis',
  imports: [DatePipe, NgClass, FormsModule],
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
  loading = signal(true);
  ApplyJobId: number = 0;

  emailModalTitle = '';
  emailSubject = '';
  emailBody = '';
  selectedStatus = '';


  // Custom Methods
  displayScore = computed(() => {
    const d = this.resumeDetails();
    if (!d?.analysisSuccess) {
      return null;
    }
    const score = d.scoring?.finalScore ?? d.matchedScore;
    return Math.max(0, Math.min(100, score));
  });

  scoring = computed(() => this.resumeDetails()?.scoring ?? null);

  fitLabel = computed(() => {
    const score = this.displayScore();
    if (score === null) {
      return 'Analysis unavailable';
    }
    if (score >= 75) {
      return 'Strong fit';
    }
    if (score >= 60) {
      return 'Good fit';
    }
    if (score >= 40) {
      return 'Partial fit';
    }
    return 'Weak fit';
  });

  scoreBadgeClass = computed(() => {
    const score = this.displayScore();
    if (score === null) {
      return 'score-neutral';
    }
    if (score >= 75) {
      return 'score-strong';
    }
    if (score >= 60) {
      return 'score-good';
    }
    if (score >= 40) {
      return 'score-partial';
    }
    return 'score-weak';
  });

  statusBadgeClass = computed(() => {
    const status = this.resumeDetails()?.applicationStatus;
    if (status === 'Shortlisted') {
      return 'bg-label-success';
    }
    if (status === 'Rejected') {
      return 'bg-label-danger';
    }
    return 'bg-label-warning';
  });

  resumeLink = computed(() => {
    const url = this.resumeDetails()?.resumeUsedUrl;
    if (!url) {
      return null;
    }
    return `${environment.apiUrl}${url.startsWith('/') ? '' : '/'}${url}`;
  });


  // API Methods
  GetResumeAnalysis(id: number): void {
    this.loading.set(true);
    this.ApplyJobId = id;
    this.http.get<ResumeDetails>(`${environment.apiUrl}/ResumeAnalysis/GetResumeAnalysis/${this.ApplyJobId}`).subscribe(
      {
        next: (res) => {
          this.resumeDetails.set(res);
          this.loading.set(false);
        },
        error: (err) => {
          this.loading.set(false);
          const msg = err.error?.message ?? err.error ?? 'Failed to load resume analysis';
          this.toastr.error('Error - ' + msg, 'Error', { closeButton: true });
        }
      }
    );
  }

  OpenEmailModal(status: string): void {

    this.selectedStatus = status;

    if (status === "Shortlisted") {

      this.emailModalTitle = "Send Shortlisting Email";

      this.emailSubject =
        `Application Shortlisted – ${this.resumeDetails()?.jobTitle}`;

      this.emailBody =
        `Dear ${this.resumeDetails()?.candidateName},

Thank you for your interest in joining ${this.resumeDetails()?.campusName} and for taking the time to apply for the position of ${this.resumeDetails()?.jobTitle}.

We are pleased to inform you that, after reviewing your application and qualifications, your profile has been shortlisted for the next stage of our recruitment process.

Your skills and experience demonstrate strong potential for this role, and we would like to learn more about your background during the upcoming interview process.

Our recruitment team will contact you shortly with details regarding the interview schedule, venue or meeting link, and any additional instructions.

If you have any questions in the meantime, please feel free to reply to this email.

We appreciate your interest in ${this.resumeDetails()?.campusName} and look forward to speaking with you.

Kind regards,

Recruitment Team - ZAB Careers
${this.resumeDetails()?.campusName}`;

    }
    else {

      this.emailModalTitle = "Send Rejection Email";

      const suggestions =
        this.resumeDetails()?.modelAnalysis?.suggestions
          ?.map(x => `• ${x}`)
          .join('\n') ?? '';

      this.emailSubject =
        `Application Update – ${this.resumeDetails()?.jobTitle}`;

      this.emailBody =
        `Dear ${this.resumeDetails()?.candidateName},

Thank you for your interest in the ${this.resumeDetails()?.jobTitle} position at ${this.resumeDetails()?.campusName}.

We sincerely appreciate the time and effort you invested in preparing and submitting your application.

After carefully reviewing your resume and qualifications, we regret to inform you that we will not be progressing your application to the next stage of the recruitment process.

This decision was based on the current requirements of the position and should not be considered a reflection of your overall abilities or future potential.

To help strengthen future applications, our AI-assisted resume analysis identified the following areas that may be worth improving:

${suggestions}

We encourage you to continue developing your skills and to apply for future opportunities that align with your experience and career goals.

Thank you once again for considering ${this.resumeDetails()?.campusName} as a potential employer. We wish you every success in your professional journey.

Kind regards,

Recruitment Team - ZAB Careers
${this.resumeDetails()?.campusName}`;

    }

  }

  SendEmail(): void {

    const model = {

      toEmail: this.resumeDetails()?.candidateEmail,

      subject: this.emailSubject,

      body: this.emailBody.replace(/\n/g, "<br>")

    };

    this.http.post(`${environment.apiUrl}/EmailAccount/SendEmail`, model).subscribe({
      next: () => {

        // Hide Modal Programmatically
        const modalEl = document.getElementById('emailModal');

        if (modalEl) {

          const modal = (window as any).bootstrap.Modal.getInstance(modalEl);

          modal?.hide();

        }

        this.ChangeApplicationStatus(this.selectedStatus);

        this.toastr.success("Email Sent Successfully", "Success", { closeButton: true }
        );
      },

      error: err => {
        this.toastr.error("Error - " + err.error, "Error", { closeButton: true }
        );
      }

    });

  }

  ChangeApplicationStatus(status: string): void {
    this.http.put(`${environment.apiUrl}/AppliedJob/ChangeApplicationStatus/${this.ApplyJobId}/${status}`, {}).subscribe(
      {
        next: (res) => {
          this.GetResumeAnalysis(this.ApplyJobId);
          this.toastr.success("Application Status Updated.", 'Success', { closeButton: true });
        },
        error: (err) => {
          this.toastr.error("Error - " + err.error, 'Error', { closeButton: true });
        }
      }
    );
  }

}


export interface ResumeDetails {
  appliedJobId: number;
  candidateName: string;
  candidateEmail: string;
  candidateMobile: string;
  jobTitle: string;
  campusName: string;
  resumeUsedUrl: string;
  resumeFileType?: string;
  applicationStatus: string;
  matchedScore: number;
  analysisSuccess: boolean;
  analysisStatus: string;
  errorMessage?: string;
  experience: string;
  keySkills: string;
  requiredSkills: string;
  skillsMatched: string[];
  missingSkills: string[];
  aiSuggestions: string[];
  analyzedOn: string;
  resumeHash?: string;
  scoring?: MatchScoringBreakdown;
  modelAnalysis?: ModelAnalysis;
}

export interface MatchScoringBreakdown {
  skillsCoverageScore: number;
  experienceScore: number;
  qualificationsScore: number;
  domainScore: number;
  skillsWeightPercent: number;
  experienceWeightPercent: number;
  qualificationsWeightPercent: number;
  domainWeightPercent: number;
  matchedCount: number;
  missingCount: number;
  finalScore: number;
  formulaSummary: string;
}

export interface ModelAnalysis {
  success: boolean;
  errorMessage?: string;
  matchPercentage: number;
  experience: string;
  matchedSkills: string[];
  missingSkills: string[];
  suggestions: string[];
}
