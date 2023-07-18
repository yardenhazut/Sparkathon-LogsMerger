import {Component, OnInit} from '@angular/core';

@Component({
  selector: 'app-filters-dialog',
  templateUrl: './filters-dialog.component.html',
  styleUrls: ['./filters-dialog.component.scss']
})
export class FiltersDialogComponent implements OnInit{
  public labelsList:any[] = [];
  ngOnInit(): void {

    const ret = localStorage.getItem("FilterLabels");
    if(ret) {
      this.labelsList = JSON.parse(ret);
    }
    this.labelsList.push({selected:true});
  }

  save() {
    const clearList = this.labelsList.filter(item=>item.key);
    localStorage.setItem("FilterLabels",JSON.stringify(clearList));
  }

  delete(label1:any) {
    const idx = this.labelsList.indexOf(label1);
    this.labelsList.splice(idx,1);
  }
}
