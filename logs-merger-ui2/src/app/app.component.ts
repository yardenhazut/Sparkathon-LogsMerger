import { Component } from '@angular/core';
import {DataItem} from "./model/DataItem";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'logs-merger-ui';
  data:DataItem[] = [];
  filters:any[] = [];
  excludes:any[] = [];
  onDataArrived(data: DataItem[]) {
    this.data = data;
  }

  onFilterChanged(filters: any[]) {
    this.filters = filters;
  }


  onExcludeChanged(excludes: any[]) {
    this.excludes = excludes;
  }

}
