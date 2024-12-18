import {Client} from './client.interface';
import {Dish} from './dish.interface';


export interface Order {
  orderId: number;
  event: string;
  orderDate: Date;
  clientId: number;
  totalAmount: number;
  orderStatus: string;
}

