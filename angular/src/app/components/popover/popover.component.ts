import { CommonModule } from '@angular/common';
import { Component, ContentChild, EventEmitter, Input, Output } from '@angular/core';

export type PopoverOptions = {
  relativeTop?: string;
  relativeLeft?: string;
  relativeRight?: string;
  relativeBottom?: string;
  width?: string;
  zIndex?: number;
};

@Component({
  selector: 'app-popover',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './popover.component.html',
  styleUrl: './popover.component.scss',
})
export class PopoverComponent {
  @ContentChild('trigger', { static: false })
  public triggerContent: any;

  @Input()
  public get options(): PopoverOptions {
    return this._options;
  }

  public set options(value: PopoverOptions) {
    this._options = { ...this.defaultOptions, ...value };
  }

  @Input()
  public get visible(): boolean {
    return this._visible;
  }

  public set visible(value: boolean) {
    this._visible = value;
    this.visibleChange.emit(value);
  }

  @Output()
  public visibleChange = new EventEmitter();

  private _options: PopoverOptions;
  private _visible = false;

  private defaultOptions: PopoverOptions = {
    width: 'auto',
    zIndex: 10,
  };

  constructor() {
    this._options = this.defaultOptions;
  }

  public close() {
    this.visible = false;
  }
}
