import {Component, EventEmitter, Output} from '@angular/core';

@Component({
  selector: 'rules-area',
  templateUrl: './rules-area.component.html',
  styleUrls: ['./rules-area.component.scss']
})
export class RulesAreaComponent {
  @Output() dataArrived:EventEmitter<string[]> = new EventEmitter<string[]>();
  onDataArrived(data: any) {
    this.dataArrived.emit(data);
  }
}
