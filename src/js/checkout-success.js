import { loadHeaderFooter, getLocalStorage, updateCartCount } from './utils.mjs';

loadHeaderFooter().then(() => {
  updateCartCount();
}).catch(err => console.error('Error loading header/footer:', err));

// Get the most recent order
function getLastOrder() {
  const orders = getLocalStorage('so-orders') || [];
  if (orders.length === 0) {
    return null;
  }
  return orders[orders.length - 1];
}

// Calculate estimated delivery date (5-7 business days)
function getEstimatedDelivery() {
  const today = new Date();
  let businessDays = 0;
  const deliveryStart = new Date(today);
  const deliveryEnd = new Date(today);
  
  // Add 5 business days for start
  while (businessDays < 5) {
    deliveryStart.setDate(deliveryStart.getDate() + 1);
    if (deliveryStart.getDay() !== 0 && deliveryStart.getDay() !== 6) {
      businessDays++;
    }
  }
  
  // Add 2 more for end (7 total)
  businessDays = 0;
  deliveryEnd.setTime(deliveryStart.getTime());
  while (businessDays < 2) {
    deliveryEnd.setDate(deliveryEnd.getDate() + 1);
    if (deliveryEnd.getDay() !== 0 && deliveryEnd.getDay() !== 6) {
      businessDays++;
    }
  }
  
  const options = { weekday: 'short', month: 'short', day: 'numeric' };
  return `${deliveryStart.toLocaleDateString('en-US', options)} - ${deliveryEnd.toLocaleDateString('en-US', options)}`;
}

// Display order details
function displayOrderSuccess() {
  const order = getLastOrder();
  
  if (!order) {
    // No order found, redirect to home
    document.querySelector('.success-container').innerHTML = `
      <div class="no-order">
        <h2>No Order Found</h2>
        <p>It looks like you haven't placed an order yet.</p>
        <a href="../index.html" class="btn btn-primary">Start Shopping</a>
      </div>
    `;
    return;
  }
  
  // Display order info
  document.getElementById('order-id').textContent = order.orderId;
  document.getElementById('order-date').textContent = new Date(order.date).toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
  document.getElementById('customer-email').textContent = order.customer.email;
  
  // Display shipping address
  const address = `${order.customer.street}, ${order.customer.city}, ${order.customer.state} ${order.customer.zip}`;
  document.getElementById('shipping-address').textContent = address;
  
  // Display estimated delivery
  document.getElementById('delivery-date').textContent = getEstimatedDelivery();
  
  // Display order items
  const itemsContainer = document.getElementById('success-items');
  const itemsHTML = order.items.map(item => {
    const rawImage = item.Images?.PrimarySmall || item.Images?.PrimaryMedium || item.Image || '';
    const img = rawImage.startsWith('./') ? rawImage.replace('./', '/') : rawImage;
    const name = item.Name || item.NameWithoutBrand || 'Product';
    const price = item.FinalPrice || 0;
    
    return `
      <li class="success-item">
        <img src="${img}" alt="${name}" class="success-item-image" />
        <div class="success-item-details">
          <span class="item-name">${name}</span>
          <span class="item-price">$${price.toFixed(2)}</span>
        </div>
      </li>
    `;
  }).join('');
  
  itemsContainer.innerHTML = itemsHTML;
  
  // Display totals
  document.getElementById('success-subtotal').textContent = `$${order.totals.subtotal.toFixed(2)}`;
  document.getElementById('success-shipping').textContent = `$${order.totals.shipping.toFixed(2)}`;
  document.getElementById('success-tax').textContent = `$${order.totals.tax.toFixed(2)}`;
  document.getElementById('success-total').textContent = `$${order.totals.total.toFixed(2)}`;
}

// Initialize
displayOrderSuccess();
