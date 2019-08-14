import { Injectable } from '@angular/core';
import { Cliente } from 'src/app/menu/models/cliente.model';
import { Observable } from 'rxjs';
import { RequestOptions, Http } from '@angular/http';

@Injectable({
  providedIn: 'root'
})
export class CriaClienteService {
  constructor(private http: Http) {}
  // criaCliente(cliente: Cliente): Observable<string> {
  //   const headers = new Headers();
  //   headers.append('Content-Type', 'application/json');
  //   return this.http
  //     .post(
  //       'http://localhost:3001/cliente',
  //       JSON.stringify(cliente),
  //       new RequestOptions({ headers })
  //     )
  //     .map(response => response.json())
  //     .map(cl => );
  // }
  // clear() {
  //   this.cartService.clear();
  // }

  async criaCliente(
    pid: string,
    pnome: string,
    pcpf: string,
    ppatrimonio: string,
    ppdtvAgro: string,
    pfoto: string
  ) {
    return await new Promise((resolve, reject) => {
      const data = {
        id: pid,
        nome: pnome,
        cpf: pcpf,
        patrimonio: ppatrimonio,
        pdtvAgro: ppdtvAgro,
        foto: pfoto
      };

      this.http.post('http://localhost:3001/cliente', data).subscribe(
        (result: any) => {
          resolve(result.json());
        },
        error => {
          reject(error.json());
        }
      );
    });
  }

  get(id: string) {
    return new Promise((resolve, reject) => {
      const url = 'http://localhost:3001/cliente/' + id;

      this.http.get(url).subscribe(
        (result: any) => {
          resolve(result.json());
        },
        error => {
          reject(error.json());
        }
      );
    });
  }

  async atualizaCliente(cliente: any) {
    return await new Promise((resolve, reject) => {
      const url = 'http://localhost:3001/cliente/' + cliente.id;
      const data = {
        nome: cliente.nome,
        cpf: cliente.cpf,
        patrimonio: cliente.patrimonio,
        pdtvAgro: cliente.pdtvAgro
      };

      this.http.put(url, cliente).subscribe(
        (result: any) => {
          resolve(result.json());
        },
        error => {
          reject(error.json());
        }
      );
    });
  }
}
