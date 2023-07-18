import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {MatDialog} from "@angular/material/dialog";
import {ConfigureDialogComponent} from "../configure-dialog/configure-dialog.component";
import {FiltersDialogComponent} from "../filters-dialog/filters-dialog.component";

@Component({
  selector: 'app-filters',
  templateUrl: './filters.component.html',
  styleUrls: ['./filters.component.scss']
})
export class FiltersComponent implements OnInit{
  @Output() filterChanged:EventEmitter<any[]> = new EventEmitter<any[]>();

  public labelsList:any[] = [];
  constructor(public dialog: MatDialog) {}
  onConfigure() {
    this.dialog.open(FiltersDialogComponent).afterClosed().subscribe(()=>{
      this.readStorage();
      this.onSelectionChanged();
    });
  }

  ngOnInit(): void {
    this.readStorage();
  }

  private readStorage() {
    const ret = localStorage.getItem("FilterLabels");
    if(ret) {
      this.labelsList = JSON.parse(ret);
    } else {
      this.labelsList.push({key:"ALL",value:".",selected:true});
      localStorage.setItem("FilterLabels",JSON.stringify(this.labelsList));
    }
  }

  onSelectionChanged() {
    const clearList = this.labelsList.filter(item=>item.key);
    localStorage.setItem("FilterLabels",JSON.stringify(clearList));

    this.filterChanged.emit(clearList);
  }
}
