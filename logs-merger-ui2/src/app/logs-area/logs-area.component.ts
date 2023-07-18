import {Component, EventEmitter, Input, Output} from '@angular/core';

@Component({
  selector: 'logs-area',
  templateUrl: './logs-area.component.html',
  styleUrls: ['./logs-area.component.scss']
})
export class LogsAreaComponent {
  private _data:string[] = [];
  private _filters:any[] = [];
  public filteredData:string[] = [];


  @Input()
  public get filters() {
    return this._filters;
  }

  public set filters(newFilters:any[]) {
    this._filters = newFilters;
    if(this._data) {
      this.processData();
    }
  }

  @Input()
  public get data() {
    return this._data;
  }

  public set data(newData:string[]) {
    this._data = newData;
    this.processData();
  }

  private processData() {
    this.filteredData = [];
    const rules = this.readRules();
    const rulesRegExs = rules.map(item=>new RegExp((item).value));

    for(const element of this._data) {
      const line = element;
      for(const element of rulesRegExs) {
        const rule: RegExp = element;
        if(rule.test(line)){
          this.filteredData.push(line);
          break;
        }
      }
    }
  }

  private readRules():any[] {
    const ret = localStorage.getItem("FilterLabels");
    let retArr:any[] = [];
    if(ret) {
      retArr = JSON.parse(ret);
    }
    return retArr.filter(item=>item.selected);
  }
}
