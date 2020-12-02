import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService } from '../shared/auth.service';
import { Router } from '@angular/router';   

@Component({
    selector: 'app-auth', 
    templateUrl: './auth.component.html', 
    styleUrls: ['./auth.component.css']
})
//minimum length of username and password is set to 6 in the template itself
export class AuthComponent{
  
    isLoading:boolean = false;
    error = null;

    constructor(private authService: AuthService, private router: Router){}

    onSubmit(form: NgForm){
        // adding another security if submit button is enabled through developer tools
        if(!form.valid){            
            return;
        }
        const username = form.value.username;
        const password = form.value.password;
        this.isLoading = true;
        this.authService.signIn(username, password).subscribe((data) => {
            this.isLoading = false;
            this.error = null;
            this.router.navigate(['candidates']);
        }, (errorMessage)=> {
            // error handle karo
            this.error = errorMessage;
            this.isLoading = false;
        });
        form.reset();
    }

}