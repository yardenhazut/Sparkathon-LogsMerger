import {Component, OnInit} from '@angular/core';

@Component({
  selector: 'app-colors-dialog',
  templateUrl: './colors-dialog.component.html',
  styleUrls: ['./colors-dialog.component.scss']
})
export class ColorsDialogComponent  implements OnInit {
  public labelsList: any[] = [];

  ngOnInit(): void {

    const ret = localStorage.getItem("ColorsLabels");
    if (ret) {
      this.labelsList = JSON.parse(ret);
    }
    this.labelsList.push({selected: true});
  }

  save() {
    const clearList = this.labelsList.filter(item => item.key);
    localStorage.setItem("ColorsLabels", JSON.stringify(clearList));
  }

  delete(label1: any) {
    const idx = this.labelsList.indexOf(label1);
    this.labelsList.splice(idx, 1);
  }
}
