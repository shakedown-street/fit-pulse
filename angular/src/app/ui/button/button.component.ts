import { Component, HostBinding, Input } from '@angular/core';

export type ButtonColor =
  | 'primary'
  | 'gray'
  | 'red'
  | 'pink'
  | 'grape'
  | 'violet'
  | 'indigo'
  | 'blue'
  | 'cyan'
  | 'teal'
  | 'green'
  | 'lime'
  | 'yellow'
  | 'orange';
export type ButtonSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';
export type ButtonVariant = 'default' | 'outlined' | 'ghost' | 'raised';

@Component({
  selector: '[pwButton]',
  standalone: true,
  imports: [],
  templateUrl: './button.component.html',
  styleUrl: './button.component.scss',
})
export class ButtonComponent {
  @Input() color: ButtonColor = 'gray';
  @Input() fluid: boolean = false;
  @Input() rounded: boolean = false;
  @Input() size: ButtonSize = 'md';
  @Input() variant: ButtonVariant = 'default';

  @HostBinding('class')
  get classes(): string {
    return [
      'pw-button',
      this.fluid ? 'fluid' : '',
      this.rounded ? 'rounded' : '',
      `${this.color}`,
      `${this.size}`,
      `${this.variant}`,
    ].join(' ');
  }
}
