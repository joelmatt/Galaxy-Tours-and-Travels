import { NgModule } from '@angular/core';
import { Routes, RouterModule, Router } from '@angular/router';
import { CandidatesComponent} from './candidates/candidates.component';
import { CandidateListComponent } from './candidates/candidate-list/candidate-list.component';
import { CandidateFormComponent } from './candidates/candidate-form/candidate-form.component';

// Remember that heirarchy matters over here.
const appRoutes: Routes = [
    {path: 'candidates', component: CandidatesComponent, children:[
        {path: 'candidateList', component: CandidateListComponent},
        {path: 'newCandidate', component: CandidateFormComponent},
        {path: ':id/editCandidate', component: CandidateFormComponent}
    ]}
];
@NgModule({
    imports:[
        RouterModule.forRoot(appRoutes)
    ],
    exports: [RouterModule]
})
export class AppRoutingModule{}