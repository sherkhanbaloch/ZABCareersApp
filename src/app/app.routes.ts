import { Routes } from '@angular/router';
import { Dashboard } from './Admin/dashboard/dashboard';
import { AdminLayout } from './Admin/admin-layout/admin-layout';
import { AdminLogin } from './Admin/admin-login/admin-login';
import { Campuses } from './Admin/campuses/campuses';
import { Departments } from './Admin/departments/departments';
import { AllJobs } from './Admin/all-jobs/all-jobs';
import { PortalUsers } from './Admin/portal-users/portal-users';
import { Roles } from './Admin/roles/roles';
import { UpdateJob } from './Admin/update-job/update-job';
import { AddNewJob } from './Admin/add-new-job/add-new-job';
import { UserLayout } from './User/user-layout/user-layout';
import { Home } from './User/home/home';
import { About } from './User/about/about';
import { Contact } from './User/contact/contact';
import { JobDetails } from './User/job-details/job-details';
import { JobListing } from './User/job-listing/job-listing';
import { UsersMessages } from './Admin/users-messages/users-messages';
import { RegisterUser } from './User/register-user/register-user';
import { UserLogin } from './User/user-login/user-login';
import { UserProfile } from './User/user-profile/user-profile';
import { JobUsers } from './Admin/job-users/job-users';
import { JobApplications } from './Admin/job-applications/job-applications';
import { JobApplicationDetails } from './Admin/job-application-details/job-application-details';
import { ResumeAnalysis } from './Admin/resume-analysis/resume-analysis';
import { EmailAccounts } from './Admin/email-accounts/email-accounts';
import { UserEmailVerify } from './User/user-email-verify/user-email-verify';
import { authGuard } from './services/auth-guard';
import { Error404 } from './Admin/error404/error404';
import { UserAppliedJobs } from './User/user-applied-jobs/user-applied-jobs';

export const routes: Routes = [

    // Default Route (User Side)
    { path: '', redirectTo: 'user/home', pathMatch: 'full' },

    // User Routes
    {
        path: 'user', component: UserLayout, children: [
            { path: '', redirectTo: 'home', pathMatch: 'full' },
            { path: 'home', component: Home, title: 'Home - ZAB Careers' },
            { path: 'about', component: About, title: 'About - ZAB Careers' },
            { path: 'contact', component: Contact, title: 'Contact - ZAB Careers' },
            { path: 'job-details/:jobId', component: JobDetails, title: 'Job Details - ZAB Careers' },
            { path: 'job-listing', component: JobListing, title: 'Job Listing - ZAB Careers' },
            { path: 'register-user', component: RegisterUser, title: 'Register User - ZAB Careers' },
            { path: 'user-login', component: UserLogin, title: 'User Login - ZAB Careers' },
            { path: 'profile', component: UserProfile, title: 'User Profile - ZAB Careers', canActivate: [authGuard] },
            { path: 'applied-jobs', component: UserAppliedJobs, title: 'Applied Jobs - ZAB Careers', canActivate: [authGuard] },
            { path: 'user-email-verify', component: UserEmailVerify, title: 'User Email Verification - ZAB Careers' },
        ]
    },

    // Admin  Routes
    { path: 'admin/login', component: AdminLogin, title: 'Admin Login - ZAB Careers' },

    {
        path: 'admin', component: AdminLayout, canActivate: [authGuard], data: { role: 'Admin' }, children: [
            { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
            { path: 'dashboard', component: Dashboard, title: 'Dashboard - ZAB Careers', canActivate: [authGuard], data: { role: 'Admin' } },
            { path: 'job-applications', component: JobApplications, title: 'Job Applications - ZAB Careers', canActivate: [authGuard], data: { role: 'Admin' } },
            { path: 'job-application-details/:jobId', component: JobApplicationDetails, title: 'Job Application Details - ZAB Careers', canActivate: [authGuard], data: { role: 'Admin' } },
            { path: 'all-jobs', component: AllJobs, title: 'All Jobs - ZAB Careers', canActivate: [authGuard], data: { role: 'Admin' } },
            { path: 'campuses', component: Campuses, title: 'Campuses - ZAB Careers', canActivate: [authGuard], data: { role: 'Admin' } },
            { path: 'departments', component: Departments, title: 'Departments - ZAB Careers', canActivate: [authGuard], data: { role: 'Admin' } },
            { path: 'job-users', component: JobUsers, title: 'Job Users - ZAB Careers', canActivate: [authGuard], data: { role: 'Admin' } },
            { path: 'portal-users', component: PortalUsers, title: 'Portal Users - ZAB Careers', canActivate: [authGuard], data: { role: 'Admin' } },
            { path: 'add-new-job', component: AddNewJob, title: 'Add New Job - ZAB Careers', canActivate: [authGuard], data: { role: 'Admin' } },
            { path: 'resume-analysis/:appliedJobId', component: ResumeAnalysis, title: 'Resume Analysis - ZAB Careers', canActivate: [authGuard], data: { role: 'Admin' } },
            { path: 'roles', component: Roles, title: 'Roles - ZAB Careers', canActivate: [authGuard], data: { role: 'Admin' } },
            { path: 'update-job/:jobId', component: UpdateJob, title: 'Update Job - ZAB Careers', canActivate: [authGuard], data: { role: 'Admin' } },
            { path: 'users-messages', component: UsersMessages, title: 'Users Message - ZAB Careers', canActivate: [authGuard], data: { role: 'Admin' } },
            { path: 'email-accounts', component: EmailAccounts, title: 'Email Accounts - ZAB Careers', canActivate: [authGuard], data: { role: 'Admin' } }
        ]
    },

    // Wild Card Route
    { path: '**', component: Error404, title: 'Page Not Found - ZAB Careers' }

];
