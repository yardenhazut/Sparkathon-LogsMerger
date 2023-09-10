import {Component, EventEmitter, OnInit, Output, ViewChild} from '@angular/core';
import {ApiService} from "../services/api-service";
import {DataItem} from "../model/DataItem";
import {MatSnackBar} from "@angular/material/snack-bar";
import {DatePickerComponent, IDayCalendarConfig} from "ng2-date-picker";
import {FormBuilder, FormControl, FormGroup} from "@angular/forms";
import * as moment from 'moment';
import {FiltersDialogComponent} from "../filters-dialog/filters-dialog.component";
import {MatDialog} from "@angular/material/dialog";
import {HistoryDialogComponent} from "../history-dialog/history-dialog.component";
import {HistoryItem} from "../model/HistoryItem";

@Component({
  selector: 'search-area',
  templateUrl: './search-area.component.html',
  styleUrls: ['./search-area.component.scss']
})
export class SearchAreaComponent implements OnInit {
  searchTerm: string = "";
  relativeTerm: number = 24;
  timeType: number = 0;
  historySearch:HistoryItem[]= [];
  isLoading: boolean = false;
  showNoData: boolean = false;
  selectedTimeFrame:number = 0;

  public dayPickerConfig = <IDayCalendarConfig>{
    locale: "en",
    format: "DD/MM/YYYY HH:mm",
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


  constructor(private apiService: ApiService,
              private snackBar: MatSnackBar,
              private fb: FormBuilder,
              public dialog: MatDialog) {
    this.readHistory();

    let timeFrom = localStorage.getItem("timeFrom");
    let timeTo = localStorage.getItem("timeTo");
    if(!timeFrom){
        timeFrom = moment().format("DD/MM/YYYY 00:00");
    }
    if(!timeTo){
      timeTo = moment().format("DD/MM/YYYY 23:59");
    }

    this.filterForm = this.fb.group({
      dateFrom: new FormControl(timeFrom),
      dateTo: new FormControl(timeTo),
    });
    const selectedTimeFrameVal = localStorage.getItem("selectedTimeFrame");
    this.selectedTimeFrame = selectedTimeFrameVal=="1" ? 1:0;
  }



  onHistory() {
    this.dialog.open(HistoryDialogComponent,{
      width: "70%"
    }).afterClosed().subscribe((item:HistoryItem)=>{
        this.readHistory();
        if(item) {
          this.searchTerm = item.searchTerm;
          this.onSearch();
        }
    });
  }

  onSearch() {
    if (this.searchTerm) {
      const found = this.historySearch.find((item)=>item.searchTerm === this.searchTerm);
      if(!found) {
        const hi: HistoryItem = new HistoryItem();
        hi.searchTerm = this.searchTerm;
        hi.dateAdded = new Date().toDateString();
        this.historySearch.unshift(hi);

        // Limit the history list size to 10
        if (this.historySearch.length > 10) {
          this.historySearch.pop();
        }
      }
      else {
        const idx = this.historySearch.indexOf(found);
        this.historySearch.splice(idx,1);
        this.historySearch.unshift(found);
      }
      localStorage.setItem('SearchItems', JSON.stringify(this.historySearch));
    }

    const ret = localStorage.getItem("LogGroupLabels");
    if(!ret) {
      this.showMsg("Please configure log groups");
      return;
    }

    const list:any[] = JSON.parse(ret);
    let filtered = list.filter(item=>item.selected);

    const envPrefix = localStorage.getItem("EnvPrefix");
    if (envPrefix !== null) {
      const parsedEnvPrefix = JSON.parse(envPrefix);
      filtered = filtered.map(item => parsedEnvPrefix + "-" + item.value);
    }

    if(!filtered || filtered.length===0) {
      this.showMsg("Please select log groups");
      return;
    }

    if(!envPrefix) {
      this.showMsg("Please select Environment");
      return;
    }

    if(!this.searchTerm) {
      this.showMsg("Please type a search term");
      return;
    }

    if(this.selectedTimeFrame==0){
      if(!this.relativeTerm) {
        this.showMsg("Please type a relative term");
        return;
      }
    }

    let data:any = {
      "logGroups" : filtered,
      "parameters" : this.searchTerm,
      "resultLimit" : "10000"
    }
    if(this.selectedTimeFrame==0) {
      data["searchRange"] = "LASTHOURS";
      if (this.timeType == 0) {
        data["searchLastMinutes"] = this.relativeTerm * 60;
        data["searchLastHours"] = "0";
      } else {
        data["searchLastMinutes"] = "0";
        data["searchLastHours"] = this.relativeTerm;
        if (this.timeType == 2) {
          data["searchLastHours"] = this.relativeTerm * 24;
        } else if (this.timeType == 3) {
          data["searchLastHours"] = this.relativeTerm * 24 * 7;
        }
      }
    }else{

      const dateFromStr = this.filterForm.get("dateFrom")?.value;
      const dateToStr = this.filterForm.get("dateTo")?.value;
      const dateFrom = moment(dateFromStr,"DD/MM/YYYY HH:mm").format("MM/DD/YYYY HH:mm:00");
      const dateTo = moment(dateToStr,"DD/MM/YYYY HH:mm").format("MM/DD/YYYY HH:mm:59");

      data["searchLastHours"] = "0";
      data["searchLastMinutes"] = "0";
      data["searchRange"] = "PERIOD";
      data["searchBeginPeriod"] = dateFrom;
      data["searchEndPeriod"] = dateTo;
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
    this.relativeTerm = Number(localStorage.getItem("relativeKey") || "1");
    this.timeType = Number(localStorage.getItem("relativePeriodKey") || "1");

    // When DateFrom changes we set the min selectable value for DateTo
    if(this.filterForm) {
      let dateFrom = this.filterForm.get("dateFrom");
      if(dateFrom) {
        dateFrom.valueChanges.subscribe(value => {
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
    /*this.historySearch.splice(this.historySearch.indexOf(historyItem),1);
    localStorage.setItem('SearchItems', JSON.stringify(this.historySearch));
    this.searchTerm = "";*/
  }

  selectedTabChanged() {
    localStorage.setItem("selectedTimeFrame",this.selectedTimeFrame==0?"0":"1");
  }

  private readHistory() {
    const ret = localStorage.getItem("SearchItems");
    if (ret) {
      this.historySearch = JSON.parse(ret);
    }
  }
}
