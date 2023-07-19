import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {DataItem} from "../model/DataItem";

@Injectable({
  providedIn: 'root'
})
export class AIService {
  private readonly AI_API = 'http://localhost:3000/api/endpoint';

  constructor(private http: HttpClient) { }

  callAI(data: any[]): Observable<string> {

    const dataItem = {
      msg:data.toString()
    }
    const options = { responseType: 'text' as 'json' };
    return this.http.post<string>(this.AI_API, dataItem,options);
  }
}
