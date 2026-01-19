// At the beginning of your cart rendering function
export function renderCartContents() {
  const cartItems = JSON.parse(localStorage.getItem('cart')) || [];
  
  if (!cartItems || cartItems.length === 0) {
    document.querySelector('.product-list').innerHTML = 
      '<p class="empty-cart">Your cart is empty. <a href="../index.html">Continue shopping</a></p>';
    document.querySelector('.cart-footer').style.display = 'none';
    return;
  }
  
  // Rest of your cart rendering code...
}