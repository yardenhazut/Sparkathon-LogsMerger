import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA} from "@angular/material/dialog";
import {SummaryItem} from "../model/SummaryItem";

@Component({
  selector: 'app-summary-dialog',
  templateUrl: './summary-dialog.component.html',
  styleUrls: ['./summary-dialog.component.scss']
})
export class SummaryDialogComponent implements OnInit{
  public items:SummaryItem [] = [];
  constructor(@Inject(MAT_DIALOG_DATA) public data: Map<string,SummaryItem>) { }

  ngOnInit(): void {
    for (let [key, value] of this.data) {
      this.items.push(value);
    }
  }
}
