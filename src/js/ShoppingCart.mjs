import { renderListWithTemplate } from './utils.mjs';

function cartItemTemplate(item) {
    return `<li class="cart-card divider">
    <a href="#" class="cart-card__image">
      <img
        src="${item.Image}"
        alt="${item.Name}"
      />
    </a>
    <a href="#">
      <h2 class="card__name">${item.Name}</h2>
    </a>
    <p class="cart-card__color">${item.Colors[0].ColorName}</p>
    <p class="cart-card__quantity">qty: 1</p>
    <p class="cart-card__price">$${item.FinalPrice}</p>
  </li>`;
}

export default class ShoppingCart {
    constructor(cartItems, listElement) {
        this.cartItems = cartItems;
        this.listElement = listElement;
    }

    async init() {
        this.renderCart(this.cartItems);
    }

    renderCart(list) {
        renderListWithTemplate(cartItemTemplate, this.listElement, list);
    }
}
