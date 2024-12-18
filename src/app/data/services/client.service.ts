import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Client } from '../interfaces/client.interface';

@Injectable({
  providedIn: 'root'
})
export class ClientService {
  http = inject(HttpClient);
  baseApiUrl = 'https://localhost:7158/api/ClientEntities';


  getClients() {
    return this.http.get<Client[]>(`${this.baseApiUrl}`);
  }

  getClientById(clientId: number) {
    return this.http.get<Client>(`${this.baseApiUrl}/${clientId}`);
  }

  addClient(client: Client) {
    return this.http.post<Client>(`${this.baseApiUrl}`, client);
  }

  updateClient(clientId: number, updatedClient: Partial<Client>) {
    return this.http.put<Client>(`${this.baseApiUrl}/${clientId}`, updatedClient);
  }

  deleteClient(clientId: number) {
    return this.http.delete(`${this.baseApiUrl}/${clientId}`);
  }
}
