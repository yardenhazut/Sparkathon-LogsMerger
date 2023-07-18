import {Component, EventEmitter, Output} from '@angular/core';

@Component({
  selector: 'rules-area',
  templateUrl: './rules-area.component.html',
  styleUrls: ['./rules-area.component.scss']
})
export class RulesAreaComponent {
  @Output() dataArrived:EventEmitter<string[]> = new EventEmitter<string[]>();
  @Output() filterChanged:EventEmitter<any[]> = new EventEmitter<any[]>();
  onDataArrived(data: any) {
    this.dataArrived.emit(data);
  }

  onFilterChanged($event: any[]) {
    this.filterChanged.emit($event);
  }
}
