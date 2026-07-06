
const CART_KEY = 'neychurlava_cart';

function getCart() {
  try { return JSON.parse(localStorage.getItem(CART_KEY) || '[]'); }
  catch { return []; }
}

function saveCart(cart) {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
  updateCartBadge();
}

function addToCart(id, name, price, emoji) {
  const cart = getCart();
  const idx  = cart.findIndex(i => i.id == id);
  if (idx >= 0) {
    cart[idx].qty++;
  } else {
    cart.push({ id, name, price: parseFloat(price), emoji, qty: 1 });
  }
  saveCart(cart);
  renderCartDrawer();
  flashBtn(id);
}

function removeFromCart(id) {
  saveCart(getCart().filter(i => i.id != id));
  renderCartDrawer();
}

function changeQty(id, delta) {
  const cart = getCart();
  const idx  = cart.findIndex(i => i.id == id);
  if (idx < 0) return;
  cart[idx].qty += delta;
  if (cart[idx].qty <= 0) { cart.splice(idx, 1); }
  saveCart(cart);
  renderCartDrawer();
}

function clearCart() { localStorage.removeItem(CART_KEY); updateCartBadge(); }

function cartTotal() {
  return getCart().reduce((s, i) => s + i.price * i.qty, 0);
}

function cartCount() {
  return getCart().reduce((s, i) => s + i.qty, 0);
}

function updateCartBadge() {
  const n = cartCount();
  document.querySelectorAll('.c-cart-badge').forEach(el => {
    el.textContent = n;
    el.style.display = n > 0 ? 'flex' : 'none';
  });
}

function openCart()  {
  document.getElementById('cartDrawer').classList.add('open');
  document.getElementById('cartOverlay').classList.add('open');
  renderCartDrawer();
}
function closeCart() {
  document.getElementById('cartDrawer').classList.remove('open');
  document.getElementById('cartOverlay').classList.remove('open');
}

function renderCartDrawer() {
  const cart  = getCart();
  const el    = document.getElementById('cartItems');
  if (!el) return;
  if (cart.length === 0) {
    el.innerHTML = `<div class="cart-empty">
      <div class="ce-icon">🛒</div>
      <p>Your cart is empty.<br>Add items from the menu!</p>
    </div>`;
  } else {
    el.innerHTML = cart.map(i => `
      <div class="cart-item">
        <div class="ci-emoji">${i.emoji}</div>
        <div class="ci-info">
          <div class="ci-name">${i.name}</div>
          <div class="ci-price">₱${i.price.toFixed(2)} each</div>
        </div>
        <div class="ci-qty">
          <button class="qty-btn" onclick="changeQty(${i.id},-1)">−</button>
          <span class="qty-num">${i.qty}</span>
          <button class="qty-btn" onclick="changeQty(${i.id},1)">+</button>
        </div>
        <div class="oi-sub">₱${(i.price*i.qty).toFixed(2)}</div>
      </div>`).join('');
  }
  const totalEl = document.getElementById('cartTotalAmt');
  if (totalEl) totalEl.textContent = '₱' + cartTotal().toFixed(2);
  updateCartBadge();
}

function flashBtn(id) {
  const btn = document.querySelector(`[data-item-id="${id}"]`);
  if (!btn) return;
  btn.style.background = '#22C55E';
  btn.textContent = '✓';
  setTimeout(() => { btn.style.background = ''; btn.textContent = '+'; }, 700);
}

document.addEventListener('DOMContentLoaded', () => {
  updateCartBadge();
  renderCartDrawer();
});
