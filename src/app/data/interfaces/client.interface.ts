
import {Dish} from './dish.interface';
import {Order} from './order.interface';

export interface Client {
  clientId: number;
  firstName: string;
  lastName: string;
  contactInfo: string;
  loyaltyProgram: string;
}
