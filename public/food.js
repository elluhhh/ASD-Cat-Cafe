let menu = [];
let cart = new Map();

const TAX_RATE = 0.10;

const menuGrid = document.getElementById("menuGrid");
const cartList = document.getElementById("cartList");
const subtotalEl = document.getElementById("subtotal");
const taxEl = document.getElementById("tax");
const totalEl = document.getElementById("total");
const checkoutBtn = document.getElementById("checkoutBtn");

const searchInput = document.getElementById("search");
const categorySelect = document.getElementById("category");
const veganOnlyCheckbox = document.getElementById("veganOnly");

const money = n => (Number(n) || 0).toFixed(2);

async function loadMenu() {
  try {
    const res = await fetch("/api/menu");
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    menu = Array.isArray(data) ? data : [];
  } catch (err) {
    console.error("menu load failed:", err);
    menuGrid.textContent = "Couldn't load menu. Please try again.";
  }
}

function applyFilters(list) {
  const q = (searchInput.value || "").trim().toLowerCase();
  const cat = categorySelect.value;
  const veganOnly = veganOnlyCheckbox.checked;

  return (list || []).filter(({ name = "", description = "", category, vegan }) => {
    const hit = (name + " " + description).toLowerCase().includes(q || "");
    const catOk = !cat || category === cat;
    const veganOk = !veganOnly || vegan === true;
    return (!q || hit) && catOk && veganOk;
  });
}

function renderMenu(items) {
  menuGrid.innerHTML = "";
  if (!items || items.length === 0) {
    menuGrid.innerHTML = `<p>No menu items available.</p>`;
    return;
  }

  for (const m of items) {
    const el = document.createElement("article");
    el.className = "card";
    el.innerHTML = `
      <img src="${m.image || ""}" alt="${m.name}">
      <h3>${m.name}</h3>
      <p>${m.description || ""}</p>
      <div class="price-row">
        <strong>$${money(m.price)}</strong>
        <button class="add">Add</button>
      </div>
    `;
    el.querySelector(".add").onclick = () => addToCart(m.id);
    menuGrid.appendChild(el);
  }
}

function renderCart() {
  cartList.innerHTML = "";

  if (cart.size === 0) {
    const li = document.createElement("li");
    li.textContent = "Your cart is empty";
    cartList.appendChild(li);
    updateTotals();
    return;
  }

  cart.forEach((qty, id) => {
    const item = menu.find(m => m.id === id);
    if (!item) return;

    const li = document.createElement("li");
    li.className = "cart-row";
    const itemTotal = (Number(item.price) || 0) * qty;

    li.innerHTML = `
      <span class="cart-name">${item.name}</span>
      <div class="cart-qty">
        <button class="dec" aria-label="decrease">−</button>
        <span>${qty}</span>
        <button class="inc" aria-label="increase">+</button>
      </div>
      <span class="cart-price">$${money(itemTotal)}</span>
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
  const current = cart.get(id) || 0;
  cart.set(id, current + 1);
  renderCart();
}

function changeQty(id, delta) {
  const current = cart.get(id) || 0;
  const next = current + delta;
  if (next <= 0) cart.delete(id);
  else cart.set(id, next);
  renderCart();
}

function removeFromCart(id) {
  cart.delete(id);
  renderCart();
}

function updateTotals() {
  let subtotal = 0;
  cart.forEach((qty, id) => {
    const item = menu.find(m => m.id === id);
    if (item) subtotal += (Number(item.price) || 0) * qty;
  });
  const tax = subtotal * TAX_RATE;
  const total = subtotal + tax;

  subtotalEl.textContent = `$${money(subtotal)}`;
  taxEl.textContent = `$${money(tax)}`;
  totalEl.textContent = `$${money(total)}`;

  checkoutBtn.disabled = cart.size === 0;
}

function bindEvents() {
  searchInput.addEventListener("input", () => renderMenu(applyFilters(menu)));
  categorySelect.addEventListener("change", () => renderMenu(applyFilters(menu)));
  veganOnlyCheckbox.addEventListener("change", () => renderMenu(applyFilters(menu)));

  checkoutBtn.addEventListener("click", () => {
    alert("Checkout flow is not implemented in this demo.");
  });
}

document.addEventListener("DOMContentLoaded", async () => {
  bindEvents();
  await loadMenu();
  renderMenu(applyFilters(menu));
  renderCart();
});
