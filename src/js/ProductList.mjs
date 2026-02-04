import { renderListWithTemplate } from './utils.mjs';

function productCardTemplate(product) {
  const image =
    product.Image ||
    product.Images?.PrimaryMedium ||
    product.Images?.PrimarySmall ||
    product.Images?.PrimaryLarge ||
    '';
  // Handle image URL - use relative path from product_listing folder
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
    discountBadge = `<span class="discount-badge">${discountPercent}% OFF</span>`;
    priceDisplay = `
      <p class="product-card__price">
        <span class="original-price">$${originalPrice.toFixed(2)}</span>
        <span class="final-price">$${finalPrice.toFixed(2)}</span>
      </p>`;
  }
  
  return `
    <li class="product-card">
      <a href="../product_pages/index.html?category=${this.category}&product=${product.Id}">
        <div class="product-card__image-container">
          ${discountBadge}
          <img src="${imageUrl}" alt="${product.Name}">
        </div>
        <h2>${product.Brand.Name}</h2>
        <h3>${product.Name}</h3>
        ${priceDisplay}
      </a>
    </li>
  `;
}

export default class ProductList {
  constructor(category, dataSource, listElement) {
    this.category = category;
    this.dataSource = dataSource;
    this.listElement = listElement;
  }

  async init() {
    const list = await this.dataSource.getData();
    this.renderList(list);
  }

  renderList(list) {
    // const htmlStrings = list.map(productCardTemplate);
    // this.listElement.insertAdjacentHTML("afterbegin", htmlStrings.join(""));

    // apply use new utility function instead of the commented code above
    renderListWithTemplate(productCardTemplate.bind(this), this.listElement, list);

  }

}