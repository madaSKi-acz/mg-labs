import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <aside
      [class.w-16]="collapsed"
      [class.w-64]="!collapsed"
      class="h-screen border-r border-slate-200 bg-white transition-all duration-300 overflow-hidden"
    >
      <nav class="p-3">
        <div class="mb-6">
          <p class="px-3 text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">
            General
          </p>
          <ul class="space-y-1">
            @for (item of generalItems; track item.link) {
              <li>
                <a
                  [routerLink]="item.link"
                  routerLinkActive="text-indigo-600 bg-indigo-50"
                  class="flex items-center gap-3 px-3 py-2 rounded-lg text-slate-700 hover:bg-slate-100 hover:text-slate-900 transition-all duration-200 whitespace-nowrap"
                >
                  <span class="text-slate-500">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path [attr.d]="item.icon" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"></path>
                    </svg>
                  </span>
                  <span [class.opacity-0]="collapsed" [class.translate-x-2]="collapsed" class="transition-all duration-200">{{ item.label }}</span>
                </a>
              </li>
            }
          </ul>
        </div>

        <!-- Management Section -->
        <div>
          <p class="px-3 text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">Management</p>
          <ul class="space-y-1">
            @for (item of managementItems; track item.link) {
              <li>
                <a
                  [routerLink]="item.link"
                  routerLinkActive="text-indigo-600 bg-indigo-50"
                  class="flex items-center gap-3 px-3 py-2 rounded-lg text-slate-700 hover:bg-slate-100 hover:text-slate-900 transition-all duration-200 whitespace-nowrap"
                >
                  <span class="text-slate-500">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path [attr.d]="item.icon" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"></path>
                    </svg>
                  </span>
                  <span [class.opacity-0]="collapsed" [class.translate-x-2]="collapsed" class="transition-all duration-200">{{ item.label }}</span>
                </a>
              </li>
            }
          </ul>
        </div>
      </nav>
    </aside>
  `,
  styles: []
})

export class SidebarComponent {
  @Input() collapsed = false;

  generalItems = [
    {
      label: 'Dashboard',
      icon: 'M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2 2z M8 5a2 2 0 012-2h4a2 2 0 012 2v2H8V5z',
      link: '/dashboard'
    },
    {
      label: 'Products',
      icon: 'M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4',
      link: '/products'
    }
  ];

  managementItems = [
    {
      label: 'Users',
      icon: 'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z',
      link: '/admin'
    },
    {
      label: 'Settings',
      icon: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z M15 12a3 3 0 11-6 0 3 3 0 016 0z',
      link: '/user/settings'
    }
  ];
}
