import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Dish } from '../interfaces/dish.interface';

@Injectable({
  providedIn: 'root'
})
export class DishService {
  http = inject(HttpClient);
  baseApiUrl = 'https://localhost:7158/api/DishEntities';

  getDishes() {
    return this.http.get<Dish[]>(`${this.baseApiUrl}`);
  }

  addDish(dish: Dish) {
    return this.http.post<Dish>(`${this.baseApiUrl}`, dish);
  }

  updateDish(dishId: number, updatedDish: Partial<Dish>) {
    return this.http.put<Dish>(`${this.baseApiUrl}/${dishId}`, updatedDish);
  }

  deleteDish(dishId: number) {
    return this.http.delete(`${this.baseApiUrl}/${dishId}`);
  }
}
