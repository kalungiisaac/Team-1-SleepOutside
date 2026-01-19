// At the beginning of your cart rendering function
export async function renderCartContents() {
  const { getCart, removeFromCart, updateQty } = await import('./utils.mjs');
  const cartItems = getCart();

  const listEl = document.querySelector('.product-list');
  const footer = document.querySelector('.cart-footer');
  const cartLink = document.querySelector('.cart a');

  if (!cartItems || cartItems.length === 0) {
    if (listEl) listEl.innerHTML = '<p class="empty-cart">Your cart is empty. <a href="../index.html">Continue shopping</a></p>';
    if (footer) footer.style.display = 'none';
    // update cart badge
    if (cartLink) cartLink.textContent = 'Cart (0)';
    return;
  }

  const rows = cartItems.map(item => `
    <li class="cart-item" data-id="${item.id}">
      <img src="${item.img || ''}" alt="${item.name || ''}" />
      <div class="cart-item__info">
        <h3>${item.name || ''}</h3>
        <p>Price: $${(item.price || 0).toFixed(2)}</p>
        <p>
          Quantity: 
          <button class="qty-decrease" data-id="${item.id}">-</button>
          <span class="qty-value">${item.qty || 1}</span>
          <button class="qty-increase" data-id="${item.id}">+</button>
        </p>
        <button class="remove-from-cart">Remove</button>
      </div>
    </li>
  `).join('');

  if (listEl) listEl.innerHTML = rows;

  // wire up remove buttons
  document.querySelectorAll('.remove-from-cart').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const id = e.currentTarget.closest('.cart-item')?.dataset.id;
      if (!id) return;
      removeFromCart(id);
      renderCartContents();
    });
  });

  // wire up qty controls
  document.querySelectorAll('.qty-increase').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const id = e.currentTarget.dataset.id;
      const span = e.currentTarget.parentElement.querySelector('.qty-value');
      const current = parseInt(span.textContent, 10) || 1;
      const nextQty = current + 1;
      updateQty(id, nextQty);
      renderCartContents();
    });
  });
  document.querySelectorAll('.qty-decrease').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const id = e.currentTarget.dataset.id;
      const span = e.currentTarget.parentElement.querySelector('.qty-value');
      const current = parseInt(span.textContent, 10) || 1;
      const nextQty = current - 1;
      updateQty(id, nextQty);
      renderCartContents();
    });
  });

  // calculate and display total
  const total = cartItems.reduce((sum, item) => sum + (item.price * item.qty), 0);
  if (footer) {
    footer.innerHTML = `<p class="cart-total">Total: $${total.toFixed(2)}</p>`;
    footer.style.display = 'block';
  }

  // update cart badge with total quantity
  const totalQty = cartItems.reduce((s, it) => s + (it.qty || 1), 0);
  if (cartLink) cartLink.textContent = `Cart (${totalQty})`;
}