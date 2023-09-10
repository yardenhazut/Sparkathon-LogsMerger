import { Component } from '@angular/core';
import {HistoryItem} from "../model/HistoryItem";
import {MatDialogRef} from "@angular/material/dialog";

@Component({
  selector: 'app-history-dialog',
  templateUrl: './history-dialog.component.html',
  styleUrls: ['./history-dialog.component.scss']
})
export class HistoryDialogComponent {

  historySearch:HistoryItem[]= [];

  constructor(private dialogRef: MatDialogRef<HistoryDialogComponent>) {
    const ret = localStorage.getItem("SearchItems");
    if (ret) {
      this.historySearch = JSON.parse(ret);
    }
  }

  save() {
  }

  delete(item:HistoryItem) {
    const idx = this.historySearch.indexOf(item);
    this.historySearch.splice(idx,1);
    localStorage.setItem("SearchItems",JSON.stringify(this.historySearch));
  }
  apply(item:HistoryItem) {
    this.dialogRef.close(item);
  }
}
