import {CognitoAccessToken, CognitoIdToken, CognitoRefreshToken} from 'amazon-cognito-identity-js';

export class User{
    constructor(
        private _accessToken: CognitoAccessToken, 
        private _idToken: CognitoIdToken, 
        private _refreshToken:CognitoRefreshToken){
    }
    
    get getAccessToken(){
        if (!this._accessToken || new Date() > new Date(this._accessToken['payload']['exp']*1000)){
            console.log("phuc");
            return null;
        }
        return this._accessToken['jwtToken'];
    }
    get getRefreshToken(){
        return this._refreshToken['token'];
    }
    
    get getIdToken(){
        return this._idToken['jwtToken'];
    }
}