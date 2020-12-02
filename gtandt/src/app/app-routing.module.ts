import { NgModule } from '@angular/core';
import { Routes, RouterModule, Router } from '@angular/router';
import { CandidatesComponent} from './candidates/candidates.component';
import { CandidateListComponent } from './candidates/candidate-list/candidate-list.component';
import { CandidateFormComponent } from './candidates/candidate-form/candidate-form.component';
import { AuthComponent } from './auth/auth.component';
import { AuthGuard } from './auth/auth-guard';

// Remember that heirarchy matters over here.
const appRoutes: Routes = [
    { path: '', redirectTo: '/auth', pathMatch: 'full' },
    {path: 'candidates', canActivate:[AuthGuard],component: CandidatesComponent, children:[
        {path: '', component: CandidateListComponent},
        {path: ':id/editCandidate', component: CandidateFormComponent},
        {path: 'newCandidate', component: CandidateFormComponent}
        
    ]},
    {path: 'auth', component: AuthComponent}
];
@NgModule({
    imports:[
        RouterModule.forRoot(appRoutes)
    ],
    exports: [RouterModule]
})
export class AppRoutingModule{}