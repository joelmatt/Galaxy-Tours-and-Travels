import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { MatIconModule } from "@angular/material/icon";
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
import { ReactiveFormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { OnSubmitPopupComponent } from './candidates/on-submit-popup/on-submit-popup.component';
import { AuthComponent } from './auth/auth.component';
import { AuthInterceptorService } from './shared/auth-interceptor.service';

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
    OnSubmitPopupComponent,
    AuthComponent
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
    ReactiveFormsModule,
    AppRoutingModule
  ],
  providers: [CdkColumnDef,
    {provide: HTTP_INTERCEPTORS, useClass: InterceptorService, multi: true},
    {provide: HTTP_INTERCEPTORS, useClass: AuthInterceptorService, multi: true}
  ],
  bootstrap: [AppComponent],
  entryComponents:[OnSubmitPopupComponent]
})
export class AppModule { 
}
