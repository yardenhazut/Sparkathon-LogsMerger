import { Component } from '@angular/core';
import {DataItem} from "./model/DataItem";
import {ApiService} from "./services/api-service";
import {AIService} from "./services/AI-service";

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

  constructor(private aiService: AIService) {

  }

    onDataArrived(data: DataItem[]) {
    this.data = data;
  }

  onFilterChanged(filters: any[]) {
    this.filters = filters;
  }


  onExcludeChanged(excludes: any[]) {
    this.excludes = excludes;
  }

  openAI() {
    this.aiService.callAI();
  }
}
