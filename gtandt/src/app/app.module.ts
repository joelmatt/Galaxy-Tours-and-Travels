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
import { OnSubmitPopupComponent } from '../on-submit-popup/on-submit-popup.component';
import { AuthComponent } from './auth/auth.component';
import { AuthInterceptorService } from './shared/auth-interceptor.service';
import { CandidateResumeComponent } from './candidates/candidate-form/candidate-resume/candidate-resume.component';
import { DropzoneDirective } from './candidates/candidate-form/candidate-resume/dropzone.directive';
import { PdfViewerModule } from 'ng2-pdf-viewer';
import { CandidatePassportInfoComponent } from './candidates/candidate-form/candidate-passport-info/candidate-passport-info.component';
import { MainComponent } from './main/main.component';
import { SponsorFormComponent } from './sponsors/sponsor-form/sponsor-form.component';
import { SponsorListComponent } from './sponsors/sponsor-list/sponsor-list.component';
import { RecruitmentListComponent } from './recruitments/recruitment-list/recruitment-list.component';
import { NewRecruitmentFormComponent } from './recruitments/new-recruitment-form/new-recruitment-form.component';

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
    AuthComponent,
    CandidateResumeComponent,
    DropzoneDirective,
    CandidatePassportInfoComponent,
    MainComponent,
    SponsorFormComponent,
    SponsorListComponent,
    RecruitmentListComponent,
    NewRecruitmentFormComponent
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
    AppRoutingModule,
    PdfViewerModule    
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
