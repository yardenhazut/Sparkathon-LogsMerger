import {Component, OnInit} from '@angular/core';
import {MatDialog} from "@angular/material/dialog";
import {ConfigureDialogComponent} from "../configure-dialog/configure-dialog.component";

@Component({
  selector: 'app-logs-group-selection',
  templateUrl: './logs-group-selection.component.html',
  styleUrls: ['./logs-group-selection.component.scss']
})
export class LogsGroupSelectionComponent implements OnInit {
  public labelsList:any[] = [];
  constructor(public dialog: MatDialog) {}
  onConfigure() {
    this.dialog.open(ConfigureDialogComponent).afterClosed().subscribe(()=>{
      this.readStorage();
    });
  }

  ngOnInit(): void {
    this.readStorage();
  }

  private readStorage() {
    const ret = localStorage.getItem("LogGroupLabels");
    if(ret) {
      this.labelsList = JSON.parse(ret);
    }
  }

  onSelectionChanged() {
    const clearList = this.labelsList.filter(item=>item.key);
    localStorage.setItem("LogGroupLabels",JSON.stringify(clearList));
  }
}
