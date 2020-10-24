import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { MatIconModule } from "@angular/material/icon";
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NavigationComponent } from './navigation/navigation.component';
import { CandidatesComponent } from './candidates/candidates.component';
import { SponsorsComponent } from './sponsors/sponsors.component';
import { RecruitmentsComponent } from './recruitments/recruitments.component';
import { RequirementsComponent } from './requirements/requirements.component';
import {MatDividerModule} from '@angular/material/divider';

@NgModule({
  declarations: [
    AppComponent,
    NavigationComponent,
    CandidatesComponent,
    SponsorsComponent,
    RecruitmentsComponent,
    RequirementsComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatIconModule,
    MatDividerModule, 
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
