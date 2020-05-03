import { Injectable } from '@angular/core';
import { Http, Response, Headers } from "@angular/http";
import { map } from 'rxjs/operators';
// import 'rxjs/add/observable/map';
import { Observable } from "rxjs/Observable";
import { GLOBAL } from "./global";
@Injectable()
export class UserService {
    public url: string;
    public identity: any;
    public token: any;
    constructor(private _http: Http) {
        this.url = GLOBAL.url;
    }

    signUp(user_to_login, getHash = null) {
        user_to_login.getHash = null || getHash;
        let json = JSON.stringify(user_to_login);
        let params = json;
        let headers = new Headers({ 'Content-Type': 'application/json' });
        return this._http.post(this.url + 'login-user', params, { headers: headers }).pipe(map((res: Response) => res.json()));
    }
    signIn(user_to_register) {
        let json = JSON.stringify(user_to_register);
        let params = json;
        let headers = new Headers({ 'Content-Type': 'application/json' });
        return this._http.post(this.url + 'register-user', params, { headers: headers }).pipe(map((res: Response) => res.json()));
    }
    updateUser(user_to_update) {
        let json = JSON.stringify(user_to_update);
        let params = json;
        let headers = new Headers({ 'Content-Type': 'application/json', 'Authorization': this.getToken() });
        return this._http.put(this.url + 'update-user/'+user_to_update._id, params, { headers: headers }).pipe(map((res: Response) => res.json()));
    }
    getIdentity() {
        let identity = JSON.parse(localStorage.getItem('identity'));

        if (identity != "undefined") {
            this.identity = identity;
        } else {
            this.identity = null;
        }
        return this.identity;
    }
    getToken() {
        let token = JSON.parse(localStorage.getItem('token'));

        if (token != "undefined") {
            this.token = token;
        } else {
            this.token = null;
        }
        return this.token;
    }
}