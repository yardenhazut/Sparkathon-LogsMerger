import { Component } from '@angular/core';
import {MatSnackBar} from "@angular/material/snack-bar";

@Component({
  selector: 'app-export-import-dialog',
  templateUrl: './export-import-dialog.component.html',
  styleUrls: ['./export-import-dialog.component.scss']
})
export class ExportImportDialogComponent {
  importText: string = "";

  constructor(private snackBar: MatSnackBar){}

  onExport() {
    const obj:any = {};
    obj["FilterLabels"] = localStorage.getItem("FilterLabels");
    obj["EnvPrefix"] = localStorage.getItem("EnvPrefix");
    obj["LogGroupLabels"] = localStorage.getItem("LogGroupLabels");
    obj["ColorsLabels"] = localStorage.getItem("ColorsLabels");
    obj["ExcludeLabels"] = localStorage.getItem("ExcludeLabels");
    obj["TimeFrom"] = localStorage.getItem("TimeFrom");
    obj["TimeTo"] = localStorage.getItem("TimeTo");
    obj["RelativeKey"] = localStorage.getItem("RelativeKey");
    obj["RelativePeriodKey"] = localStorage.getItem("RelativePeriodKey");
    obj["SearchItems"] = localStorage.getItem("SearchItems");
    obj["SelectedTimeFrame"] = localStorage.getItem("SelectedTimeFrame");
    let msg = JSON.stringify(obj);
    return msg;
  }

  onCopy() {
    this.snackBar.open("Copied To Clipboard!",'', {
      duration: 2000,
    });
  }

  onImport() {
    if(this.importText==""){
      return;
    }
    const obj:any = JSON.parse(this.importText);
    const labels:string [] = ["FilterLabels","EnvPrefix","LogGroupLabels","ColorsLabels",
      "ExcludeLabels","TimeFrom","TimeTo","RelativeKey","RelativePeriodKey","SearchItems","SelectedTimeFrame"];
    for(let label of labels){
      if(obj[label]) {
        localStorage.setItem(label,obj[label]);
      }
    }

    this.snackBar.open("Settings Imported",'', {
      duration: 2000,
    });
  }
}
