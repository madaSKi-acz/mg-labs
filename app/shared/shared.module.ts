import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { NavbarComponent } from './components/navbar/navbar.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { StatCardComponent } from './components/stat-card/stat-card.component';
import { ProductCardComponent } from './components/product-card/product-card.component';
import { DebounceDirective } from './directives/debounce.directive';
import { SafeHtmlPipe, CurrencyFormatterPipe, TruncatePipe } from './pipes/custom.pipes';

/**
 * Shared Module
 * Contains shared components, pipes, and directives
 * Can be imported by any feature module
 */
@NgModule({
  declarations: [
    NavbarComponent,
    SidebarComponent,
    StatCardComponent,
    ProductCardComponent,
    DebounceDirective,
    SafeHtmlPipe,
    CurrencyFormatterPipe,
    TruncatePipe
  ],
  imports: [
    CommonModule,
    RouterModule,
    MatIconModule
  ],
  exports: [
    NavbarComponent,
    SidebarComponent,
    StatCardComponent,
    ProductCardComponent,
    DebounceDirective,
    SafeHtmlPipe,
    CurrencyFormatterPipe,
    TruncatePipe,
    RouterModule,
    MatIconModule
  ]
})
export class SharedModule { }
