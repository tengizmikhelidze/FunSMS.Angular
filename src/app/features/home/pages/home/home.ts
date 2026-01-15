import {ChangeDetectionStrategy, Component, inject, signal, computed} from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {TranslateModule, TranslateService} from '@ngx-translate/core';
import {HeaderComponent} from '../../../../shared/components/header/header';
import {FooterComponent} from '../../../../shared/components/footer/footer';
import {SmsService} from '../../../../core/services/sms.service';
import {InputTextModule} from 'primeng/inputtext';
import {ButtonModule} from 'primeng/button';
import {CardModule} from 'primeng/card';
import {CommonModule} from "@angular/common";

interface PaymentBank {
    name: string;
    code: string;
}

@Component({
    selector: 'app-home',
    imports: [
        CommonModule,
        TranslateModule,
        HeaderComponent,
        FooterComponent,
        ReactiveFormsModule,
        InputTextModule,
        ButtonModule,
        CardModule
    ],
    templateUrl: './home.html',
    styleUrl: './home.scss',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class HomeComponent {
    private fb = inject(FormBuilder);
    private smsService = inject(SmsService);

    isLoading = signal(false);
    uploadedFiles = signal<File[]>([]);
    errorMessage = signal<string>('');
    successMessage = signal<string>('');

    banks: PaymentBank[] = [
        {name: 'home.form.banks.bog', code: 'BOG'},
        {name: 'home.form.banks.tbc', code: 'TBC'}
    ];

    smsForm: FormGroup = this.fb.group({
        senderName: ['', [Validators.required, Validators.pattern(/^[a-zA-Z0-9]{3,11}$/)]],
        recipientNumber: ['', [Validators.required, Validators.pattern(/^[5][0-9]{8}$/)]],
        message: ['', [Validators.required, Validators.maxLength(1000)]],
        paymentBank: [null, Validators.required],
        paymentReceipt: [null, Validators.required],
        agreeToTerms: [false, Validators.requiredTrue]
    });

    // Calculate message info
    messageInfo = computed(() => {
        const message = this.smsForm.get('message')?.value || '';
        return this.smsService.calculateMessageInfo(message);
    });

    onFileSelect(event: Event): void {
        const input = event.target as HTMLInputElement;
        if (input.files && input.files.length > 0) {
            const file = input.files[0];
            this.uploadedFiles.set([file]);
            this.smsForm.patchValue({paymentReceipt: file});
        }
    }

    onFileRemove(): void {
        this.uploadedFiles.set([]);
        this.smsForm.patchValue({paymentReceipt: null});
    }

    onSubmit(): void {
        if (this.smsForm.invalid) {
            this.smsForm.markAllAsTouched();
            return;
        }

        this.isLoading.set(true);
        this.errorMessage.set('');
        this.successMessage.set('');

        const formValue = this.smsForm.value;

        // Format phone number to +995XXXXXXXXX
        const phone = this.smsService.formatGeorgianPhone(formValue.recipientNumber);

        // Prepare SMS request
        const smsRequest = {
            phone: phone,
            senderName: formValue.senderName,
            message: formValue.message
        };

        // Send SMS
        this.smsService.sendSms(smsRequest).subscribe({
            next: (response) => {
                console.log('SMS sent successfully:', response);
                this.successMessage.set(response.message || 'SMS sent successfully!');
                this.isLoading.set(false);

                // Reset form after successful send
                this.smsForm.reset();
                this.uploadedFiles.set([]);

                // Clear success message after 5 seconds
                setTimeout(() => this.successMessage.set(''), 5000);
            },
            error: (error) => {
                console.error('SMS send error:', error);
                this.errorMessage.set(error.message || 'Failed to send SMS. Please try again.');
                this.isLoading.set(false);
            }
        });
    }

    get characterCount() {
        const info = this.messageInfo();
        return `${info.length}/1000 (${info.parts} SMS, ${info.charset})`;
    }
}



