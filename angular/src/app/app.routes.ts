import { LoginComponent, SignupComponent } from '@/app/auth';
import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'login',
    component: LoginComponent,
  },
  {
    path: 'signup',
    component: SignupComponent,
  },
];
