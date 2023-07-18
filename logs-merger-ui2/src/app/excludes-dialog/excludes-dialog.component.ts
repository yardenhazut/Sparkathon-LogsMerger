import {Component, OnInit} from '@angular/core';

@Component({
  selector: 'app-excludes-dialog',
  templateUrl: './excludes-dialog.component.html',
  styleUrls: ['./excludes-dialog.component.scss']
})
export class ExcludesDialogComponent implements OnInit {
  public labelsList: any[] = [];

  ngOnInit(): void {

    const ret = localStorage.getItem("ExcludeLabels");
    if (ret) {
      this.labelsList = JSON.parse(ret);
    }
    this.labelsList.push({selected: true});
  }

  save() {
    const clearList = this.labelsList.filter(item => item.key);
    localStorage.setItem("ExcludeLabels", JSON.stringify(clearList));
  }

  delete(label1: any) {
    const idx = this.labelsList.indexOf(label1);
    this.labelsList.splice(idx, 1);
  }
}
