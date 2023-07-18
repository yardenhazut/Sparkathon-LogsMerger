import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LogsAreaComponent } from './logs-area/logs-area.component';
import { RulesAreaComponent } from './rules-area/rules-area.component';
import { LogsGroupSelectionComponent } from './logs-group-selection/logs-group-selection.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { ConfigureDialogComponent } from './configure-dialog/configure-dialog.component';
import {FormsModule} from "@angular/forms";
import { SearchAreaComponent } from './search-area/search-area.component';
import { HttpClientModule } from '@angular/common/http';
import { MatExpansionModule } from '@angular/material/expansion';
@NgModule({
  declarations: [
    AppComponent,
    LogsAreaComponent,
    RulesAreaComponent,
    LogsGroupSelectionComponent,
    ConfigureDialogComponent,
    SearchAreaComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatDialogModule,
    MatButtonModule,
    FormsModule,
    HttpClientModule,
    MatExpansionModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
