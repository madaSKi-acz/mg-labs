import { Directive, HostListener, Input, OnDestroy } from '@angular/core';

/**
 * Debounce Directive
 * Adds debounce functionality to input events
 * Useful for search inputs and form validation
 */
@Directive({
  selector: '[appDebounce]'
})
export class DebounceDirective implements OnDestroy {
  @Input() appDebounce = 300;
  @Input() debounceAction = (): void => { };

  private timeoutId: any = null;

  constructor() { }

  @HostListener('input')
  onInput(): void {
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
    }

    this.timeoutId = setTimeout(() => {
      this.debounceAction();
    }, this.appDebounce);
  }

  /**
   * Cleanup timeout
   */
  ngOnDestroy(): void {
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
    }
  }
}
