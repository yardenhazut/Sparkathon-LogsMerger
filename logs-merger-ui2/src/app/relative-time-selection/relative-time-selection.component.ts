import {Component, EventEmitter, Input, Output} from '@angular/core';

@Component({
  selector: 'app-relative-time-selection',
  templateUrl: './relative-time-selection.component.html',
  styleUrls: ['./relative-time-selection.component.scss']
})
export class RelativeTimeSelectionComponent {

  timeType:number = 0;

  @Output()
  relativeTermChange:EventEmitter<number> = new EventEmitter<number>();

  @Input()
  relativeTerm: number = 72;
  onFocusOut() {
    localStorage.setItem("relativeKey", this.relativeTerm.toString());
  }

  setTime(value: number) {
    this.relativeTerm = value;
    this.onFocusOut();
    this.relativeTermChange.emit(this.relativeTerm);
  }
}
