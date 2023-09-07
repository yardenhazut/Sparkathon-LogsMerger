import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {ApiService} from "../services/api-service";
import {DataItem} from "../model/DataItem";
import {MatSnackBar} from "@angular/material/snack-bar";

@Component({
  selector: 'search-area',
  templateUrl: './search-area.component.html',
  styleUrls: ['./search-area.component.scss']
})
export class SearchAreaComponent implements OnInit {
  searchTerm: string = "";
  relativeTerm: string = "72";
  historySearch:string[]= [];
  isLoading: boolean = false;
  showNoData: boolean = false;

  @Output() dataArrived:EventEmitter<DataItem[]> = new EventEmitter<DataItem[]>();
  @Output() filterChanged:EventEmitter<any[]> = new EventEmitter<any[]>();
  @Output() excludeChanged:EventEmitter<any[]> = new EventEmitter<any[]>();
  @Output() colorsChanged:EventEmitter<any[]> = new EventEmitter<any[]>();


  constructor(private apiService: ApiService,private snackBar: MatSnackBar) {
    const ret = localStorage.getItem("SearchHistory");
    if (ret) {
      this.historySearch = JSON.parse(ret);
    }
  }

  onFocusOut() {
    localStorage.setItem("relativeKey", this.relativeTerm);
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

    if(!this.relativeTerm) {
      this.showMsg("Please type a relative term");
      return;
    }

    const data = {
      "logGroups" : filtered,
      "parameters" : this.searchTerm,
      "searchLastHours" : this.relativeTerm,
      "resultLimit" : "10000"
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
    this.relativeTerm = localStorage.getItem("relativeKey") || "24";
  }

  deleteItemFromHistory(historyItem:string ) {
    this.historySearch.splice(this.historySearch.indexOf(historyItem),1);
    localStorage.setItem('SearchHistory', JSON.stringify(this.historySearch));
    this.searchTerm = "";
  }


}
