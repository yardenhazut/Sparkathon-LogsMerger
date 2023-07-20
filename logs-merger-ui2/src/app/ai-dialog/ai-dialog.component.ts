import {Component, OnInit} from '@angular/core';
import {AIService} from "../services/AI-service";
import {MatDialog} from "@angular/material/dialog";
import {DataService} from "../services/data-service";

@Component({
  selector: 'app-ai-dialog',
  templateUrl: './ai-dialog.component.html',
  styleUrls: ['./ai-dialog.component.scss']
})
export class AiDialogComponent implements OnInit{
  public data:string = "Please wait ...";
  constructor(private aiService: AIService,private dataService:DataService) {

  }
  ngOnInit(): void {

    const lines = this.dataService.filteredData.slice(1,10).map(item=>item.message);

    this.aiService.callAI(lines).subscribe(res=>{
      this.data = res;
    });
  }

}
