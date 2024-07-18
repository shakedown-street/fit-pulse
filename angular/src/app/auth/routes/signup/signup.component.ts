import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService, SignupRequest } from '../../services/auth.service';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [ReactiveFormsModule, RouterModule],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.scss',
})
export class SignupComponent {
  public signupForm = new FormGroup({
    username: new FormControl('', [Validators.required]),
    email: new FormControl(''),
    password1: new FormControl('', [Validators.required]),
    password2: new FormControl('', [Validators.required]),
  });

  constructor(
    private auth: AuthService,
    private router: Router,
  ) {}

  public signup() {
    this.auth.signup(this.signupForm.value as SignupRequest).subscribe({
      next: (user) => {
        this.auth.user.set(user);
        this.router.navigate(['/']);
      },
      error: (error) => {
        console.error(error);
      },
    });
  }
}
