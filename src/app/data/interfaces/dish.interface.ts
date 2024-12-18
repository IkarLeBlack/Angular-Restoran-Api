import {Client} from './client.interface';

import {Order} from './order.interface';

export interface Dish {
  dishId: number;
  name: string;
  category: string;
  price: number;
  preparationTime: number;
  photoUrl: string;
}
