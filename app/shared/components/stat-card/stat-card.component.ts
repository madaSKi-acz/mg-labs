import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-stat-card',
  template: `
    <div class="bg-white rounded-2xl shadow-sm hover:shadow-md transition-all duration-200 p-6 border border-gray-100">
      <!-- Icon Section -->
      <div class="flex items-center justify-between mb-4">
        <div [ngClass]="[
          'w-12 h-12 rounded-lg flex items-center justify-center',
          iconBgClass
        ]">
          <mat-icon [ngClass]="iconColorClass">{{ icon }}</mat-icon>
        </div>
        <div *ngIf="trend" [ngClass]="[
          'text-xs font-semibold px-3 py-1 rounded-full',
          trend > 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
        ]">
          {{ trend > 0 ? '+' : '' }}{{ trend }}%
        </div>
      </div>

      <!-- Content Section -->
      <div>
        <p class="text-sm text-gray-500 font-medium mb-2">{{ label }}</p>
        <div class="flex items-baseline gap-2">
          <span class="text-3xl font-bold text-gray-900">{{ value }}</span>
          <span *ngIf="unit" class="text-sm text-gray-500">{{ unit }}</span>
        </div>
      </div>

      <!-- Subtitle (optional) -->
      <p *ngIf="subtitle" class="text-xs text-gray-400 mt-3">{{ subtitle }}</p>
    </div>
  `,
  styles: []
})
export class StatCardComponent {
  @Input() icon = 'shopping_cart';
  @Input() label = 'Products';
  @Input() value = 0;
  @Input() unit: string | null = null;
  @Input() trend: number | null = null;
  @Input() subtitle: string | null = null;
  @Input() variant: 'blue' | 'green' | 'purple' | 'amber' = 'blue';

  get iconBgClass(): string {
    const variants: Record<string, string> = {
      blue: 'bg-blue-100',
      green: 'bg-green-100',
      purple: 'bg-purple-100',
      amber: 'bg-amber-100'
    };
    return variants[this.variant] || variants.blue;
  }

  get iconColorClass(): string {
    const variants: Record<string, string> = {
      blue: 'text-blue-600',
      green: 'text-green-600',
      purple: 'text-purple-600',
      amber: 'text-amber-600'
    };
    return variants[this.variant] || variants.blue;
  }
}
