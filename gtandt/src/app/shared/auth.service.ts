import { Injectable } from '@angular/core';
import {AuthenticationDetails, CognitoUser, CognitoUserPool, CognitoAccessToken, CognitoUserSession, CognitoIdToken, CognitoRefreshToken } from 'amazon-cognito-identity-js';
import { BehaviorSubject, throwError } from 'rxjs';
import { Observable } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { User } from '../auth/user.model'; 
import { Router } from '@angular/router';
import { AppConstants } from '../shared/imp-data';

const poolData = {
    UserPoolId: AppConstants._USER_POOL_ID, // Your user pool id here
    ClientId: AppConstants._CLIENT_ID // Your client id here  
  };
  
  const userPool = new CognitoUserPool(poolData);
  
@Injectable({
    providedIn: 'root'
})
export class AuthService{

  constructor(private router: Router){}
  cognitoUser: CognitoUser;
  user = new BehaviorSubject<User>(null);
  private tokenExpirationTimer: any;

  signIn(username: string, password: string) { 
    let expiresIn: number;
    console.log("Signing In User");
    const authenticationData = {
        Username : username,
        Password : password,
      };
      const authenticationDetails = new AuthenticationDetails(authenticationData);
  
      const userData = {
        Username : username,
        Pool : userPool
      };
      const cognitoUser = new CognitoUser(userData); // stores the tokens and all the user data
      return new Observable(observer => {
        cognitoUser.authenticateUser(authenticationDetails, {
          onSuccess: function (result) {
            observer.next(result);
            observer.complete();
          },
          onFailure: function(err) {
            this.cognitoUser = null;
            observer.error(err);
          },
      });
    }).pipe(
      catchError(errorRes=>{
        let errorMessage = "An Unknown Error has occoured";
        if(!errorRes.message || !errorRes.code){
          console.log(!errorRes.code);
          return throwError(errorMessage);
        }
        switch(errorRes.code){
          case 'NetworkError': 
            errorMessage = errorRes.message + " Try again later";
            break;
          case "NotAuthorizedException": // wrong password or username 
            errorMessage = errorRes.message + " Try again";
            break;
        }
        return throwError(errorMessage);
      }), 
      tap((resData: CognitoUserSession) =>{
        const user = new User(resData.getAccessToken(), resData.getIdToken(), resData.getRefreshToken());
        this.user.next(user);
        let expirationDuration = new Date(resData.getAccessToken().getExpiration()*1000).getTime() - new Date().getTime();
        this.autoLogout(expirationDuration);
        localStorage.setItem('userData', JSON.stringify(user))
      })
    );
  }

  autoLogin(){
    const userData: { 
      _accessToken: CognitoAccessToken, 
      _idToken:  CognitoIdToken, 
      _refreshToken:  CognitoRefreshToken} = JSON.parse(localStorage.getItem('userData')
    );

    if(!userData){
      console.log("No user Data");
     return null;
    }
    else{
      console.log(" user Data Present");
      const loadedUser = new User(
        userData._accessToken,
        userData._idToken, 
        userData._refreshToken 
      );
      if(loadedUser.getAccessToken){
        this.user.next(loadedUser);
        let expirationDuration = new Date(userData._accessToken['payload']['exp']*1000).getTime() - new Date().getTime();
        this.autoLogout(expirationDuration);
        return "yeet"; // some random return statement
      }
      else{
        console.log('No login fo yo');
        return null;
      }
    }
  }

  logout(){
    userPool.getCurrentUser().signOut();
    this.user.next(null);
    localStorage.removeItem('userData');
    this.router.navigate(['/auth']);
    if (this.tokenExpirationTimer){
      clearTimeout(this.tokenExpirationTimer)
    }
    this.tokenExpirationTimer = null;
  }

  autoLogout(expirationDuration: number){
    console.log("Expiration Duration:" +expirationDuration);
    console.log("Time Out, Auto Log out");
    this.tokenExpirationTimer = setTimeout(()=>{
      this.logout()
    }, expirationDuration);
  }
}