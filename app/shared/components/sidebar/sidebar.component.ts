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
    { label: 'Dashboard', icon: 'dashboard', link: '/dashboard' },
    { label: 'Products', icon: 'shopping_cart', link: '/products' },
    { label: 'Users', icon: 'people', link: '/admin' },
    { label: 'Profile', icon: 'person', link: '/user/profile' },
    { label: 'Settings', icon: 'settings', link: '/user/settings' }
  ];
}
