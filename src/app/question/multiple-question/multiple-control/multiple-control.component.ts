import { Component, OnInit, Input, forwardRef, HostBinding, HostListener } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { Answer } from '../../../shared/models/campaign.model';
import { BaseComponent } from '../../../utils/base/base.component';

@Component({
  selector: 'app-multiple-control',
  templateUrl: './multiple-control.component.html',
  styles: [
    `:host{
      width: 16%;
      padding: 8% 3% 8% 3%;
      text-align: center;
      background: url('assets/images/multiple-bg.png');
      background-position: center;
      background-size: contain;
      background-repeat: no-repeat;
  }
  `
  ],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => MultipleControlComponent),
      multi: true
    }
  ]
})
export class MultipleControlComponent extends BaseComponent implements ControlValueAccessor, OnInit {
  @Input('answer') answer: Answer;
  onChangeCallback = (data) => { };
  @HostBinding('class.clicked-button') selected: boolean = false;
  @HostBinding('class.answer-item') sd: boolean = true;
  constructor() { super() }

  ngOnInit() {
    console.log('changed', this.i18n)
  }

  writeValue(obj: any): void {
  }

  registerOnChange(fn: any): void {
    this.onChangeCallback = fn;
  }

  registerOnTouched(fn: any): void {
  }

  setDisabledState?(isDisabled: boolean): void {
  }
  @HostListener('click')
  onSelect() {
    this.selected = !this.selected;
    if (this.selected) {
      this.onChangeCallback(this.answer);
    } else {
      this.onChangeCallback(null);
    }
  }

}
