import { Component, OnInit } from "@angular/core";
import { UserService } from "../services/user.service";
import { User } from "../models/user";
import { GLOBAL } from "../services/global";
@Component({
    selector: 'user-edit',
    templateUrl: '../views/user-edit.html',
    providers: [UserService]
})

export class UserEditComponent implements OnInit {
    public titulo: string;
    public identity;
    public token;
    public user_update: User;
    public errorMessage;
    public alertMessage;
    public url: string;
    public filesToUpload: Array<File>;
    constructor(private _userService: UserService) {
        this.titulo = "Actualizar mis datos";
        this.identity = this._userService.getIdentity();
        this.token = this._userService.getToken();
        this.user_update = this.identity;
        this.url = GLOBAL.url;
    }
    ngOnInit() {
        console.log("Componente cargado de edición de datos");
    }
    onSubmit() {
        console.log(this._userService.getToken());
        this._userService.updateUser(this.user_update).subscribe(
            response => {
                this.user_update = response.user;
                if (!response.user) {
                    this.errorMessage = "El usuario no se ha actualizado.";
                } else {
                    // Cambiar información del usuario.
                    localStorage.setItem('identity', JSON.stringify(this.user_update));
                    document.getElementById("user_logged_in").innerHTML = this.user_update.name + " " + this.user_update.surname;
                    this.alertMessage = "El usuario se ha actualizado.";
                    // Subir imagen
                    if (!this.filesToUpload) {
                        // Redirección
                    } else {
                        this.makeFileRequest(this.url + '/upload-image-user/' + this._userService.getIdentity()._id, [], this.filesToUpload).then(
                            (result: any) => {
                                this.user_update.image = result.image;
                                localStorage.setItem('identity', JSON.stringify(this.user_update));
                                var image_path = this.url + 'get-image-user/'+this.identity.image;
                                document.getElementById("user_image").setAttribute('src', image_path);
                            }
                        );
                    }
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
    fileChangeEvent(fileInput: any) {
        this.filesToUpload = <Array<File>>fileInput.target.files;
        console.log(this.filesToUpload);

    }
    makeFileRequest(url: string, params: Array<string>, files: Array<File>) {
        var token = this.token;
        return new Promise(function (resolve, reject) {
            var formData: any = new FormData();
            var xhr = new XMLHttpRequest();
            for (let index = 0; index < files.length; index++) {
                formData.append('image', files[index], files[0].name);

            }
            xhr.onreadystatechange = function () {
                if (xhr.readyState == 4) {
                    if (xhr.status == 200) {
                        resolve(JSON.parse(xhr.response));
                    } else {
                        reject(xhr.response);
                    }
                }
            }
            xhr.open("POST", url, true);
            xhr.setRequestHeader('Authorization', token);
            xhr.send(formData);
        });
    }
}