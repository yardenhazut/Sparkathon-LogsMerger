import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {Observable, of} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private readonly API_URL = 'http://localhost:9021/flow-visualization/flow-visualization/search';

  constructor(private http: HttpClient) { }

  postSearch(data: any): Observable<string[]> {
    return this.http.post<any>(this.API_URL, data);
    //return of(["1234","12345"]);
  }
}
