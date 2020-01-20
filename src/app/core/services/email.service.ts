import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { ConfigEmail } from 'src/app/menu/models/config-email.model';

@Injectable({
  providedIn: 'root'
})
export class EmailService {
  private sendMailUrl = 'http://localhost:8000/recuperasenha';
  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type':  'application/json'
    })
  };

  constructor(private http: HttpClient) { }

  sendMail(configs: ConfigEmail) {
    return this.http.post<HttpResponse<ArrayBuffer>>(this.sendMailUrl, configs, this.httpOptions);
  }
}
