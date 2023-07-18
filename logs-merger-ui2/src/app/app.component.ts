import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'logs-merger-ui';
  data:string[] = [];
  filters:any[] = [];
  onDataArrived(data: string[]) {
    this.data = data;
  }

  onFilterChanged(filters: any[]) {
    this.filters = filters;
  }
}
