import { loadHeaderFooter, getParam, updateCartCount } from "./utils.mjs";
import ProductData from "./ProductData.mjs";
import ProductDetails from "./ProductDetails.mjs";

loadHeaderFooter().then(() => {
  updateCartCount();
}).catch(err => console.error('Error loading header/footer:', err));

const category = getParam("category") || document.body.dataset.category || 'tents';
const productId = getParam("product") || document.body.dataset.product;

if (category && productId) {
  const dataSource = new ProductData(category);
  const productDetails = new ProductDetails(productId, dataSource);
  productDetails.init();
}
