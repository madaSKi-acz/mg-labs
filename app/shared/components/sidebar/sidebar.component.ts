import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <aside class="w-64 bg-slate-900/95 backdrop-blur-md border-r border-slate-700/50 h-screen fixed left-0 top-16 z-30">
      <nav class="p-4">
        <!-- General Section -->
        <div class="mb-6">
          <p class="px-3 text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">General</p>
          <ul class="space-y-1">
            @for (item of generalItems; track item.link) {
              <li>
                <a
                  [routerLink]="item.link"
                  routerLinkActive="active"
                  class="sidebar-link"
                >
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path [attr.d]="item.icon" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"></path>
                  </svg>
                  <span>{{ item.label }}</span>
                </a>
              </li>
            }
          </ul>
        </div>

        <!-- Management Section -->
        <div>
          <p class="px-3 text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">Management</p>
          <ul class="space-y-1">
            @for (item of managementItems; track item.link) {
              <li>
                <a
                  [routerLink]="item.link"
                  routerLinkActive="active"
                  class="sidebar-link"
                >
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path [attr.d]="item.icon" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"></path>
                  </svg>
                  <span>{{ item.label }}</span>
                </a>
              </li>
            }
          </ul>
        </div>
      </nav>
    </aside>
  `,
  styles: [`
    .sidebar-link {
      @apply flex items-center space-x-3 px-3 py-2 text-sm font-medium text-slate-300 rounded-lg transition-all duration-300 hover:bg-slate-800 hover:text-white relative;
    }

    .sidebar-link.active {
      @apply bg-blue-600 text-white;
    }

    .sidebar-link.active::before {
      content: '';
      @apply absolute left-0 top-0 bottom-0 w-1 bg-blue-400 rounded-r;
    }
  `]
})
export class SidebarComponent {

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
