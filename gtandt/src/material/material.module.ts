import {MatDividerModule} from '@angular/material/divider';
import {MatButtonModule} from '@angular/material/button';
import {MatCardModule} from '@angular/material/card';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import { NgModule } from '@angular/core';

@NgModule({
    exports:[
        MatButtonModule, 
        MatCardModule,
        MatFormFieldModule,
        MatInputModule,
        MatDividerModule
    ],
    imports: [],
})

export class MaterialModule{}