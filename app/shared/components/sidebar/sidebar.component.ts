import { Component } from '@angular/core';

/**
 * Sidebar Component
 * Shared component displaying sidebar navigation
 */
@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent {
  menuItems = [
    { label: 'Dashboard', icon: '📊', link: '/dashboard' },
    { label: 'Products', icon: '🛍️', link: '/products' },
    { label: 'Users', icon: '👥', link: '/admin' },
    { label: 'Profile', icon: '👤', link: '/user/profile' },
    { label: 'Settings', icon: '⚙️', link: '/user/settings' }
  ];
}
