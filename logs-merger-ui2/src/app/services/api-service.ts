import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {Observable, of} from 'rxjs';
import {DataItem} from "../model/DataItem";

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private readonly API_URL = 'http://localhost:9021/flow-visualization/flow-visualization/search';

  constructor(private http: HttpClient) { }

  postSearch(data: any): Observable<DataItem[]> {
    return this.http.post<DataItem[]>(this.API_URL, data);
  }
}
