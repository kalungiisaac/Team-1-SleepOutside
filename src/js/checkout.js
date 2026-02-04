import { loadHeaderFooter, getLocalStorage, setLocalStorage, alertMessage, updateCartCount } from './utils.mjs';

loadHeaderFooter().then(() => {
  updateCartCount();
}).catch(err => console.error('Error loading header/footer:', err));

// Calculate shipping based on number of items
function calculateShipping(itemCount) {
  if (itemCount === 0) return 0;
  if (itemCount === 1) return 10;
  return 10 + (itemCount - 1) * 2;
}

// Calculate tax (6%)
function calculateTax(subtotal) {
  return subtotal * 0.06;
}

// Display order summary
function displayOrderSummary() {
  const cart = getLocalStorage('so-cart') || [];
  const orderItemsContainer = document.getElementById('order-items');
  
  if (cart.length === 0) {
    orderItemsContainer.innerHTML = '<li class="empty-cart">Your cart is empty. <a href="../index.html">Shop now</a></li>';
    document.getElementById('item-total').textContent = '$0.00';
    document.getElementById('shipping-total').textContent = '$0.00';
    document.getElementById('tax-total').textContent = '$0.00';
    document.getElementById('order-total').textContent = '$0.00';
    
    // Disable checkout button
    const checkoutButton = document.querySelector('.checkout-button');
    if (checkoutButton) {
      checkoutButton.disabled = true;
      checkoutButton.textContent = 'Cart is Empty';
    }
    return;
  }
  
  // Display items
  const itemsHTML = cart.map(item => {
    const rawImage = item.Images?.PrimaryMedium || item.Images?.PrimarySmall || item.Image || '';
    const img = rawImage.startsWith('./') ? rawImage.replace('./', '/') : rawImage;
    const name = item.Name || item.NameWithoutBrand || 'Product';
    const price = item.FinalPrice || 0;
    const quantity = item.quantity || 1;
    const itemTotal = price * quantity;
    
    return `
      <li class="order-item">
        <img src="${img}" alt="${name}" class="order-item-image" />
        <div class="order-item-details">
          <h4>${name}</h4>
          <p class="order-item-qty">Qty: ${quantity}</p>
          <p class="order-item-price">$${itemTotal.toFixed(2)}</p>
        </div>
      </li>
    `;
  }).join('');
  
  orderItemsContainer.innerHTML = itemsHTML;
  
  // Calculate totals (accounting for quantities)
  const itemTotal = cart.reduce((sum, item) => {
    const quantity = item.quantity || 1;
    return sum + ((item.FinalPrice || 0) * quantity);
  }, 0);
  
  // Calculate total item count for shipping
  const totalItems = cart.reduce((sum, item) => sum + (item.quantity || 1), 0);
  const shipping = calculateShipping(totalItems);
  const tax = calculateTax(itemTotal);
  const orderTotal = itemTotal + shipping + tax;
  
  // Display totals
  document.getElementById('item-total').textContent = `$${itemTotal.toFixed(2)}`;
  document.getElementById('shipping-total').textContent = `$${shipping.toFixed(2)}`;
  document.getElementById('tax-total').textContent = `$${tax.toFixed(2)}`;
  document.getElementById('order-total').textContent = `$${orderTotal.toFixed(2)}`;
}

// Handle form submission
function handleCheckout(event) {
  event.preventDefault();
  
  const form = event.target;
  
  // Get form data
  const formData = {
    firstName: form.fname.value,
    lastName: form.lname.value,
    email: form.email.value,
    phone: form.phone.value,
    street: form.street.value,
    city: form.city.value,
    state: form.state.value,
    zip: form.zip.value,
    cardNumber: form.cardNumber.value,
    expiration: form.expiration.value,
    cvv: form.cvv.value
  };
  
  // Get cart
  const cart = getLocalStorage('so-cart') || [];
  
  // Calculate totals (accounting for quantities)
  const itemTotal = cart.reduce((sum, item) => {
    const quantity = item.quantity || 1;
    return sum + ((item.FinalPrice || 0) * quantity);
  }, 0);
  const totalItems = cart.reduce((sum, item) => sum + (item.quantity || 1), 0);
  const shipping = calculateShipping(totalItems);
  const tax = calculateTax(itemTotal);
  const orderTotal = itemTotal + shipping + tax;
  
  // Create order object
  const order = {
    orderId: 'ORD-' + Date.now(),
    date: new Date().toISOString(),
    customer: formData,
    items: cart,
    totals: {
      subtotal: itemTotal,
      shipping: shipping,
      tax: tax,
      total: orderTotal
    }
  };
  
  // Save order to localStorage (in real app, would send to server)
  const orders = getLocalStorage('so-orders') || [];
  orders.push(order);
  setLocalStorage('so-orders', orders);
  
  // Clear cart
  setLocalStorage('so-cart', []);
  updateCartCount();
  
  // Redirect to success page
  window.location.href = 'success.html';
}

// Initialize checkout page
function init() {
  displayOrderSummary();
  
  // Add form submit listener
  const checkoutForm = document.getElementById('checkout-form');
  if (checkoutForm) {
    checkoutForm.addEventListener('submit', handleCheckout);
  }
  
  // Add input formatting for card number
  const cardNumberInput = document.getElementById('cardNumber');
  if (cardNumberInput) {
    cardNumberInput.addEventListener('input', (e) => {
      e.target.value = e.target.value.replace(/\D/g, '').substring(0, 16);
    });
  }
  
  // Add input formatting for expiration
  const expirationInput = document.getElementById('expiration');
  if (expirationInput) {
    expirationInput.addEventListener('input', (e) => {
      let value = e.target.value.replace(/\D/g, '');
      if (value.length >= 2) {
        value = value.substring(0, 2) + '/' + value.substring(2, 4);
      }
      e.target.value = value;
    });
  }
  
  // Add input formatting for CVV
  const cvvInput = document.getElementById('cvv');
  if (cvvInput) {
    cvvInput.addEventListener('input', (e) => {
      e.target.value = e.target.value.replace(/\D/g, '').substring(0, 4);
    });
  }
  
  // Add input formatting for zip
  const zipInput = document.getElementById('zip');
  if (zipInput) {
    zipInput.addEventListener('input', (e) => {
      e.target.value = e.target.value.replace(/\D/g, '').substring(0, 5);
    });
  }
}

// Run initialization when DOM is loaded
init();
