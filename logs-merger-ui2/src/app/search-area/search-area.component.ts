import {Component, EventEmitter, Output} from '@angular/core';
import {ApiService} from "../services/api-service";

@Component({
  selector: 'search-area',
  templateUrl: './search-area.component.html',
  styleUrls: ['./search-area.component.scss']
})
export class SearchAreaComponent {
  searchTerm: string = "";
  isLoading: boolean = false;
  @Output() dataArrived:EventEmitter<string[]> = new EventEmitter<string[]>();
  @Output() filterChanged:EventEmitter<any[]> = new EventEmitter<any[]>();
  @Output() excludeChanged:EventEmitter<any[]> = new EventEmitter<any[]>();


  constructor(private apiService: ApiService) {}
  onSearch() {
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

    const data = {
      "logGroups" : filtered.map(item=>item.value),
      "parameters" : this.searchTerm,
      "searchLastHours" : "72",
      "resultLimit" : "10000"
    }
    this.isLoading = true;
    this.apiService.postSearch(data).subscribe(
      response => {
        this.isLoading = false;
        console.log('Response from REST API:', response);
        this.dataArrived.emit((<any>response).logRows);
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
}
