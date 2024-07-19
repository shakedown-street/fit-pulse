import { AuthService } from '@/app/auth';
import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { PopoverComponent } from '../popover/popover.component';
import { UserAvatarComponent } from '@/app/auth/components/user-avatar/user-avatar.component';

@Component({
  selector: 'app-nav',
  standalone: true,
  imports: [PopoverComponent, RouterModule, UserAvatarComponent],
  templateUrl: './nav.component.html',
  styleUrl: './nav.component.scss',
})
export class NavComponent {
  public userMenuOpen = false;

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
