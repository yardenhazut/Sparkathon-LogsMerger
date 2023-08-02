import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA} from "@angular/material/dialog";
import {SummaryItem} from "../model/SummaryItem";
import * as moment from 'moment';

export interface StringItem {
  selected:boolean;
  label:string;
}
@Component({
  selector: 'app-summary-dialog',
  templateUrl: './summary-dialog.component.html',
  styleUrls: ['./summary-dialog.component.scss']
})
export class SummaryDialogComponent implements OnInit{
  public items:SummaryItem [] = [];
  public logGroupFilter:StringItem[] = [];
  constructor(@Inject(MAT_DIALOG_DATA) public data: Map<string,SummaryItem>) { }

  ngOnInit(): void {
    const logGroupFilterArr:string[] = [];
    for (let [key, value] of this.data) {
      this.items.push(value);
      if(value.byeTimeFull){
        const bye = moment(value.byeTimeFull);
        const invite = moment(value.inviteTimeFull);
        value.diff = bye.diff(invite);
      }
      for(let grp of value.groups){
        if(!logGroupFilterArr.includes(grp)){
          logGroupFilterArr.push(grp);
        }
      }
    }
    this.logGroupFilter = logGroupFilterArr.map(item=> {
      return  {
        selected:true,
        label:item
      }
    });
  }

  findSelectedItems(items: SummaryItem[]): SummaryItem[] {
    return items.filter(item=>{
      const selectedFilters = this.logGroupFilter.filter(item=>item.selected).map(item=>item.label);
      for(let filterItem of selectedFilters){
        if(item.groups.includes(filterItem)){
          return true;
        }
      }
      return false;
    });
  }

  onClickFilter(grp: StringItem) {
    grp.selected = !grp.selected;
  }
}
