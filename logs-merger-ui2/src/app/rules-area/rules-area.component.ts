import {Component, EventEmitter, Output} from '@angular/core';
import {DataItem} from "../model/DataItem";

@Component({
  selector: 'rules-area',
  templateUrl: './rules-area.component.html',
  styleUrls: ['./rules-area.component.scss']
})
export class RulesAreaComponent {
  @Output() dataArrived:EventEmitter<DataItem[]> = new EventEmitter<DataItem[]>();
  @Output() filterChanged:EventEmitter<any[]> = new EventEmitter<any[]>();

  @Output() searchClosed:EventEmitter<void> = new EventEmitter<void>();
  @Output() excludeChanged:EventEmitter<any[]> = new EventEmitter<any[]>();
  onDataArrived(data: DataItem[]) {
    this.dataArrived.emit(data);
  }

  onFilterChanged($event: any[]) {
    this.filterChanged.emit($event);
  }

  onExcludeChanged($event: any[]) {
    this.excludeChanged.emit($event);
  }

  closeSearch() {
    this.searchClosed.emit();
  }
}
