import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProductsRoutingModule } from './products-routing.module';
import { ProductListComponent } from './components/product-list.component';
import { ProductDetailsComponent } from './components/product-details.component';
import { ProductFormComponent } from './components/product-form.component';

/**
 * Products Module
 * Feature module for product operations
 */
@NgModule({
  declarations: [ProductListComponent, ProductDetailsComponent, ProductFormComponent],
  imports: [CommonModule, FormsModule, ProductsRoutingModule]
})
export class ProductsModule { }