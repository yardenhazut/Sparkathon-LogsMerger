import {Component, EventEmitter, Input, Output} from '@angular/core';

@Component({
  selector: 'logs-area',
  templateUrl: './logs-area.component.html',
  styleUrls: ['./logs-area.component.scss']
})
export class LogsAreaComponent {
  @Input() data:string[] = [];
}
