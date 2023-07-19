import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders, HttpResponse} from '@angular/common/http';
import {Observable, of} from 'rxjs';
import {DataItem} from "../model/DataItem";
import {SaveDataItem} from "../model/SaveDataItem";

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private readonly SEARCH_API_URL = 'http://localhost:9021/flow-visualization/flow-visualization/search';
  private readonly SAVE_API_URL = 'http://127.0.0.1:9021/flow-visualization/flow-visualization/save';

  constructor(private http: HttpClient) { }

  postSearch(data: any): Observable<DataItem[]> {
    return this.http.post<DataItem[]>(this.SEARCH_API_URL, data);
  }

  postSave(data: SaveDataItem): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const options = { headers: headers, responseType: 'arraybuffer' as 'json' };

    return this.http.post<ArrayBuffer>(this.SAVE_API_URL, data, options);
  }
}
