import {Injectable} from "@angular/core";
import {DataItem} from "../model/DataItem";

@Injectable({
  providedIn: 'root'
})
export class DataService {
  public filteredData:DataItem[] = [];
}
