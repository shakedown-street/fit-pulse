import { AuthService } from '@/app/auth';
import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-nav',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './nav.component.html',
  styleUrl: './nav.component.scss',
})
export class NavComponent {
  constructor(
    public auth: AuthService,
    private router: Router,
  ) {}

  public logout() {
    this.auth.logout().subscribe({
      next: () => {
        this.auth.user.set(undefined);
        this.router.navigate(['/login']);
      },
      error: (error) => {
        console.error(error);
      },
    });
  }
}
