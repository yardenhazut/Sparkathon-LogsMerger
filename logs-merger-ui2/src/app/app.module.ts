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
import { FiltersComponent } from './filters/filters.component';
import { FiltersDialogComponent } from './filters-dialog/filters-dialog.component';
import { ExcludesDialogComponent } from './excludes-dialog/excludes-dialog.component';
import { ExcludesAreaComponent } from './excludes-area/excludes-area.component';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { AiDialogComponent } from './ai-dialog/ai-dialog.component';
import {SafeHtmlPipe} from "./pipe/SafeHtmlPipe";
import { ColorsAreaComponent } from './colors-area/colors-area.component';
import { ColorsDialogComponent } from './colors-dialog/colors-dialog.component';
import {ClipboardModule} from '@angular/cdk/clipboard';
import {MatSnackBarModule} from '@angular/material/snack-bar';
import { SummaryDialogComponent } from './summary-dialog/summary-dialog.component';
@NgModule({
  declarations: [
    AppComponent,
    LogsAreaComponent,
    RulesAreaComponent,
    LogsGroupSelectionComponent,
    ConfigureDialogComponent,
    SearchAreaComponent,
    FiltersComponent,
    FiltersDialogComponent,
    ExcludesDialogComponent,
    ExcludesAreaComponent,
    AiDialogComponent,
    SafeHtmlPipe,
    ColorsAreaComponent,
    ColorsDialogComponent,
    SummaryDialogComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatDialogModule,
    MatButtonModule,
    FormsModule,
    HttpClientModule,
    MatExpansionModule,
    MatInputModule,
    MatSelectModule,
    MatFormFieldModule,
    MatAutocompleteModule,
    ClipboardModule,
    MatSnackBarModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
