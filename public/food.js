let MENU = [];
let CART = new Map();

const TAX_RATE = 0.10;

const menuGrid = document.getElementById("menuGrid");
const cartList = document.getElementById("cartList");
const subtotalEl = document.getElementById("subtotal");
const taxEl = document.getElementById("tax");
const totalEl = document.getElementById("total");
const checkoutBtn = document.getElementById("checkoutBtn");

const searchInput = document.getElementById("searchInput");
const categorySelect = document.getElementById("categorySelect");
const veganOnlyCheckbox = document.getElementById("veganOnly");

async function loadMenu() {
  try {
    const res = await fetch("/api/menu");
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    MENU = await res.json();
    renderMenu(applyFilters(MENU));
  } catch (err) {
    console.error("Failed to load menu data:", err);
    menuGrid.innerHTML = `<p style="color:#b00">Failed to load menu. Please check the server and the <code>data/menu.json</code> file location.</p>`;
  }
}

function renderMenu(items) {
  menuGrid.innerHTML = "";
  if (!items || items.length === 0) {
    menuGrid.innerHTML = `<p>No menu items available.</p>`;
    return;
  }

  items.forEach(m => {
    const el = document.createElement("article");
    el.className = "card";
    el.innerHTML = `
      <img src="${m.image || ""}" alt="${m.name}">
      <h3>${m.name}</h3>
      <p>${m.description || ""}</p>
      <div class="price-row">
        <strong>$${Number(m.price).toFixed(2)}</strong>
        <button class="add">Add</button>
      </div>`;
    el.querySelector(".add").onclick = () => addToCart(m.id);
    menuGrid.appendChild(el);
  });
}

function renderCart() {
  cartList.innerHTML = "";

  if (CART.size === 0) {
    const li = document.createElement("li");
    li.textContent = "Your cart is empty";
    cartList.appendChild(li);
    updateTotals();
    return;
  }

  CART.forEach((qty, id) => {
    const item = MENU.find(m => m.id === id);
    if (!item) return;

    const li = document.createElement("li");
    li.className = "cart-row";

    const itemTotal = item.price * qty;
    li.innerHTML = `
      <span class="cart-name">${item.name}</span>
      <div class="cart-qty">
        <button class="dec" aria-label="decrease">−</button>
        <span>${qty}</span>
        <button class="inc" aria-label="increase">+</button>
      </div>
      <span class="cart-price">$${itemTotal.toFixed(2)}</span>
      <button class="remove" aria-label="remove">✕</button>
    `;

    li.querySelector(".dec").onclick = () => changeQty(id, -1);
    li.querySelector(".inc").onclick = () => changeQty(id, +1);
    li.querySelector(".remove").onclick = () => removeFromCart(id);

    cartList.appendChild(li);
  });

  updateTotals();
}

function addToCart(id) {
  const current = CART.get(id) || 0;
  CART.set(id, current + 1);
  renderCart();
}

function changeQty(id, delta) {
  const current = CART.get(id) || 0;
  const next = current + delta;
  if (next <= 0) {
    CART.delete(id);
  } else {
    CART.set(id, next);
  }
  renderCart();
}

function removeFromCart(id) {
  CART.delete(id);
  renderCart();
}

function updateTotals() {
  let subtotal = 0;
  CART.forEach((qty, id) => {
    const item = MENU.find(m => m.id === id);
    if (item) subtotal += item.price * qty;
  });
  const tax = subtotal * TAX_RATE;
  const total = subtotal + tax;

  subtotalEl.textContent = `$${subtotal.toFixed(2)}`;
  taxEl.textContent = `$${tax.toFixed(2)}`;
  totalEl.textContent = `$${total.toFixed(2)}`;

  checkoutBtn.disabled = CART.size === 0;
}

function applyFilters(items) {
  const q = (searchInput?.value || "").trim().toLowerCase();
  const cat = (categorySelect?.value || "All");
  const veganOnly = !!veganOnlyCheckbox?.checked;

  return items.filter(m => {
    const nameHit = !q || m.name.toLowerCase().includes(q) || (m.description || "").toLowerCase().includes(q);
    const catHit = cat === "All" || (m.category === cat);
    const veganHit = !veganOnly || !!m.vegan;
    return nameHit && catHit && veganHit;
  });
}

function onFilterChange() {
  renderMenu(applyFilters(MENU));
}

function wireEvents() {
  searchInput?.addEventListener("input", onFilterChange);
  categorySelect?.addEventListener("change", onFilterChange);
  veganOnlyCheckbox?.addEventListener("change", onFilterChange);

  checkoutBtn?.addEventListener("click", () => {
    alert("Checkout flow is not implemented in this demo.");
  });
}

document.addEventListener("DOMContentLoaded", () => {
  wireEvents();
  loadMenu();           
  renderCart();         
});
