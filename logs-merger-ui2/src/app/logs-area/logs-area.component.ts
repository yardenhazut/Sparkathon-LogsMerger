import {Component, EventEmitter, Input, Output} from '@angular/core';
import {DataItem} from "../model/DataItem";
import {ApiService} from "../services/api-service";
import { saveAs } from 'file-saver';
import {SaveDataItem} from "../model/SaveDataItem";
import _ from 'lodash';
import {DataService} from "../services/data-service";


@Component({
  selector: 'logs-area',
  templateUrl: './logs-area.component.html',
  styleUrls: ['./logs-area.component.scss']
})
export class LogsAreaComponent {
  private _data:DataItem[] = [];
  private _filters:any[] = [];
  private _excludes:any[] = [];
  public filteredData:DataItem[] = [];

  callsExpanded: boolean = false;

  public logGroupFilter:any[] = [];

  public logGroupsCount = 0;

  public callIds:string[] = [];

  public colors:string[] = [ "Blue", "Green", "Orange", "Purple", "Gray", "Brown", "Cyan", "Magenta", "Lime", "Maroon", "Navy", "Olive", "Teal", "Silver", "Gold", "Pink", "Indigo", "Coral", "Yellow"];

  constructor(private apiService: ApiService,private dataService:DataService) {
  }

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
  public get excludes() {
    return this._excludes;
  }

  public set excludes(newExcludes:any[]) {
    this._excludes = newExcludes;
    if(this._data) {
      this.processData();
    }
  }


  @Input()
  public get data() {
    return this._data;
  }

  public set data(newData:DataItem[]) {
    this._data = newData;
    this.processData();
  }

  private processData() {
    this.filteredData = [];
    if(!this._data) {
      return;
    }

    const rules = this.readRules();
    const excludes = this.readExcludes();
    const logGroups = this.readLogGroups();
    this.logGroupsCount = logGroups.length;

    if(this.logGroupsCount>1) {
      this.enhanceData(logGroups);
    }

    if(this.logGroupFilter.length!=this.logGroupsCount){
      this.createLogFilter(logGroups);
    }

    const rulesRegExs = rules.map(item=>new RegExp((item).value));
    const excludesRegExs = excludes.map(item=>new RegExp((item).value));

    const tempData1:DataItem[] = [];
    const callIdsSet = new Set();
    const selectedLogFilters = this.logGroupFilter.filter(item=>item.selected);
    this.callIds = [];
    for(const line of this._data) {
      const callIdIdx = line.message.indexOf("Call-ID:");
      if(callIdIdx>0){
          const endCallIdIdx = line.message.indexOf("@",callIdIdx);
          const callId = line.message.substring(callIdIdx+9,endCallIdIdx);
          if(!callIdsSet.has(callId)){
            callIdsSet.add(callId);
            this.callIds.push(callId);
          }
      }

      if(this.logGroupsCount<2){
        tempData1.push(line);
      }else {
        for (const grpFilter of selectedLogFilters) {
          if (grpFilter.label == line.logGroupLabel) {
            tempData1.push(line);
            break;
          }
        }
      }
    }

    const tempData2:DataItem[] = [];
     // includes
    for(const line of tempData1) {
      for(const element of rulesRegExs) {
        const rule: RegExp = element;
        if(rule.test(line.message)){
          tempData2.push(line);
          break;
        }
      }
    }
    const toExclude:DataItem[] = [];
    for(const line of tempData2) {
      for(const element of excludesRegExs) {
        const rule: RegExp = element;
        if(rule.test(line.message)){
          toExclude.push(line);
          break;
        }
      }
    }
    const result = tempData2.filter(item => !toExclude.includes(item));
    this.filteredData = result;
    this.dataService.filteredData = result;

    setTimeout(this.startFormatting,1000);
  }
  private startFormatting = () => {
    if(!this.filteredData){
      return;
    }
    this.filteredData.forEach(line=>{
      this.formatLine(line);
    })
  }

  private formatLine(line:DataItem) {
    let msg = line.message.replaceAll("<","&lt;").replaceAll(">","&gt;");
    msg = msg.replaceAll("\r\n","<br>").replaceAll("\n","<br>");

    let callIdIdx = 0;
    for(const callId of this.callIds) {

      const idx = msg.indexOf(callId);
      if(idx>=0){
        const color = this.colors[callIdIdx];
        msg = msg.replaceAll(callId,"<label style='color:"+color+"' id='"+callId+"'>"+callId+"</label>");
      }
      callIdIdx++;
      callIdIdx = callIdIdx % this.colors.length;
    }
    line.formatted = msg;
  }

  private read(key:string){
    const ret = localStorage.getItem(key);
    let retArr:any[] = [];
    if(ret) {
      retArr = JSON.parse(ret);
    }
    return retArr.filter(item=>item.selected);
  }

  private readLogGroups():any[] {
    return this.read("LogGroupLabels");
  }
  private readRules():any[] {
    return this.read("FilterLabels");
  }

  private readExcludes():any[] {
    return this.read("ExcludeLabels");
  }

  onSave() {
    const copiedData:any[] = _.cloneDeep(this.filteredData);
    copiedData.forEach(item=>item.message = item.message.replaceAll("<br>", "\n\n"));

    const saveDataItem:SaveDataItem = {
      "logRows": copiedData,
      "desiredFormat": "PDF",
      "query": "aaa"
    };
    this.apiService.postSave(saveDataItem).subscribe(
      response => {
        // Convert the Blob to a MIME type
        const fileBlob = new Blob([response], { type: 'application/pdf' });
        saveAs(fileBlob, 'downloaded_file.pdf');
      },
      error => {
        console.error('Error:', error);
      }
    );
  }
  private enhanceData(logGroups: any[]) {
    const logGroupsMap:any = {};
    const logGroupsColorMap:any = {};

    const colors = ["aquamarine","chartreuse","fuchsia","violet","yellow","orange"];
    for (const grp of logGroups) {
      logGroupsMap[grp.value] = grp.key;
    }

    let idx = 0;
    for (const property in logGroupsMap) {
      logGroupsColorMap[property] = colors[idx];
      idx++;
      idx = idx % colors.length;
    }

    for (const line of this._data) {
      line.logGroupLabel = logGroupsMap[line.logGroup];
      line.logGroupBGColor = logGroupsColorMap[line.logGroup];
    }
  }

  private createLogFilter(logGroups:any[]) {
    this.logGroupFilter = [];
    for(const grp of logGroups) {
      this.logGroupFilter.push({
        label: grp.key,
        selected:true
      });
    }
  }

  onClickFilter(grp:any) {
    grp.selected = !grp.selected;
    this.processData();
  }

  getLine(line:DataItem) {
    if (line.formatted) {
      return line.formatted;
    }
    return line.message;
  }
}
