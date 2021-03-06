import { NgModule } from '@angular/core';
import { Routes, RouterModule, Router } from '@angular/router';
import { CandidatesComponent} from './candidates/candidates.component';
import { CandidateListComponent } from './candidates/candidate-list/candidate-list.component';
import { CandidateFormComponent } from './candidates/candidate-form/candidate-form.component';
import { AuthComponent } from './auth/auth.component';
import { AuthGuard } from './auth/auth-guard';
import { SponsorsComponent } from './sponsors/sponsors.component';
import { SponsorFormComponent } from './sponsors/sponsor-form/sponsor-form.component';
import { SponsorListComponent} from './sponsors/sponsor-list/sponsor-list.component';
import { RecruitmentsComponent } from './recruitments/recruitments.component';
import { RecruitmentListComponent } from './recruitments/recruitment-list/recruitment-list.component';
import { MainComponent } from './main/main.component';

// Remember that heirarchy matters over here.
const appRoutes: Routes = [
    { path: '', redirectTo: '/auth', pathMatch: 'full' },
    { path: 'auth', component: AuthComponent},
    { path: 'main',canActivate:[AuthGuard],component: MainComponent, children:[
        { path: '', component: CandidatesComponent, children:[
            {path: '', component: CandidateListComponent},
            {path: ':id/editCandidate', component: CandidateFormComponent},
            {path: 'newCandidate', component: CandidateFormComponent}
            
        ]},
        { path: 'sponsors', component: SponsorsComponent, children: [
            {path: '', component: SponsorListComponent},
            {path: ':id/editSponsor', component: SponsorFormComponent},
            {path: 'newSponsor', component: SponsorFormComponent},
        ]},
        { path: 'recruitments', component: RecruitmentsComponent, children: [
            {path: '', component: RecruitmentListComponent},
        ]}
    ]}
];
@NgModule({
    imports:[
        RouterModule.forRoot(appRoutes)
    ],
    exports: [RouterModule]
})
export class AppRoutingModule{}