import { ChangeDetectionStrategy, Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { HeaderComponent } from '../../../../shared/components/header/header';
import { FooterComponent } from '../../../../shared/components/footer/footer';
import { SmsService } from '../../../../core/services/sms.service';
import { SmsMessage } from '../../../../core/models/sms.model';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import { CardModule } from 'primeng/card';

@Component({
  selector: 'app-sms-history',
  imports: [
    CommonModule,
    TranslateModule,
    HeaderComponent,
    FooterComponent,
    TableModule,
    ButtonModule,
    TagModule,
    CardModule
  ],
  templateUrl: './sms-history.html',
  styleUrl: './sms-history.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SmsHistoryComponent implements OnInit {
  private smsService = inject(SmsService);

  messages = signal<SmsMessage[]>([]);
  isLoading = signal(false);
  totalMessages = signal(0);
  currentPage = signal(0);
  pageSize = signal(20);

  ngOnInit(): void {
    this.loadHistory();
  }

  loadHistory(): void {
    this.isLoading.set(true);
    const offset = this.currentPage() * this.pageSize();

    this.smsService.getHistory(this.pageSize(), offset).subscribe({
      next: (response) => {
        this.messages.set(response.data.messages);
        this.totalMessages.set(response.data.pagination.total);
        this.isLoading.set(false);
      },
      error: (error) => {
        console.error('Failed to load history:', error);
        this.isLoading.set(false);
      }
    });
  }

  onPageChange(event: any): void {
    this.currentPage.set(event.page);
    this.loadHistory();
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

  formatDate(date: Date): string {
    return new Date(date).toLocaleString();
  }
}

