import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {ApiService} from "../services/api-service";
import {DataItem} from "../model/DataItem";

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
  @Output() dataArrived:EventEmitter<DataItem[]> = new EventEmitter<DataItem[]>();
  @Output() filterChanged:EventEmitter<any[]> = new EventEmitter<any[]>();
  @Output() excludeChanged:EventEmitter<any[]> = new EventEmitter<any[]>();


  constructor(private apiService: ApiService) {
    const ret = localStorage.getItem("SearchHistory");
    if(ret) {
      this.historySearch = JSON.parse(ret);
    }
  }
  constructor(private apiService: ApiService) {}

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
      alert("Please configure log groups");
      return;
    }
    const list:any[] = JSON.parse(ret);
    const filtered = list.filter(item=>item.selected);
    if(!filtered || filtered.length===0) {
      alert("Please select log groups");
      return;
    }

    if(!this.searchTerm) {
      alert("Please type a search term");
      return;
    }

    if(!this.relativeTerm) {
      alert("Please type a relative term");
      return;
    }

    const data = {
      "logGroups" : filtered.map(item=>item.value),
      "parameters" : this.searchTerm,
      "searchLastHours" : this.relativeTerm,
      "resultLimit" : "10000"
    }
    this.isLoading = true;
    this.apiService.postSearch(data).subscribe(
      response => {
        this.isLoading = false;
        console.log('Response from REST API:', response);

        response.forEach(item=>item.message = item.message.replaceAll("\r\n","<br>"));
        response.forEach(item=>item.message = item.message.replaceAll("\n","<br>"));

        this.dataArrived.emit(response);
      },
      error =>  {
        console.error('Error:', error);
        this.isLoading = false;
      }
    );
  }

  onFilterChanges($event: any[]) {
    this.filterChanged.emit($event);
  }

  onExcludeChanged($event: any[]) {
    this.excludeChanged.emit($event);
  }

  ngOnInit(): void {
    this.relativeTerm = localStorage.getItem("relativeKey") || "24";
  }

}
