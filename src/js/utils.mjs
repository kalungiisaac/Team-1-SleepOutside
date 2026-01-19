// src/js/utils.mjs

export function renderListWithTemplate(templateFn, parentElement, list, position = 'afterbegin', clear = false) {
  if (clear) {
    parentElement.innerHTML = '';
  }
  
  const htmlStrings = list.map(templateFn);
  parentElement.insertAdjacentHTML(position, htmlStrings.join(''));
}

// Cart utilities
const CART_KEY = 'so-cart';

export function getCart() {
  try {
    return JSON.parse(localStorage.getItem(CART_KEY)) || [];
  } catch (e) {
    return [];
  }
}

export function saveCart(cart) {
  localStorage.setItem(CART_KEY, JSON.stringify(cart || []));
}

export function addToCart(product, qty = 1) {
  const cart = getCart();
  const idx = cart.findIndex((p) => String(p.id) === String(product.id));
  if (idx === -1) {
    cart.push({ ...product, qty });
  } else {
    cart[idx].qty = (cart[idx].qty || 0) + qty;
  }
  saveCart(cart);
  return cart;
}

export function removeFromCart(productId) {
  const cart = getCart();
  const next = cart.filter((p) => String(p.id) !== String(productId));
  saveCart(next);
  return next;
}

export function clearCart() {
  saveCart([]);
}

export function updateQty(productId, qty) {
  const cart = getCart();
  const idx = cart.findIndex((p) => String(p.id) === String(productId));
  if (idx === -1) return cart;
  if (qty <= 0) {
    const next = cart.filter((p) => String(p.id) !== String(productId));
    saveCart(next);
    return next;
  }
  cart[idx].qty = qty;
  saveCart(cart);
  return cart;
}