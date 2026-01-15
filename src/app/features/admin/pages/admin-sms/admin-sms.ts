import { ChangeDetectionStrategy, Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { HeaderComponent } from '../../../../shared/components/header/header';
import { FooterComponent } from '../../../../shared/components/footer/footer';
import { AdminService } from '../../../../core/services/admin.service';
import { SmsMessage } from '../../../../core/models';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';
import { ConfirmationService, MessageService } from 'primeng/api';

@Component({
  selector: 'app-admin-sms',
  imports: [
    CommonModule,
    FormsModule,
    TranslateModule,
    HeaderComponent,
    FooterComponent,
    TableModule,
    ButtonModule,
    TagModule,
    CardModule,
    InputTextModule,
    SelectModule,
    ConfirmDialogModule,
    ToastModule
  ],
  providers: [ConfirmationService, MessageService],
  templateUrl: './admin-sms.html',
  styleUrl: './admin-sms.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AdminSmsComponent implements OnInit {
  private adminService = inject(AdminService);
  private confirmationService = inject(ConfirmationService);
  private messageService = inject(MessageService);

  messages = signal<SmsMessage[]>([]);
  isLoading = signal(false);
  totalMessages = signal(0);
  currentPage = signal(1);
  pageSize = signal(20);

  // Filters
  searchPhone = signal('');
  selectedStatus = signal<any>(null);
  selectedSentFilter = signal<any>(null);

  statusOptions = [
    { label: 'All', value: null },
    { label: 'Pending', value: 'pending' },
    { label: 'Sent', value: 'sent' },
    { label: 'Failed', value: 'failed' },
    { label: 'Delivered', value: 'delivered' }
  ];

  sentOptions = [
    { label: 'All', value: null },
    { label: 'Sent', value: true },
    { label: 'Not Sent', value: false }
  ];

  ngOnInit(): void {
    this.loadMessages();
  }

  loadMessages(): void {
    this.isLoading.set(true);

    const params: any = {
      page: this.currentPage(),
      limit: this.pageSize()
    };

    if (this.searchPhone()) {
      params.recipient_phone = this.searchPhone();
    }

    if (this.selectedStatus() !== null) {
      params.status = this.selectedStatus();
    }

    if (this.selectedSentFilter() !== null) {
      params.sent_status = this.selectedSentFilter();
    }

    this.adminService.getAllSms(params).subscribe({
      next: (response) => {
        // Response structure: { success, data: { messages, pagination, filters } }
        this.messages.set(response.data.messages);
        this.totalMessages.set(response.data.pagination.total);
        this.isLoading.set(false);
      },
      error: (error) => {
        console.error('Failed to load messages:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to load SMS messages'
        });
        this.isLoading.set(false);
      }
    });
  }

  onPageChange(event: any): void {
    this.currentPage.set(event.page + 1);
    this.loadMessages();
  }

  onSearch(): void {
    this.currentPage.set(1);
    this.loadMessages();
  }

  onFilterChange(): void {
    this.currentPage.set(1);
    this.loadMessages();
  }

  sendSms(sms: SmsMessage): void {
    if (sms.status === 'sent' || sms.status === 'delivered') {
      this.messageService.add({
        severity: 'warn',
        summary: 'Warning',
        detail: 'This message has already been sent'
      });
      return;
    }

    this.confirmationService.confirm({
      message: `Send SMS to ${sms.recipient_phone}?`,
      header: 'Confirm Send',
      icon: 'pi pi-send',
      accept: () => {
        this.adminService.sendAnySms(sms.id).subscribe({
          next: (response) => {
            this.messageService.add({
              severity: 'success',
              summary: 'Success',
              detail: response.message || 'SMS sent successfully'
            });
            this.loadMessages();
          },
          error: (error) => {
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: error.message || 'Failed to send SMS'
            });
          }
        });
      }
    });
  }

  deleteSms(sms: SmsMessage): void {
    this.confirmationService.confirm({
      message: `Delete SMS to ${sms.recipient_phone}?`,
      header: 'Confirm Delete',
      icon: 'pi pi-exclamation-triangle',
      acceptButtonStyleClass: 'p-button-danger',
      accept: () => {
        this.adminService.deleteAnySms(sms.id).subscribe({
          next: (response) => {
            this.messageService.add({
              severity: 'success',
              summary: 'Success',
              detail: response.message || 'SMS deleted successfully'
            });
            this.loadMessages();
          },
          error: (error) => {
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: error.message || 'Failed to delete SMS'
            });
          }
        });
      }
    });
  }

  getStatusSeverity(status: string): 'success' | 'info' | 'warn' | 'danger' {
    switch (status) {
      case 'delivered':
      case 'sent':
        return 'success';
      case 'pending':
        return 'info';
      case 'failed':
        return 'danger';
      default:
        return 'warn';
    }
  }

  formatDate(date: Date | string): string {
    return new Date(date).toLocaleString();
  }

  formatCost(cost: number | string | undefined): string {
    if (!cost) return '-';
    const numericCost = typeof cost === 'string' ? parseFloat(cost) : cost;
    return isNaN(numericCost) ? '-' : '$' + numericCost.toFixed(4);
  }

  canSend(sms: SmsMessage): boolean {
    return sms.status !== 'sent' && sms.status !== 'delivered';
  }
}

