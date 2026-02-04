import { setLocalStorage, getLocalStorage, updateCartCount } from './utils.mjs';

function productDetailsTemplate(product) {
  const image =
    product.Images?.PrimaryLarge ||
    product.Images?.PrimaryMedium ||
    product.Image ||
    '';
  // Handle image URL - use relative path from product_pages folder
  let imageUrl = image;
  if (image.startsWith('/')) {
    imageUrl = '..' + image; // Convert /images/... to ../images/...
  } else if (image.startsWith('./')) {
    imageUrl = '../' + image.slice(2); // Convert ./images/... to ../images/...
  }
  
  // Calculate discount percentage if there's a price difference
  const originalPrice = product.SuggestedRetailPrice || product.ListPrice;
  const finalPrice = product.FinalPrice;
  let discountBadge = '';
  let priceDisplay = `<p class="product-card__price">$${finalPrice.toFixed(2)}</p>`;
  
  if (originalPrice && originalPrice > finalPrice) {
    const discountPercent = Math.round(((originalPrice - finalPrice) / originalPrice) * 100);
    discountBadge = `<span class="discount-badge discount-badge--large">${discountPercent}% OFF</span>`;
    priceDisplay = `
      <p class="product-card__price">
        <span class="original-price">$${originalPrice.toFixed(2)}</span>
        <span class="final-price">$${finalPrice.toFixed(2)}</span>
        <span class="savings">You save $${(originalPrice - finalPrice).toFixed(2)}</span>
      </p>`;
  }
  
  return `
    <div class="product-detail-container">
      <h3 class="product-brand">${product.Brand.Name}</h3>
      <h2 class="product-name divider">${product.NameWithoutBrand}</h2>
      <div class="product-image-container">
        ${discountBadge}
        <img
          class="product-image divider"
          src="${imageUrl}"
          alt="${product.NameWithoutBrand}"
        />
      </div>
      ${priceDisplay}
      <p class="product__color"><strong>Color:</strong> ${product.Colors[0].ColorName}</p>
      <div class="product__description">
        ${product.DescriptionHtmlSimple}
      </div>
      <div class="product-detail__add">
        <button id="addToCart" data-id="${product.Id}">Add to Cart</button>
      </div>
    </div>
  `;
}

export default class ProductDetails {
  constructor(productId, dataSource) {
    this.productId = productId;
    this.product = {};
    this.dataSource = dataSource;
    console.log('ProductDetails created for ID:', productId);
  }

  async init() {
    console.log('ProductDetails.init() called');
    
    try {
      // Show loading state
      const detailElement = document.querySelector('.product-detail');
      if (detailElement) {
        detailElement.innerHTML = '<div class="loading">Loading product details...</div>';
      }
      
      // Get product details
      console.log('Fetching product data...');
      this.product = await this.dataSource.findProductById(this.productId);
      console.log('Product data received:', this.product);
      
      if (!this.product) {
        throw new Error('Product not found - null response');
      }
      
      // Render product details
      console.log('Rendering product details...');
      this.renderProductDetails();
      
      // Add event listener to "Add to Cart" button
      const addButton = document.getElementById('addToCart');
      if (addButton) {
        console.log('Add to cart button found, attaching listener');
        addButton.addEventListener('click', this.addToCart.bind(this));
      } else {
        console.error('Add to cart button not found!');
      }
        
    } catch (error) {
      console.error('Error in ProductDetails.init():', error);
      const detailElement = document.querySelector('.product-detail');
      if (detailElement) {
        detailElement.innerHTML = `
          <div class="error">
            <h2>Error Loading Product</h2>
            <p>Sorry, we couldn't load this product.</p>
            <p>Error: ${error.message}</p>
            <a href="../index.html">Return to home</a>
          </div>
        `;
      }
    }
  }

  addToCart() {
    console.log('Adding product to cart:', this.product);
    
    try {
      // Get existing cart or create empty array
      let cart = getLocalStorage('so-cart') || [];
      console.log('Current cart:', cart);
      
      // Check if product already exists in cart
      const existingIndex = cart.findIndex(item => item.Id === this.product.Id);
      
      if (existingIndex !== -1) {
        // Product exists, increase quantity
        cart[existingIndex].quantity = (cart[existingIndex].quantity || 1) + 1;
        console.log('Increased quantity for existing item:', cart[existingIndex]);
      } else {
        // New product, add with quantity 1
        const productWithQuantity = { ...this.product, quantity: 1 };
        cart.push(productWithQuantity);
        console.log('Added new item to cart:', productWithQuantity);
      }
      
      console.log('Updated cart:', cart);
      
      // Save back to localStorage
      setLocalStorage('so-cart', cart);
      
      // Update cart count in header
      updateCartCount();
      
      // Show confirmation
      const button = document.getElementById('addToCart');
      if (button) {
        const originalText = button.textContent;
        button.textContent = '✓ Added to Cart!';
        button.style.background = '#5cb85c';
        
        setTimeout(() => {
          button.textContent = originalText;
          button.style.background = '';
        }, 2000);
      }
      
    } catch (error) {
      console.error('Error adding to cart:', error);
      alert('Error adding product to cart. Please try again.');
    }
  }

  renderProductDetails() {
    console.log('Rendering product details...');
    const element = document.querySelector('.product-detail');
    
    if (!element) {
      console.error('Product detail element not found!');
      return;
    }
    
    console.log('Product detail element found, inserting HTML');
    element.innerHTML = productDetailsTemplate(this.product);
    console.log('Product details rendered successfully');
  }
}