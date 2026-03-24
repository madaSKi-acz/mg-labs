import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from './components/navbar/navbar.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';
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
    DebounceDirective,
    SafeHtmlPipe,
    CurrencyFormatterPipe,
    TruncatePipe
  ],
  imports: [CommonModule],
  exports: [
    NavbarComponent,
    SidebarComponent,
    DebounceDirective,
    SafeHtmlPipe,
    CurrencyFormatterPipe,
    TruncatePipe
  ]
})
export class SharedModule { }
