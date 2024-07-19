import { User } from '@/app/types';
import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

export type UserAvatarSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

@Component({
  selector: 'app-user-avatar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './user-avatar.component.html',
  styleUrl: './user-avatar.component.scss',
})
export class UserAvatarComponent {
  @Input()
  public user: User | undefined = undefined;

  @Input()
  public size: UserAvatarSize = 'md';

  constructor() {}

  public getInitials() {
    if (!this.user) {
      return '';
    }
    const name = this.user.full_name ? this.user.full_name : this.user.username;
    return name
      .split(' ')
      .map((n) => n[0])
      .join('');
  }
}
