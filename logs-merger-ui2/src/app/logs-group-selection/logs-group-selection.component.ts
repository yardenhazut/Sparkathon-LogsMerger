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
  public selectedEnvironment:any;
  environments = {
    dev: "dev-",
    test: 'test-',
    perf: 'perf-',
    staging: 'staging-',
  };
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
    const envRet = localStorage.getItem("EnvPrefix");
    if(envRet) {
      this.selectedEnvironment = JSON.parse(envRet);
    }
  }

  onSelectionChanged() {
    const clearList = this.labelsList.filter(item=>item.key);
    localStorage.setItem("LogGroupLabels",JSON.stringify(clearList));
  }

  onEnvironmentChanged() {
    localStorage.setItem("EnvPrefix",JSON.stringify(this.selectedEnvironment));
  }

  getEnvironmentKeys() {
    return Object.keys(this.environments);
  }
}
