import {Component, EventEmitter, Output} from '@angular/core';
import {MatDialog} from "@angular/material/dialog";
import {ExcludesDialogComponent} from "../excludes-dialog/excludes-dialog.component";
import {ColorsDialogComponent} from "../colors-dialog/colors-dialog.component";

@Component({
  selector: 'app-colors-area',
  templateUrl: './colors-area.component.html',
  styleUrls: ['./colors-area.component.scss']
})
export class ColorsAreaComponent {
  @Output() colorsChanged:EventEmitter<any[]> = new EventEmitter<any[]>();

  public labelsList:any[] = [];
  constructor(public dialog: MatDialog) {}

  onConfigure() {
    this.dialog.open(ColorsDialogComponent).afterClosed().subscribe(()=>{
      this.readStorage();
      this.onSelectionChanged();
    });
  }

  ngOnInit(): void {
    this.readStorage();
  }

  private readStorage() {
    const ret = localStorage.getItem("ColorsLabels");
    if(ret) {
      this.labelsList = JSON.parse(ret);
    }
  }

  onSelectionChanged() {
    const clearList = this.labelsList.filter(item=>item.key);
    localStorage.setItem("ColorsLabels",JSON.stringify(clearList));

    this.colorsChanged.emit(clearList);
  }
}
