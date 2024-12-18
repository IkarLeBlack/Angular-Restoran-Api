import {Component, inject} from '@angular/core';
import {ClientService} from '../../data/services/client.service';
import {Client} from '../../data/interfaces/client.interface';
import {CommonModule, DatePipe, NgIf, NgOptimizedImage, SlicePipe} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {Order} from '../../data/interfaces/order.interface';
import {forkJoin} from 'rxjs';
import {OrderService} from '../../data/services/order.service';
import {HeaderComponent} from '../../common-ui/header/header.component';

@Component({
  selector: 'app-client-page',
  imports: [
    CommonModule,
    DatePipe,
    SlicePipe,
    NgOptimizedImage,
    FormsModule,
    ReactiveFormsModule,
    HeaderComponent,
    NgIf
  ],

  standalone: true,
  templateUrl: './client.component.html',
  styleUrls: ['./client.component.scss'],
})

export class ClientPageComponent {
  clients: Client[] = [];
  isFormVisible = false;
  isUpdating = false;
  formData: Partial<Client> = {
    firstName: '',
    lastName: '',
    contactInfo: '',
    loyaltyProgram: '',

  };
  showModal = false;
  modalContent = '';
  modalTitle = '';
  dateError: string | null = null;
  showDeleteModal = false; // Для отображения модального окна удаления
  selectedClientId: number | null = null;

  private clientService = inject(ClientService);

  constructor() {
    this.loadData();
  }

  loadData(): void {
    this.clientService.getClients().subscribe((clients) => {
      this.clients = clients;
      console.log('Clients fetched:', this.clients);
    });
  }

  viewDetails(content: string, title: string): void {
    this.modalContent = content;
    this.modalTitle = title;
    this.showModal = true;
  }

  closeDeleteModal(): void {
    this.showDeleteModal = false;
    this.selectedClientId = null;
  }

  deleteClient(): void {
    if (this.selectedClientId !== null) {
      this.clientService.deleteClient(this.selectedClientId).subscribe(() => {
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
      firstName: '',
      lastName: '',
      contactInfo: '',
      loyaltyProgram: '',

    };
  }

  openUpdateForm(client: Client): void {
    this.isUpdating = true;
    this.isFormVisible = true;
    this.formData = { ...client };
  }

  confirmDelete(clientId: number): void {
    if (confirm('Ви дійсно хочете видалити цього клієнта?')) {
      this.clientService.deleteClient(clientId).subscribe(() => {
        this.loadData();
      });
    }
  }

  closeForm(): void {
    this.isFormVisible = false;
    this.formData = {
      firstName: '',
      lastName: '',
      contactInfo: '',
      loyaltyProgram: '',

    };
  }

  onSubmit(): void {
    if (!this.validateForm()) {
      console.error('Форма є невалідною. Виправте помилки.');
      return;
    }

    if (this.isUpdating && this.formData.clientId) {
      this.clientService
        .updateClient(this.formData.clientId, this.formData)
        .subscribe(() => {
          this.loadData();
          this.closeForm();
        });
    } else {
      const newClient: Client = { ...this.formData } as Client;
      this.clientService.addClient(newClient).subscribe(() => {
        this.loadData();
        this.closeForm();
      });
    }
  }

  validateForm(): boolean {
    if (!this.formData.firstName || this.formData.firstName.trim().length < 2) {
      console.error('Ім’я клієнта має містити принаймні 2 символи.');
      return false;
    }
    if (!this.formData.lastName || this.formData.lastName.trim().length < 2) {
      console.error('Прізвище клієнта має містити принаймні 2 символи.');
      return false;
    }
    if (!this.formData.contactInfo || this.formData.contactInfo.trim().length < 5) {
      console.error('Контактна інформація має містити принаймні 5 символів.');
      return false;
    }
    return true;
  }
}
