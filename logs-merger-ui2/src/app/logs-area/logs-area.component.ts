import {Component, EventEmitter, Input, Output} from '@angular/core';
import {DataItem} from "../model/DataItem";
import {ApiService} from "../services/api-service";
import { saveAs } from 'file-saver';
import {SaveDataItem} from "../model/SaveDataItem";
import _ from 'lodash';


@Component({
  selector: 'logs-area',
  templateUrl: './logs-area.component.html',
  styleUrls: ['./logs-area.component.scss']
})
export class LogsAreaComponent {
  private _data: DataItem[] = [];
  private _filters: any[] = [];
  private _excludes: any[] = [];
  public filteredData: DataItem[] = [];


  constructor(private apiService: ApiService) {
  }

  @Input()
  public get filters() {
    return this._filters;
  }

  public set filters(newFilters: any[]) {
    this._filters = newFilters;
    if (this._data) {
      this.processData();
    }
  }

  @Input()
  public get excludes() {
    return this._excludes;
  }

  public set excludes(newExcludes: any[]) {
    this._excludes = newExcludes;
    if (this._data) {
      this.processData();
    }
  }


  @Input()
  public get data() {
    return this._data;
  }

  public set data(newData: DataItem[]) {
    this._data = newData;
    this.processData();
  }

  private processData() {
    this.filteredData = [];
    if (!this._data) {
      return;
    }
    const rules = this.readRules();
    const excludes = this.readExcludes();
    const rulesRegExs = rules.map(item => new RegExp((item).value));
    const excludesRegExs = excludes.map(item => new RegExp((item).value));

    const tempData: DataItem[] = [];
    // includes
    for (const element of this._data) {
      const line = element;
      for (const element of rulesRegExs) {
        const rule: RegExp = element;
        if (rule.test(line.message)) {
          tempData.push(line);
          break;
        }
      }
    }
    const toExclude: DataItem[] = [];
    for (const element of tempData) {
      const line = element;
      for (const element of excludesRegExs) {
        const rule: RegExp = element;
        if (rule.test(line.message)) {
          toExclude.push(line);
          break;
        }
      }
    }
    const result = tempData.filter(item => !toExclude.includes(item));
    this.filteredData = result;
  }

  private read(key: string) {
    const ret = localStorage.getItem(key);
    let retArr: any[] = [];
    if (ret) {
      retArr = JSON.parse(ret);
    }
    return retArr.filter(item => item.selected);
  }

  private readRules(): any[] {
    return this.read("FilterLabels");
  }

  private readExcludes(): any[] {
    return this.read("ExcludeLabels");
  }

  onSave() {
    const copiedData = _.cloneDeep(this.filteredData);
    copiedData.forEach(item=>item.message = item.message.replaceAll("<br>", "\n\n"));

    const saveDataItem:SaveDataItem = {
      "logRows": copiedData,
      "desiredFormat": "PDF",
      "query": "aaa"
    };
    this.apiService.postSave(saveDataItem).subscribe(
      response => {

        console.log("lal")
        // Convert the Blob to a MIME type
        const fileBlob = new Blob([response], { type: 'application/pdf' });
        saveAs(fileBlob, 'downloaded_file.pdf');
      },
      error => {
        console.error('Error:', error);
      }
    );
  }
}
