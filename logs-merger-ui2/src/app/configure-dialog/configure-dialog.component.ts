import {Component, OnInit} from '@angular/core';

@Component({
  selector: 'app-configure-dialog',
  templateUrl: './configure-dialog.component.html',
  styleUrls: ['./configure-dialog.component.scss']
})
export class ConfigureDialogComponent implements OnInit {

  public labelsList:any[] = [];
  ngOnInit(): void {

      const ret = localStorage.getItem("LogGroupLabels");
      if(ret) {
        this.labelsList = JSON.parse(ret);
      }
      this.labelsList.push({selected:true});
  }

  save() {
    const clearList = this.labelsList.filter(item=>item.key);
    localStorage.setItem("LogGroupLabels",JSON.stringify(clearList));
  }

  delete(label1:any) {
    const idx = this.labelsList.indexOf(label1);
    this.labelsList.splice(idx,1);
  }
}
