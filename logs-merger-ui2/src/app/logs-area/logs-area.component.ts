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
  public noWrap = false;

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
    const firstBreak = msg.indexOf(" ");
    const date = msg.substring(0,firstBreak);
    msg = msg.replaceAll(date,"<b>"+date+"</b>");

    if(!this.noWrap){
      msg = msg.replaceAll("\r\n","<br>").replaceAll("\n","<br>");
    }else{
      msg = msg.replaceAll("\r\n"," ").replaceAll("\n"," ");
    }
    if(this.noWrap){
      msg = "<label style=\"background-color: "+line.logGroupBGColor+"\">" + line.logGroupLabel +"</label> " + msg;
    }

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
  private findCorrelationKey(line:DataItem):string|null {
    const corIdx = line.message.indexOf("X-Correlation-Key:");
    if (corIdx > 0) {
      const endCorIdx = line.message.indexOf("\n", corIdx);
      const correlation = line.message.substring(corIdx + 18, endCorIdx);
      return correlation;
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

  onNoWrap() {
    this.noWrap = !this.noWrap;
    this.processData();
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

    const colors = ["aquamarine","chartreuse","fuchsia","violet","yellow","orange","pink"];
    const envs = ["dev-",'test-','perf-','perf-wcx-','staging-','production-'];
    for (const grp of logGroups) {
      for (const env of envs) {
        logGroupsMap[env + grp.value] = grp.key;
      }
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

  getLineInRequest(line:string,property:string){
    const idx = line.indexOf(property);
    if(idx<0){
      return "";
    }
    const idx2 = line.indexOf("\n",idx+1);
    if(idx2<0){
      return "";
    }
    return line.substring(idx,idx2);
  }

  summary() {
      const summaryMap:Map<string,SummaryItem> = new Map<string, SummaryItem>();
      const invites:string[] = ["Received SIP INVITE request","Received a SIP INVITE request"];
      const byes:string[] = ["Received SIP BYE request",
        "Received a SIP BYE request",
        "Received a SIP OK response:\nSIP/2.0 200 OK\r\nCSeq: 1 BYE"];
      for(const line of this.filteredData){
        for(const invite of invites){
          if(line.message.includes(invite)){
            const callId:string|null = this.findCallId(line);
            if(callId) {
              const item = summaryMap.get(callId);
              if(item){
                if(!item.inviteTime) {
                  item.inviteTime = this.findTimeStamp(line) || "";
                  item.inviteTimeFull = line.timestamp;
                }
                if(item.groups && !item.groups.includes(line.logGroupLabel)){
                  item.groups.push(line.logGroupLabel);
                }
              }else{

                const from = this.getLineInRequest(line.message,"From:");
                const to = this.getLineInRequest(line.message,"To:");
                const fromLabel = this.findLabel(from);
                const toLabel = this.findLabel(to);
                const correlation:string = this.findCorrelationKey(line) || "";
                summaryMap.set(callId,{
                  inviteTime: this.findTimeStamp(line),
                  callId:callId,
                  byeTime:"",
                  color:this.callIdToColor[callId],
                  inviteTimeFull: line.timestamp,
                  byeTimeFull:"",
                  groups:[line.logGroupLabel],
                  diff:0,
                  fromLabel:fromLabel,
                  from:from,
                  toLabel:toLabel,
                  to:to,
                  correlation:correlation
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
                item.byeTimeFull = line.timestamp;
                if(item.groups && !item.groups.includes(line.logGroupLabel)){
                  item.groups.push(line.logGroupLabel);
                }
              }else{
                const from = this.getLineInRequest(line.message,"From:");
                const to = this.getLineInRequest(line.message,"To:");
                const fromLabel = this.findLabel(from);
                const toLabel = this.findLabel(to);
                const correlation:string = this.findCorrelationKey(line) || "";
                summaryMap.set(callId,{
                  byeTime: this.findTimeStamp(line),
                  callId:callId,
                  inviteTime:"",
                  color:this.callIdToColor[callId],
                  inviteTimeFull: "",
                  byeTimeFull:line.timestamp,
                  groups:[line.logGroupLabel],
                  diff:0,
                  fromLabel:fromLabel,
                  from:from,
                  toLabel:toLabel,
                  to:to,
                  correlation:correlation
                });
              }
            }
            break;
          }
        }
      }
      this.dialog.open(SummaryDialogComponent,{
        data: summaryMap,
        width: "70%"
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

  private findLabel(line: string) {
    const index1 = line.indexOf("\"");
    if(index1>0){
      const index2 = line.indexOf("\"",index1+1);
      return line.substring(index1+1,index2);
    }
    const indexOfSmallerThanSign = line.indexOf("<");
    if(indexOfSmallerThanSign>0){
      const indexOfShtrudel = line.indexOf("@",indexOfSmallerThanSign+1);
      if(indexOfShtrudel>0) {
        return line.substring(indexOfSmallerThanSign + 1, indexOfShtrudel);
      }
    }
    return line;
  }
}
