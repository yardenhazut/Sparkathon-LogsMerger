import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {DataItem} from "../model/DataItem";
import {ApiService} from "../services/api-service";
import { saveAs } from 'file-saver';
import {SaveDataItem} from "../model/SaveDataItem";
import _ from 'lodash';
import {DataService} from "../services/data-service";
import {MatSnackBar} from "@angular/material/snack-bar";
import {SummaryItem} from "../model/SummaryItem";
import {MatDialog} from "@angular/material/dialog";
import {FiltersDialogComponent} from "../filters-dialog/filters-dialog.component";
import {SummaryDialogComponent} from "../summary-dialog/summary-dialog.component";


@Component({
  selector: 'logs-area',
  templateUrl: './logs-area.component.html',
  styleUrls: ['./logs-area.component.scss']
})
export class LogsAreaComponent implements OnInit {
  private _data:DataItem[] = [];
  private _filters:any[] = [];
  private _excludes:any[] = [];
  private _colors:any[] = [];

  public filteredData:DataItem[] = [];

  public logGroupFilter:any[] = [];

  public logGroupsCount = 0;

  public callIds:string[] = [];
  public callIdToColor:any = {};

  public colorsSet:string[] = [ "Blue", "Green", "Orange", "Purple", "Gray", "Brown", "Cyan", "Magenta", "Lime", "Maroon", "Navy", "Olive", "Teal", "Silver", "Gold", "Pink", "Indigo", "Coral", "Yellow"];

  constructor(private apiService: ApiService,
              private dataService:DataService,
              private snackBar: MatSnackBar,
              private dialog: MatDialog) {
  }
  ngOnInit(): void {
      this._colors = this.read("ColorsLabels");
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
  public get colors() {
    return this._colors;
  }

  public set colors(newColors:any[]) {
    this._colors = newColors;
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
    this.callIdToColor = {};
    const rules = this.readRules();
    const excludes = this.readExcludes();
    const logGroups = this.readLogGroups();
    this.logGroupsCount = logGroups.length;

    if(this.logGroupsCount>1) {
      this.enhanceData(logGroups);
    }

    this.createLogFilter(logGroups);


    const rulesRegExs = rules.map(item=>new RegExp((item).value));
    const excludesRegExs = excludes.map(item=>new RegExp((item).value));

    const tempData1:DataItem[] = [];
    const callIdsSet = new Set();
    const selectedLogFilters = this.logGroupFilter.filter(item=>item.selected);
    this.callIds = [];
    for(const line of this._data) {
      const callId = this.findCallId(line);
      if(callId){
          if(!callIdsSet.has(callId)){
            callIdsSet.add(callId);
            this.callIds.push(callId);
            this.callIdToColor[callId]=this.colorsSet[this.callIds.length-1];
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
        const color = this.colorsSet[callIdIdx];
        msg = msg.replaceAll(callId,"<label class='"+color+"' id='"+callId+"'>"+callId+"</label>");
        break;//??
      }
      callIdIdx++;
      callIdIdx = callIdIdx % this.colorsSet.length;
    }

    for(let i=0;i< this._colors.length;i++) {
      const colorItem = this._colors[i];
      const idx = msg.indexOf(colorItem.value);
      if(idx>=0){
        msg = msg.replaceAll(colorItem.value,"<label style='font-weight:bold;color:"+colorItem.color+"'>"+colorItem.value+"</label>");
        break;//??
      }
    }

    line.formatted = msg;
  }

  private findTimeStamp(line:DataItem):string {
    const end = line.message.indexOf("[");
    if (end > 0) {
      const ts = line.message.substring(0 ,end-1);
      return ts;
    }
    return "";
  }
  private findCallId(line:DataItem):string|null {
    const callIdIdx = line.message.indexOf("Call-ID:");
    if (callIdIdx > 0) {
      const endCallIdIdx = line.message.indexOf("@", callIdIdx);
      const callId = line.message.substring(callIdIdx + 9, endCallIdIdx);
      return callId;
    }
    return "";
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
    const pre = this.logGroupFilter;
    this.logGroupFilter = [];
    for(const grp of logGroups) {
      this.logGroupFilter.push({
        label: grp.key,
        selected:true
      });
    }
    if(pre && pre.length) {
      for(const preGrp of pre) {
        for(const newGrp of this.logGroupFilter) {
            if(preGrp.label === newGrp.label){
              newGrp.selected = preGrp.selected;
              break;
            }
        }
      }
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

  cleanLogs() {
    const regEx = new RegExp("\\[[\\w-]*\\] \\[\\d+\\.\\d+\\] \\[\\] \\[\\] ");
    if(this._data){
      for(const line of this._data){
        line.message = line.message.replace(regEx,"");
        line.formatted = "";
      }
      setTimeout(this.startFormatting,1000);
    }
  }

  summary() {
      const summaryMap:Map<string,SummaryItem> = new Map<string, SummaryItem>();
      const invites:string[] = ["Received SIP INVITE request","Received a SIP INVITE request"];
      const byes:string[] = ["Received SIP BYE request","Received a SIP BYE request"];
      for(const line of this.filteredData){
        for(const invite of invites){
          if(line.message.includes(invite)){
            const callId:string|null = this.findCallId(line);
            if(callId) {
              const item = summaryMap.get(callId);
              if(item){
                item.inviteTime = this.findTimeStamp(line)||"";
              }else{
                summaryMap.set(callId,{
                  inviteTime: this.findTimeStamp(line),
                  callId:callId,
                  byeTime:"",
                  color:this.callIdToColor[callId]
                });
              }
            }
            break;
          }
        }
        for(const bye of byes){
          if(line.message.includes(bye)){
            const callId = this.findCallId(line);
            if(callId) {
              const item = summaryMap.get(callId);
              if(item){
                item.byeTime = this.findTimeStamp(line)||"";
              }else{
                summaryMap.set(callId,{
                  byeTime: this.findTimeStamp(line),
                  callId:callId,
                  inviteTime:"",
                  color:this.callIdToColor[callId]
                });
              }
            }
            break;
          }
        }
      }
      this.dialog.open(SummaryDialogComponent,{
        data: summaryMap,
        width: "60%"
      }).afterClosed().subscribe();
  }

  copyToClip() {
    let msg = "";
    for(const line of this.filteredData){
      msg+=line.message;
      msg+="\n\n";
      msg+="=======================================================\n\n";
    }

    return msg;
  }

  onCopy() {
    this.snackBar.open("Copied!",'', {
      duration: 2000,
    });
  }
}
