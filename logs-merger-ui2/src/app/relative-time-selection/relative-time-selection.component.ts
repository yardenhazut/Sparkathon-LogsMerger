import {Component, EventEmitter, Input, Output} from '@angular/core';

@Component({
  selector: 'app-relative-time-selection',
  templateUrl: './relative-time-selection.component.html',
  styleUrls: ['./relative-time-selection.component.scss']
})
export class RelativeTimeSelectionComponent {


  @Input()
  timeType: number = 0;

  @Output()
  timeTypeChange:EventEmitter<number> = new EventEmitter<number>();

  @Output()
  relativeTermChange:EventEmitter<number> = new EventEmitter<number>();

  @Input()
  relativeTerm: number = 24;

  timeInputClass:string = '';
  onFocusOut() {
    localStorage.setItem("RelativeKey", this.relativeTerm.toString());
    localStorage.setItem("RelativePeriodKey", this.timeType.toString());
  }

  setTime(value: number,tPeriod:number) {
    this.relativeTerm = value;
    this.relativeTermChange.emit(this.relativeTerm);

    this.timeType = tPeriod;
    this.timeTypeChange.emit(this.timeType);

    this.onFocusOut();

    this.timeInputClass = "glow";
    setTimeout(()=> {
      this.timeInputClass = '';
    },1000);
  }

  isSelectedTime(value: number, period: number) {
    if(value == this.relativeTerm && period==this.timeType) {
      return "selected";
    }
    return "";
  }
}
