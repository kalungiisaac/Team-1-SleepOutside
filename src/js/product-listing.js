import { loadHeaderFooter, getParam, updateCartCount } from "./utils.mjs";
import ProductData from "./ProductData.mjs";
import ProductList from "./ProductList.mjs";

loadHeaderFooter().then(() => {
  updateCartCount();
}).catch(err => console.error('Error loading header/footer:', err));

const category = getParam("category") || 'tents';
const dataSource = new ProductData(category);
const element = document.querySelector(".product-list");

// Update the page title based on category
const categoryTitle = document.querySelector(".products h2");
if (categoryTitle) {
  // Format category name for display (e.g., "sleeping-bags" -> "Sleeping Bags")
  const formattedCategory = category
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
  categoryTitle.textContent = `Top ${formattedCategory}`;
}

if (element) {
  const listing = new ProductList(category, dataSource, element);
  listing.init();
}