import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-otp-verification',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="min-h-screen grid grid-cols-1 md:grid-cols-2">
      <!-- Visual side -->
      <div class="hidden md:flex items-center justify-center bg-gradient-to-br from-slate-900 via-indigo-900 to-slate-900 p-8">
        <div class="text-center max-w-sm">
          <h2 class="text-3xl font-bold text-white mb-2">Secure verification</h2>
          <p class="text-slate-300">Enter the OTP we sent to your email to continue to MG Labs.</p>
        </div>
      </div>

      <div class="flex items-center justify-center bg-white p-6">
        <div class="w-full max-w-md">
          <div class="text-center mb-8">
          <div class="inline-flex items-center justify-center w-16 h-16 bg-white/10 backdrop-blur-md rounded-2xl mb-6">
            <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
            </svg>
          </div>
          <h1 class="text-2xl font-semibold tracking-tight text-white mb-2">Verify Your Account</h1>
          <p class="text-slate-400">We've sent a 6-digit code to your email</p>
          <p class="text-sm text-slate-500 mt-1">{{ email() }}</p>
        </div>

        <!-- OTP Input -->
        <form (ngSubmit)="onSubmit()" class="space-y-6">
          <div class="flex justify-center space-x-3">
            @for (digit of otpDigits(); track $index) {
              <input
                type="text"
                [id]="'otp-' + $index"
                maxlength="1"
                [(ngModel)]="otpDigits()[$index]"
                (input)="onDigitInput($index, $event)"
                (keydown)="onDigitKeydown($index, $event)"
                (paste)="onPaste($event)"
                class="w-12 h-12 text-center text-xl font-semibold bg-white/10 backdrop-blur-md border border-white/20 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300"
                [class.ring-2]="focusedIndex() === $index"
                [class.ring-blue-500]="focusedIndex() === $index"
              />
            }
          </div>

          <!-- Error Message -->
          @if (errorMessage()) {
            <div class="text-center">
              <p class="text-sm text-red-400">{{ errorMessage() }}</p>
            </div>
          }

          <!-- Submit Button -->
          <button
            type="submit"
            [disabled]="isLoading() || !isOtpComplete()"
            class="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-slate-600 text-white font-medium py-3 px-4 rounded-xl transition-all duration-300 active:scale-95 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-slate-900"
          >
            @if (isLoading()) {
              <span class="flex items-center justify-center">
                <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Verifying...
              </span>
            } @else {
              Verify Code
            }
          </button>
        </form>

        <!-- Resend Code -->
        <div class="text-center mt-6">
          <p class="text-sm text-slate-400">
            Didn't receive the code?
            <button
              (click)="resendCode()"
              [disabled]="resendDisabled()"
              class="text-blue-400 hover:text-blue-300 font-medium ml-1 disabled:text-slate-500 disabled:cursor-not-allowed"
            >
              Resend{{ resendDisabled() ? ' (' + countdown() + 's)' : '' }}
            </button>
          </p>
        </div>

        <!-- Back to Login -->
        <div class="text-center mt-4">
          <button
            (click)="backToLogin()"
            class="text-sm text-slate-500 hover:text-slate-400 transition-colors"
          >
            ← Back to login
          </button>
        </div>
      </div>
    </div>
  `,
  styles: []
})
export class OtpVerificationComponent {
  private router = inject(Router);

  email = signal<string>('');
  otpDigits = signal<string[]>(['', '', '', '', '', '']);
  focusedIndex = signal<number>(0);
  errorMessage = signal<string>('');
  isLoading = signal<boolean>(false);
  resendDisabled = signal<boolean>(false);
  countdown = signal<number>(30);

  ngOnInit() {
    // Get email from route state or service
    const navigation = this.router.getCurrentNavigation();
    if (navigation?.extras?.state?.['email']) {
      this.email.set(navigation.extras.state['email']);
    }
  }

  onDigitInput(index: number, event: Event) {
    const target = event.target as HTMLInputElement;
    const value = target.value;

    if (value && /^\d$/.test(value)) {
      this.otpDigits.update(digits => {
        digits[index] = value;
        return [...digits];
      });

      // Auto-focus next input
      if (index < 5) {
        this.focusNextInput(index + 1);
      }
    } else if (value === '') {
      this.otpDigits.update(digits => {
        digits[index] = '';
        return [...digits];
      });
    }
  }

  onDigitKeydown(index: number, event: KeyboardEvent) {
    if (event.key === 'Backspace' && !this.otpDigits()[index] && index > 0) {
      this.focusNextInput(index - 1);
    } else if (event.key === 'ArrowLeft' && index > 0) {
      this.focusNextInput(index - 1);
    } else if (event.key === 'ArrowRight' && index < 5) {
      this.focusNextInput(index + 1);
    }
  }

  onPaste(event: ClipboardEvent) {
    event.preventDefault();
    const paste = event.clipboardData?.getData('text');
    if (paste && /^\d{6}$/.test(paste)) {
      const digits = paste.split('');
      this.otpDigits.set(digits);
      this.focusNextInput(5);
    }
  }

  private focusNextInput(index: number) {
    this.focusedIndex.set(index);
    setTimeout(() => {
      const input = document.getElementById(`otp-${index}`);
      input?.focus();
    });
  }

  isOtpComplete(): boolean {
    return this.otpDigits().every(digit => digit !== '');
  }

  onSubmit() {
    if (!this.isOtpComplete()) return;

    this.isLoading.set(true);
    this.errorMessage.set('');

    const otp = this.otpDigits().join('');

    // Simulate OTP verification
    setTimeout(() => {
      if (otp === '123456') { // Mock successful verification
        this.router.navigate(['/dashboard']);
      } else {
        this.errorMessage.set('Invalid verification code. Please try again.');
        this.isLoading.set(false);
      }
    }, 1500);
  }

  resendCode() {
    this.resendDisabled.set(true);
    this.countdown.set(30);

    const interval = setInterval(() => {
      this.countdown.update(c => c - 1);
      if (this.countdown() === 0) {
        clearInterval(interval);
        this.resendDisabled.set(false);
      }
    }, 1000);

    // Here you would call the auth service to resend the code
    console.log('Resending OTP code...');
  }

  backToLogin() {
    this.router.navigate(['/auth/login']);
  }
}