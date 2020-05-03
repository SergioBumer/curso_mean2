import { Component, OnInit } from '@angular/core';
import { User } from './models/user';
import { UserService } from "./services/user.service";
import { GLOBAL } from './services/global';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  providers: [UserService]
})
export class AppComponent implements OnInit {
  title = 'Sala de conciertos';
  public user: User;
  public user_register: User;
  public identity;
  public token;
  public errorMessage;
  public url: string;
  constructor(private _userService: UserService) {
    this.user = new User('', '', '', '', 'ROLE_USER', '');
    this.user_register = new User('', '', '', '', 'ROLE_USER', '');
    this.url = GLOBAL.url;
  }
  ngOnInit() {
    this.identity = this._userService.getIdentity();
    this.token = this._userService.getToken();
    if(this.identity){
      this.user = this.identity
    }
    console.log(this.identity)
  }
  public onSubmit() {
    var token = this._userService.signUp(this.user, null).subscribe(
      response => {
        let identity = response.user;
        this.identity = identity;
        if (!this.identity) {
          alert("El usuario no esta correctamente identificado.")
        } else {
          // Creación del local storage
          localStorage.setItem('identity', JSON.stringify(identity));
          this._userService.signUp(this.user, 'true').subscribe(
            response => {
              let token = response.token;
              this.token = token;
              if (this.token.length <= 0) {
                alert("Token incorrecto.")
              } else {
                // Almacenamiento del token
                localStorage.setItem('token', JSON.stringify(token

                ));
                this.user = new User('', '', '', '', 'ROLE_USER', '');
              }

            },
            error => {
              this.errorMessage = <any>error;
              if (this.errorMessage != null) {
                var body = JSON.parse(error._body);
                this.errorMessage = body.message;

              }
            }
          );
        }
      },
      error => {
        this.errorMessage = <any>error;
        if (this.errorMessage != null) {
          var body = JSON.parse(error._body);
          this.errorMessage = body.message;

        }
      }
    );
  }
  onSubmitRegister() {
    var registro = this._userService.signIn(this.user_register).subscribe(
      response => {
        this.user = this.user_register;
        this.user_register = new User('', '', '', '', 'ROLE_USER', '');
        this.onSubmit();
      },
      error => {
        this.errorMessage = <any>error;
        if (this.errorMessage != null) {
          var body = JSON.parse(error._body);
          this.errorMessage = body.message;
        }
      }
    );
  }
  logout() {
    localStorage.removeItem('identity');
    localStorage.removeItem('token');
    localStorage.clear();
    this.identity = null;
    this.token = null;
  }

}
