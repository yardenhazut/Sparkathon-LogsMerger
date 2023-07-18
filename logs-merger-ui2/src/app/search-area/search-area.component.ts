import {Component, EventEmitter, Output} from '@angular/core';
import {ApiService} from "../services/api-service";

@Component({
  selector: 'search-area',
  templateUrl: './search-area.component.html',
  styleUrls: ['./search-area.component.scss']
})
export class SearchAreaComponent {
  searchTerm: string = "";

  @Output() dataArrived:EventEmitter<string[]> = new EventEmitter<string[]>();
  @Output() filterChanged:EventEmitter<any[]> = new EventEmitter<any[]>();


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
    const data = {
      key: ret,
      value: 'exampleValue'
    };
    this.apiService.postSearch(data).subscribe(
      response => {
        console.log('Response from REST API:', response);
        this.dataArrived.emit(response);
      },
      error => console.error('Error:', error)
    );
  }

  onFilterChanges($event: any[]) {
    this.filterChanged.emit($event);
  }
}
