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
