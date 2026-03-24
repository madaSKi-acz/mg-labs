import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductsRoutingModule } from './products-routing.module';
import { ProductListComponent } from './components/product-list.component';
import { ProductDetailsComponent } from './components/product-details.component';

/**
 * Products Module
 * Feature module for product operations
 */
@NgModule({
  declarations: [ProductListComponent, ProductDetailsComponent],
  imports: [CommonModule, ProductsRoutingModule]
})
export class ProductsModule { }