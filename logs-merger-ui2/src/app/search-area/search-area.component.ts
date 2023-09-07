import {Component, EventEmitter, OnInit, Output, ViewChild} from '@angular/core';
import {ApiService} from "../services/api-service";
import {DataItem} from "../model/DataItem";
import {MatSnackBar} from "@angular/material/snack-bar";
import {DatePickerComponent, IDayCalendarConfig} from "ng2-date-picker";
import {FormBuilder, FormControl, FormGroup} from "@angular/forms";
import * as moment from 'moment';

@Component({
  selector: 'search-area',
  templateUrl: './search-area.component.html',
  styleUrls: ['./search-area.component.scss']
})
export class SearchAreaComponent implements OnInit {
  searchTerm: string = "";
  relativeTerm: number = 72;
  historySearch:string[]= [];
  isLoading: boolean = false;
  showNoData: boolean = false;
  selectedTimeFrame:number = 0;

  public dayPickerConfig = <IDayCalendarConfig>{
    locale: "en",
    format: "DD.MM.YYYY HH:mm",
    monthFormat: "MMMM, YYYY",
    hours24Format:"HH",
    firstDayOfWeek: "su"
  };
  @ViewChild("dateFromDp")
  public dateFromDp?: DatePickerComponent;

  @ViewChild("dateToDp")
  public dateToDp?: DatePickerComponent;

  @Output() dataArrived:EventEmitter<DataItem[]> = new EventEmitter<DataItem[]>();
  @Output() filterChanged:EventEmitter<any[]> = new EventEmitter<any[]>();
  @Output() excludeChanged:EventEmitter<any[]> = new EventEmitter<any[]>();
  @Output() colorsChanged:EventEmitter<any[]> = new EventEmitter<any[]>();

  public filterForm: FormGroup;
  public displayDate:any;
  public date:any;


  constructor(private apiService: ApiService,private snackBar: MatSnackBar,private fb: FormBuilder) {
    const ret = localStorage.getItem("SearchHistory");
    if (ret) {
      this.historySearch = JSON.parse(ret);
    }

    let timeFrom = localStorage.getItem("timeFrom");
    let timeTo = localStorage.getItem("timeTo");
    if(!timeFrom){
        timeFrom = moment().format("DD.MM.YYYY 00:00");
    }
    if(!timeTo){
      timeTo = moment().format("DD.MM.YYYY 23:59");
    }

    this.filterForm = this.fb.group({
      dateFrom: new FormControl(timeFrom),
      dateTo: new FormControl(timeTo),
    });
    const selectedTimeFrameVal = localStorage.getItem("selectedTimeFrame");
    this.selectedTimeFrame = selectedTimeFrameVal=="1" ? 1:0;
  }



  onSearch() {
    if (this.searchTerm && !this.historySearch.includes(this.searchTerm)) {
      this.historySearch.unshift(this.searchTerm);

      // Limit the history list size to 10
      if (this.historySearch.length > 10) {
        this.historySearch.pop();
      }
      localStorage.setItem('SearchHistory', JSON.stringify(this.historySearch));
    }

    const ret = localStorage.getItem("LogGroupLabels");
    if(!ret) {
      this.showMsg("Please configure log groups");
      return;
    }

    const list:any[] = JSON.parse(ret);
    const filtered = list.filter(item=>item.selected);
    if(!filtered || filtered.length===0) {
      this.showMsg("Please select log groups");
      return;
    }

    if(!this.searchTerm) {
      this.showMsg("Please type a search term");
      return;
    }

    if(!this.relativeTerm) {
      this.showMsg("Please type a relative term");
      return;
    }

    let data:any = {
      "logGroups" : filtered.map(item=>item.value),
      "parameters" : this.searchTerm,
      "resultLimit" : "10000"
    }
    if(this.relativeTerm<1){
      data["searchLastMinutes"] = this.relativeTerm * 60;
    } else{
      data["searchLastHours"] = this.relativeTerm;
    }

    this.isLoading = true;
    this.showNoData = false;
    this.dataArrived.emit([]);
    this.apiService.postSearch(data).subscribe(
      response => {
        this.isLoading = false;
        console.log('Response from REST API:', response);

        if(response) {
          response.forEach(item => {
            if (item.message.endsWith("\n")) {
              item.message = item.message.substring(0, item.message.length - 1);
            }
          });
        }

        this.dataArrived.emit(response);
        this.showNoData = response.length == 0;
      },
      error =>  {
        console.error('Error:', error);
        this.isLoading = false;
      }
    );
  }

  showMsg(msg:string) {
    this.snackBar.open(msg,'', {
      duration: 2000,
      panelClass: ['red-snackbar']
    });
  }

  onFilterChanges($event: any[]) {
    this.filterChanged.emit($event);
  }

  onExcludeChanged($event: any[]) {
    this.excludeChanged.emit($event);
  }
  onColorsChanged($event: any[]) {
    this.colorsChanged.emit($event);
  }

  ngOnInit(): void {
    this.relativeTerm = Number(localStorage.getItem("relativeKey") || "24");

    // When DateFrom changes we set the min selectable value for DateTo
    if(this.filterForm) {
      let dateFrom = this.filterForm.get("dateFrom");
      if(dateFrom) {
        dateFrom.valueChanges.subscribe(value => {
          // this.dateToDp.displayDate = value; // DateTo
          this.dayPickerConfig = {
            min: value,
            ...this.dayPickerConfig
          }

          localStorage.setItem("timeFrom",value);
        });
      }

      let dateTo = this.filterForm.get("dateTo");
      if(dateTo) {
        dateTo.valueChanges.subscribe(value => {
          localStorage.setItem("timeTo",value);
        });
      }
    }
  }

  deleteItemFromHistory(historyItem:string ) {
    this.historySearch.splice(this.historySearch.indexOf(historyItem),1);
    localStorage.setItem('SearchHistory', JSON.stringify(this.historySearch));
    this.searchTerm = "";
  }

  selectedTabChanged() {
    localStorage.setItem("selectedTimeFrame",this.selectedTimeFrame==0?"0":"1");
  }
}
