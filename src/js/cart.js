import { loadHeaderFooter, getLocalStorage, setLocalStorage, alertMessage, updateCartCount } from './utils.mjs';

loadHeaderFooter().then(() => {
  updateCartCount();
}).catch(err => console.error('Error loading header/footer:', err));

function cartItemTemplate(item, index) {
  const rawImage =
    (item && item.Images && (item.Images.PrimaryMedium || item.Images.PrimarySmall || item.Images.PrimaryLarge)) ||
    item.Image ||
    '../images/placeholder.png';
  // Handle image URL - use relative path from cart folder
  let img = rawImage;
  if (rawImage.startsWith('/')) {
    img = '..' + rawImage; // Convert /images/... to ../images/...
  } else if (rawImage.startsWith('./')) {
    img = '../' + rawImage.slice(2); // Convert ./images/... to ../images/...
  }
  const name = (item && (item.Name || item.NameWithoutBrand)) || 'Unnamed product';
  const color = (item && item.Colors && item.Colors[0] && item.Colors[0].ColorName) || '';
  const quantity = item.quantity || 1;
  const unitPrice = (item && item.FinalPrice != null && !isNaN(item.FinalPrice)) ? Number(item.FinalPrice) : 0;
  const totalPrice = unitPrice * quantity;

  return `<li class="cart-card divider">
    <a href="#" class="cart-card__image">
      <img src="${img}" alt="${name}">
    </a>
    <a href="../product_pages/index.html?product=${item.Id}">
      <h2 class="card__name">${name}</h2>
    </a>
    <p class="cart-card__color">${color}</p>
    <div class="cart-card__quantity">
      <button class="qty-btn qty-decrease" data-index="${index}">-</button>
      <span class="qty-value">${quantity}</span>
      <button class="qty-btn qty-increase" data-index="${index}">+</button>
    </div>
    <p class="cart-card__price">$${totalPrice.toFixed(2)}</p>
    <button class="remove-item" data-index="${index}">Remove</button>
  </li>`;
}

function renderCartContents() {
  try {
    const cartItems = getLocalStorage('so-cart') || [];
  const productList = document.querySelector('.product-list');
  
  if (!productList) {
    console.error('Product list element not found!');
    return;
  }
  
    if (cartItems.length === 0) {
      productList.innerHTML = '<li class="empty-cart">Your cart is empty. <a href="../index.html">Start shopping!</a></li>';
      hideCartTotal();
      return;
    }
  
    // Render items
    const htmlItems = cartItems.map((item, index) => cartItemTemplate(item, index));
    productList.innerHTML = htmlItems.join('');
  
  // Add remove button listeners
  addRemoveListeners();
  
    // Show total
    displayCartTotal(cartItems);
  } catch (error) {
    console.error('Error rendering cart contents:', error);
    const productList = document.querySelector('.product-list');
    if (productList) productList.innerHTML = '<li class="error">Unable to load cart. See console for details.</li>';
    hideCartTotal();
  }
}

function addRemoveListeners() {
  const removeButtons = document.querySelectorAll('.remove-item');
  removeButtons.forEach(button => {
    button.addEventListener('click', (e) => {
      const index = parseInt(e.target.dataset.index);
      removeFromCart(index);
    });
  });
  
  // Add quantity increase listeners
  const increaseButtons = document.querySelectorAll('.qty-increase');
  increaseButtons.forEach(button => {
    button.addEventListener('click', (e) => {
      const index = parseInt(e.target.dataset.index);
      updateQuantity(index, 1);
    });
  });
  
  // Add quantity decrease listeners
  const decreaseButtons = document.querySelectorAll('.qty-decrease');
  decreaseButtons.forEach(button => {
    button.addEventListener('click', (e) => {
      const index = parseInt(e.target.dataset.index);
      updateQuantity(index, -1);
    });
  });
}

function updateQuantity(index, change) {
  let cart = getLocalStorage('so-cart') || [];
  if (cart[index]) {
    cart[index].quantity = (cart[index].quantity || 1) + change;
    
    // Remove item if quantity becomes 0 or less
    if (cart[index].quantity <= 0) {
      cart.splice(index, 1);
    }
    
    setLocalStorage('so-cart', cart);
    renderCartContents();
    updateCartCount();
  }
}

function removeFromCart(index) {
  let cart = getLocalStorage('so-cart') || [];
  cart.splice(index, 1);
  setLocalStorage('so-cart', cart);
  renderCartContents();
  updateCartCount();
  alertMessage('Item removed from cart', false, 2000);
}

function displayCartTotal(items) {
  const total = items.reduce((sum, item) => {
    const quantity = item.quantity || 1;
    return sum + (item.FinalPrice * quantity);
  }, 0);
  
  let totalElement = document.querySelector('.cart-total');
  if (!totalElement) {
    totalElement = document.createElement('div');
    totalElement.className = 'cart-total';
    document.querySelector('.products').appendChild(totalElement);
  }
  
  totalElement.innerHTML = `
    <p class="cart-total-label">Subtotal:</p>
    <p class="cart-total-price">$${total.toFixed(2)}</p>
    <a href="../checkout/index.html" class="checkout-link">Proceed to Checkout</a>
  `;
}

function hideCartTotal() {
  const totalElement = document.querySelector('.cart-total');
  if (totalElement) {
    totalElement.remove();
  }
}

// Initialize cart on page load
renderCartContents();