import { Component, inject } from '@angular/core';
import { DishService } from '../../data/services/dish.service';
import { Dish } from '../../data/interfaces/dish.interface';
import { CommonModule, DatePipe, NgIf, NgOptimizedImage } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HeaderComponent } from '../../common-ui/header/header.component';

@Component({
  selector: 'app-dish-page',
  imports: [
    CommonModule,
    DatePipe,
    NgOptimizedImage,
    FormsModule,
    ReactiveFormsModule,
    HeaderComponent,
    NgIf
  ],
  standalone: true,
  templateUrl: './dish.component.html',
  styleUrls: ['./dish.component.scss'],
})
export class DishPageComponent {
  dishes: Dish[] = [];
  isFormVisible = false;
  isUpdating = false;
  formData: Partial<Dish> = {
    name: '',
    category: '',
    price: 0,
    preparationTime: 0,
    photoUrl: '',
  };
  showModal = false;
  modalContent = '';
  modalTitle = '';
  showDeleteModal = false;
  selectedDishId: number | null = null;

  private dishService = inject(DishService);

  constructor() {
    this.loadData();
  }

  loadData(): void {
    this.dishService.getDishes().subscribe((dishes) => {
      this.dishes = dishes;
      console.log('Dishes fetched:', this.dishes);
    });
  }

  viewDetails(content: string, title: string): void {
    this.modalContent = content;
    this.modalTitle = title;
    this.showModal = true;
  }

  closeDeleteModal(): void {
    this.showDeleteModal = false;
    this.selectedDishId = null;
  }

  deleteDish(): void {
    if (this.selectedDishId !== null) {
      this.dishService.deleteDish(this.selectedDishId).subscribe(() => {
        this.loadData();
        this.closeDeleteModal();
      });
    }
  }

  closeModal(): void {
    this.showModal = false;
    this.modalContent = '';
    this.modalTitle = '';
  }

  openAddForm(): void {
    this.isUpdating = false;
    this.isFormVisible = true;
    this.formData = {
      name: '',
      category: '',
      price: 0,
      preparationTime: 0,
      photoUrl: '',
    };
  }

  openUpdateForm(dish: Dish): void {
    this.isUpdating = true;
    this.isFormVisible = true;
    this.formData = { ...dish };
  }

  confirmDelete(dishId: number): void {
    if (confirm('Ви дійсно хочете видалити цю страву?')) {
      this.dishService.deleteDish(dishId).subscribe(() => {
        this.loadData();
      });
    }
  }

  closeForm(): void {
    this.isFormVisible = false;
    this.formData = {
      name: '',
      category: '',
      price: 0,
      preparationTime: 0,
      photoUrl: '',
    };
  }

  onSubmit(): void {
    if (!this.validateForm()) {
      console.error('Форма є невалідною. Виправте помилки.');
      return;
    }

    if (this.isUpdating && this.formData.dishId) {
      this.dishService
        .updateDish(this.formData.dishId, this.formData)
        .subscribe(() => {
          this.loadData();
          this.closeForm();
        });
    } else {
      const newDish: Dish = { ...this.formData } as Dish;
      this.dishService.addDish(newDish).subscribe(() => {
        this.loadData();
        this.closeForm();
      });
    }
  }

  validateForm(): boolean {
    if (!this.formData.name || this.formData.name.trim().length < 2) {
      console.error('Назва страви має містити принаймні 2 символи.');
      return false;
    }
    if (!this.formData.category || this.formData.category.trim().length < 2) {
      console.error('Категорія має містити принаймні 2 символи.');
      return false;
    }
    if (this.formData.price === undefined || this.formData.price <= 0) {
      console.error('Ціна має бути більше 0.');
      return false;
    }
    if (this.formData.preparationTime === undefined || this.formData.preparationTime <= 0) {
      console.error('Час приготування має бути більше 0.');
      return false;
    }
    return true;
  }
}
