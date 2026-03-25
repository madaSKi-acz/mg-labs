import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductsRoutingModule } from './products-routing.module';

/**
 * Products Module
 * Feature module for product operations
 * Components are now standalone and manage their own dependencies
 */
@NgModule({
  imports: [CommonModule, ProductsRoutingModule]
})
export class ProductsModule { }