import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Order } from '../interfaces/order.interface';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  http = inject(HttpClient);
  baseApiUrl = 'https://localhost:7158/api/OrderEntities';


  getOrders() {
    return this.http.get<Order[]>(`${this.baseApiUrl}`);
  }


  getOrderById(orderId: number) {
    return this.http.get<Order>(`${this.baseApiUrl}/${orderId}`);
  }


  addOrder(order: Order) {
    return this.http.post<Order>(`${this.baseApiUrl}`, order);
  }


  updateOrder(orderId: number, updatedOrder: {
    totalAmount?: number;
    clientId?: number;
    orderId?: number;
    orderStatus?: string;
    event?: string;
    orderDate: Date
  }) {
    return this.http.put<Order>(`${this.baseApiUrl}/${orderId}`, updatedOrder);
  }

  deleteOrder(orderId: number) {
    return this.http.delete(`${this.baseApiUrl}/${orderId}`);
  }
}
