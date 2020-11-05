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
import{CandidateListComponent} from './candidates/candidate-list/candidate-list.component';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import {MaterialModule} from '../material/material.module';
import { CdkColumnDef } from '@angular/cdk/table';
import { InterceptorService } from './shared/interceptor.service';
import { FormsModule } from '@angular/forms';
import { CandidateFormComponent } from './candidates/candidate-form/candidate-form.component';
import { OwlDateTimeModule, OwlNativeDateTimeModule } from 'ng-pick-datetime';



@NgModule({
  declarations: [
    AppComponent,
    NavigationComponent,
    CandidatesComponent,
    SponsorsComponent,
    RecruitmentsComponent,
    RequirementsComponent,
    CandidateListComponent,
    CandidateFormComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatIconModule,
    HttpClientModule, 
    MaterialModule,
    FormsModule,
    OwlDateTimeModule, 
    OwlNativeDateTimeModule,
  ],
  providers: [CdkColumnDef,
    {provide: HTTP_INTERCEPTORS, useClass: InterceptorService, multi: true}
  ],
  bootstrap: [AppComponent]
})
export class AppModule { 
}
