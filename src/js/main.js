// src/js/main.js
import ProductData from './ProductData.mjs';
import ProductList from './ProductList.mjs';

// Initialize the product list
const dataSource = new ProductData();
const listElement = document.querySelector('.product-list');
const productList = new ProductList('tents', dataSource, listElement);

productList.init().catch(error => {
  // eslint-disable-next-line no-console
  console.error('Failed to initialize product list:', error);
});