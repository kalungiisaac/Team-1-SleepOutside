// ProductData.mjs - Handles fetching product data

function convertToJson(res) {
  if (res.ok) {
    return res.json();
  } else {
    throw new Error(`Bad Response: ${res.status}`);
  }
}

export default class ProductData {
  constructor(category) {
    this.category = category;
    // Use relative path that works from any page
    this.path = `${this.getBasePath()}json/${this.category}.json`;
  }
  
  getBasePath() {
    // Determine base path based on current location
    const path = window.location.pathname;
    if (path.includes('/cart/') || path.includes('/checkout/') || 
        path.includes('/product_listing/') || path.includes('/product_pages/')) {
      return '../';
    }
    return './';
  }
  
  getData() {
    return fetch(this.path)
      .then(convertToJson)
      .then((data) => {
        // Handle different JSON structures
        // Some files have products in a 'Result' array, others are direct arrays
        if (Array.isArray(data)) {
          return data;
        } else if (data.Result && Array.isArray(data.Result)) {
          return data.Result;
        }
        return [];
      });
  }
  async findProductById(id) {
    try {
      const products = await this.getData();
      return products.find(item => item.Id === id);
    } catch (error) {
      console.error('Error fetching product:', error);
      return null;
    }
  }
}