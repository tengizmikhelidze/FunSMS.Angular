import {ChangeDetectionStrategy, Component, inject, signal} from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {HeaderComponent} from '../../../../shared/components/header/header';
import {FooterComponent} from '../../../../shared/components/footer/footer';
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

    isLoading = signal(false);
    uploadedFiles = signal<File[]>([]);

    banks: PaymentBank[] = [
        {name: 'საქართველოს ბანკი', code: 'BOG'},
        {name: 'TBC ბანკი', code: 'TBC'}
    ];

    smsForm: FormGroup = this.fb.group({
        senderName: ['', [Validators.required, Validators.pattern(/^[a-zA-Z\s]+$/)]],
        recipientNumber: ['', [Validators.required, Validators.pattern(/^[0-9]{9}$/)]],
        message: ['', [Validators.required, Validators.maxLength(160)]],
        paymentBank: [null, Validators.required],
        paymentReceipt: [null, Validators.required],
        agreeToTerms: [false, Validators.requiredTrue]
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

        const formData = new FormData();
        formData.append('senderName', this.smsForm.value.senderName);
        formData.append('recipientNumber', this.smsForm.value.recipientNumber);
        formData.append('message', this.smsForm.value.message);
        formData.append('paymentBank', this.smsForm.value.paymentBank.code);

        if (this.uploadedFiles().length > 0) {
            formData.append('paymentReceipt', this.uploadedFiles()[0]);
        }

        // TODO: Send to backend
        console.log('Form submitted:', this.smsForm.value);

        setTimeout(() => {
            this.isLoading.set(false);
            this.smsForm.reset();
            this.uploadedFiles.set([]);
        }, 2000);
    }

    get characterCount() {
        const messageLength = this.smsForm.get('message')?.value?.length || 0;
        return `${messageLength}/160`;
    }
}

