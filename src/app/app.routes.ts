import { Routes } from '@angular/router';
import {LayoutComponent} from './common-ui/layout/layout.component';
import {ClientPageComponent} from './pages/Client/Client.component';
import {OrderPageComponent} from './pages/order/order.component';
import {Order} from './data/interfaces/order.interface';
import {DishPageComponent} from './pages/dish/dish.component';

export const routes: Routes = [
  {
    path: '', component: LayoutComponent, children: [
      {path: '', component: ClientPageComponent},
      {path: 'Dish', component: DishPageComponent},
      {path: 'order', component: OrderPageComponent}


    ]
  }
];
