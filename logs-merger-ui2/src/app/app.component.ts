import { Component } from '@angular/core';
import {DataItem} from "./model/DataItem";
import {ApiService} from "./services/api-service";
import {AIService} from "./services/AI-service";
import {MatDialog} from "@angular/material/dialog";
import {ExcludesDialogComponent} from "./excludes-dialog/excludes-dialog.component";
import {AiDialogComponent} from "./ai-dialog/ai-dialog.component";

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
  searchOpen: boolean = true;

  constructor(public dialog: MatDialog) {

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
    this.dialog.open(AiDialogComponent,{
      height: '80%',
      width: '80%'
    }).afterClosed().subscribe(()=>{

    });

  }

  onSearchClosed() {
    this.searchOpen = false;
  }
}
