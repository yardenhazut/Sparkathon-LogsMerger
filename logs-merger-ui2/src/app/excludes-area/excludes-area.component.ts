import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {MatDialog} from "@angular/material/dialog";
import {FiltersDialogComponent} from "../filters-dialog/filters-dialog.component";
import {ExcludesDialogComponent} from "../excludes-dialog/excludes-dialog.component";

@Component({
  selector: 'app-excludes-area',
  templateUrl: './excludes-area.component.html',
  styleUrls: ['./excludes-area.component.scss']
})
export class ExcludesAreaComponent implements OnInit{
  @Output() excludesChanged:EventEmitter<any[]> = new EventEmitter<any[]>();

  public labelsList:any[] = [];
  constructor(public dialog: MatDialog) {}

  onConfigure() {
    this.dialog.open(ExcludesDialogComponent).afterClosed().subscribe(()=>{
      this.readStorage();
      this.onSelectionChanged();
    });
  }

  ngOnInit(): void {
    this.readStorage();
  }

  private readStorage() {
    const ret = localStorage.getItem("ExcludeLabels");
    if(ret) {
      this.labelsList = JSON.parse(ret);
    }
  }

  onSelectionChanged() {
    const clearList = this.labelsList.filter(item=>item.key);
    localStorage.setItem("ExcludeLabels",JSON.stringify(clearList));

    this.excludesChanged.emit(clearList);
  }
}
