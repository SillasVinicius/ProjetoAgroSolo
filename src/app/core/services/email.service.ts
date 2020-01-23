import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { ConfigEmail } from 'src/app/menu/models/config-email.model';
import { ParametrizacaoService } from 'src/app/core/services/parametrizacao.service';
import { Observable } from 'rxjs';
import { parametrizacoes } from 'src/app/menu/models/parametrizacao.model';

@Injectable({
  providedIn: 'root'
})
export class EmailService {
  parametrizacao$: Observable<parametrizacoes[]>;
  sendMailUrl: string;
  httpOptions: any;
  constructor(
    private http: HttpClient,
    private par: ParametrizacaoService
  ) {
    this.httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };

    this.par.buscaParametro();
    this.parametrizacao$ = this.par.getAll();
    this.parametrizacao$.forEach(async (parms) => {
      this.sendMailUrl = await parms[0].urlApiEmail + '/recuperasenha';
    });

  }

  sendMail(configs: ConfigEmail) {
    return this.http.post<HttpResponse<ArrayBuffer>>(this.sendMailUrl, configs, this.httpOptions);
  }
}
