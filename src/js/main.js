import { loadHeaderFooter, updateCartCount } from './utils.mjs';
import ProductData from './ProductData.mjs';

// Initialize header/footer and cart count
loadHeaderFooter().then(() => {
  updateCartCount();
}).catch(err => console.error('Error loading header/footer:', err));

// Create product card template function
function productCardTemplate(product) {
  const image =
    product.Image ||
    product.Images?.PrimaryMedium ||
    product.Images?.PrimarySmall ||
    product.Images?.PrimaryLarge ||
    '';
  // Handle image URL - use relative path
  let imageUrl = image;
  if (image.startsWith('/')) {
    imageUrl = '.' + image; // Convert /images/... to ./images/...
  } else if (image.startsWith('./')) {
    imageUrl = image; // Already relative
  }
  return `
    <li class="product-card">
      <a href="./product_pages/index.html?category=${product.category}&product=${product.Id}">
        <img src="${imageUrl}" alt="${product.Name}">
        <h2>${product.Brand.Name}</h2>
        <h3>${product.Name}</h3>
        <p class="product-card__price">$${product.FinalPrice}</p>
      </a>
    </li>
  `;
}

// Load featured products on the main page
async function loadFeaturedProducts() {
  const featuredContainer = document.getElementById('featured-products');
  
  if (featuredContainer) {
    try {
      // Load products from multiple categories and take a few from each
      const categories = ['tents', 'backpacks', 'sleeping-bags'];
      let allProducts = [];
      
      for (const category of categories) {
        const dataSource = new ProductData(category);
        const products = await dataSource.getData();
        if (products && products.length > 0) {
          // Add category to each product
          products.forEach(p => p.category = category);
          allProducts = allProducts.concat(products.slice(0, 2)); // Take first 2 from each category
        }
      }
      
      // Take first 4 products for featured section
      const featured = allProducts.slice(0, 4);
      
      // Render the products
      if (featured.length > 0) {
        const htmlStrings = featured.map(productCardTemplate);
        featuredContainer.innerHTML = htmlStrings.join('');
      } else {
        featuredContainer.innerHTML = '<li>No products found</li>';
      }
    } catch (error) {
      console.error('Error loading featured products:', error);
      featuredContainer.innerHTML = '<li>Error loading products</li>';
    }
  }
}

loadFeaturedProducts();
