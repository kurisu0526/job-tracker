import { Routes } from '@angular/router';
import { LandingComponent } from './components/landing/landing';
import { LoginComponent } from './components/auth/login/login';
import { SignupComponent } from './components/auth/signup/signup';
import { DashboardLayoutComponent } from './components/dashboard/dashboard-layout/dashboard-layout';
import { JobsListComponent } from './components/dashboard/jobs-list/jobs-list';
import { JobDetailComponent } from './components/dashboard/job-detail/job-detail';
import { AddJobComponent } from './components/dashboard/add-job/add-job';
import { EditJobComponent } from './components/dashboard/edit-job/edit-job';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  { path: '', component: LandingComponent },
  {
    path: 'auth',
    children: [
      { path: 'login', component: LoginComponent },
      { path: 'signup', component: SignupComponent },
      { path: '', redirectTo: 'login', pathMatch: 'full' },
    ],
  },
  {
    path: 'dashboard',
    component: DashboardLayoutComponent,
    canActivate: [authGuard],
    children: [
      { path: '', redirectTo: 'jobs', pathMatch: 'full' },
      { path: 'jobs', component: JobsListComponent },
      { path: 'jobs/add', component: AddJobComponent },
      { path: 'jobs/:id/edit', component: EditJobComponent },
      { path: 'jobs/:id', component: JobDetailComponent },
    ],
  },
  { path: '**', redirectTo: '' },
];

