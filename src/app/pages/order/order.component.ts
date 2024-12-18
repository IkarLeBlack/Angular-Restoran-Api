import { Component, inject } from '@angular/core';
import { OrderService } from '../../data/services/order.service';
import { Order } from '../../data/interfaces/order.interface';
import { CommonModule, DatePipe, NgIf } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HeaderComponent } from '../../common-ui/header/header.component';

@Component({
  selector: 'app-order-page',
  imports: [
    CommonModule,
    DatePipe,
    FormsModule,
    ReactiveFormsModule,
    HeaderComponent,
    NgIf
  ],
  standalone: true,
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.scss'],
})
export class OrderPageComponent {
  orders: Order[] = [];
  isFormVisible = false;
  isUpdating = false;
  formData: Partial<Order> = {
    event: '',
    orderDate: new Date(),
    clientId: 0,
    totalAmount: 0,
    orderStatus: ''
  };
  showDeleteModal = false;
  selectedOrderId: number | null = null;

  private orderService = inject(OrderService);

  constructor() {
    this.loadData();
  }


  loadData(): void {
    this.orderService.getOrders().subscribe((orders) => {
      this.orders = orders.map(order => ({
        ...order,
        orderDate: new Date(order.orderDate),  // Преобразуем строку в объект Date
      }));
      console.log('Orders fetched:', this.orders);
    });
  }

  openAddForm(): void {
    this.isUpdating = false;
    this.isFormVisible = true;
    this.formData = {
      event: '',
      orderDate: new Date(),
      clientId: 0,
      totalAmount: 0,
      orderStatus: ''
    };
  }

  openUpdateForm(order: Order): void {
    this.isUpdating = true;
    this.isFormVisible = true;
    this.formData = { ...order };
  }

  confirmDelete(orderId: number): void {
    this.showDeleteModal = true;
    this.selectedOrderId = orderId;
  }

  deleteOrder(): void {
    if (this.selectedOrderId !== null) {
      this.orderService.deleteOrder(this.selectedOrderId).subscribe(() => {
        this.loadData();
        this.closeDeleteModal();
      });
    }
  }

  closeDeleteModal(): void {
    this.showDeleteModal = false;
    this.selectedOrderId = null;
  }

  closeForm(): void {
    this.isFormVisible = false;
    this.formData = {
      event: '',
      orderDate: new Date(),
      clientId: 0,
      totalAmount: 0,
      orderStatus: ''
    };
  }

  onSubmit(): void {
    if (!this.validateForm()) {
      console.error('Форма є невалідною. Виправте помилки.');
      return;
    }

    // Проверяем, если orderDate это строка, то преобразуем её в Date
    const orderDate = this.formData.orderDate instanceof Date
      ? this.formData.orderDate
      : new Date(this.formData.orderDate!);  // Преобразуем строку в Date

    const formDataToSubmit = {
      ...this.formData,
      orderDate: orderDate,  // Здесь мы уже передаем объект Date
    };

    if (this.isUpdating && this.formData.orderId) {
      this.orderService
        .updateOrder(this.formData.orderId, formDataToSubmit)
        .subscribe(() => {
          this.loadData();
          this.closeForm();
        });
    } else {
      const newOrder: Order = formDataToSubmit as Order;  // Преобразуем после проверки
      this.orderService.addOrder(newOrder).subscribe(() => {
        this.loadData();
        this.closeForm();
      });
    }
  }




  validateForm(): boolean {
    if (!this.formData.event || this.formData.event.trim().length < 2) {
      console.error('Назва події має містити принаймні 2 символи.');
      return false;
    }
    if (!this.formData.orderDate) {
      console.error('Дата замовлення обов’язкова.');
      return false;
    }
    if (!this.formData.clientId || this.formData.clientId <= 0) {
      console.error('ID клієнта має бути більшим за 0.');
      return false;
    }
    if (!this.formData.totalAmount || this.formData.totalAmount <= 0) {
      console.error('Загальна сума має бути більшою за 0.');
      return false;
    }
    if (!this.formData.orderStatus || this.formData.orderStatus.trim().length < 2) {
      console.error('Статус замовлення має містити принаймні 2 символи.');
      return false;
    }
    return true;
  }
}
