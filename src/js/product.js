<<<<<<< HEAD
import { addToCart } from './utils.mjs';

// Gather product details from the product page DOM and add to cart
function getProductFromPage(button) {
  const id = button.dataset.id || null;
  const name = document.querySelector('.product-detail h2')?.textContent?.trim() || document.querySelector('.product-detail h3')?.textContent?.trim();
  const priceText = document.querySelector('.product-card__price, .product__price')?.textContent || document.querySelector('.product-card__price')?.textContent || '';
  const price = parseFloat((priceText || '').replace(/[^0-9.]/g, '')) || 0;
  const img = document.querySelector('.product-detail img')?.getAttribute('src') || null;
  return { id, name, price, img };
}

function addToCartHandler(e) {
  const btn = e.currentTarget || e.target;
  const product = getProductFromPage(btn);
  addToCart(product, 1);
  btn.textContent = 'Added';
  setTimeout(() => { btn.textContent = 'Add to Cart'; }, 1200);
}

const addBtn = document.getElementById('addToCart');
if (addBtn) addBtn.addEventListener('click', addToCartHandler);
=======
import { setLocalStorage, getLocalStorage } from './utils.mjs';
import ProductData from './ProductData.mjs';

const dataSource = new ProductData('tents');

function addProductToCart(product) {
  // Get existing cart or create empty array if none exists
  let cart = getLocalStorage('so-cart') || [];

  // Add the new product to the cart array
  cart.push(product);

  // Save the updated cart back to localStorage
  setLocalStorage('so-cart', cart);
}
// add to cart button event handler
async function addToCartHandler(e) {
  const product = await dataSource.findProductById(e.target.dataset.id);
  addProductToCart(product);
}

// add listener to Add to Cart button
document
  .getElementById('addToCart')
  .addEventListener('click', addToCartHandler);
>>>>>>> 7bc3b74ab74b72da7cd5ded747bd534523867b6a
