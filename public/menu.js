// Jiyun Choi

const toCents = (n) => Math.round(Number(n || 0) * 100);
const money = (cents) => (Number(cents || 0) / 100).toFixed(2);
let lastTotals = { subtotal: 0, tax: 0, total: 0 };

let menu = [];
let cart = new Map();

function notify(msg) {
  if (typeof window !== "undefined" && typeof window.showToast === "function") {
    window.showToast(msg);
  } else {
    alert(msg);
  }
}

const menuGrid = document.getElementById("menuGrid");
const cartList = document.getElementById("cartList");
const subtotalEl = document.getElementById("subtotal");
const taxEl = document.getElementById("tax");
const totalEl = document.getElementById("total");
const checkoutBtn = document.getElementById("checkoutBtn");

const searchInput = document.getElementById("search");
const categorySelect = document.getElementById("category");
const veganOnlyCheckbox = document.getElementById("veganOnly");

async function loadMenu() {
  try {
    const res = await fetch("/api/menu");
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    menu = (Array.isArray(data) ? data : []).map((m) => ({ ...m, id: String(m.id) }));
  } catch (err) {
    console.error("menu load failed:", err);
    menuGrid.textContent = "Couldn't load menu. Please try again.";
  }
}

function applyFilters(list) {
  const q = (searchInput.value || "").trim().toLowerCase();
  const sel = (categorySelect.value || "").toLowerCase();
  const veganOnly = !!veganOnlyCheckbox.checked;

  return (list || []).filter(({ name = "", description = "", category = "", vegan }) => {
    const text = (name + " " + description).toLowerCase();
    const hit = !q || text.includes(q);
    const catOk = !sel || String(category || "").toLowerCase() === sel;
    const veganOk = !veganOnly || vegan === true;
    return hit && catOk && veganOk;
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
        <strong>$${money(toCents(m.price))}</strong>
        <button class="add">Add</button>
      </div>
    `;
    el.querySelector(".add").onclick = () => addToCart(m.id, m.price, m.name);
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

  cart.forEach(({ qty }, id) => {
    const item = menu.find((m) => m.id === id);
    if (!item) return;

    const li = document.createElement("li");
    li.className = "cart-row";
    const itemTotalCents = toCents(item.price) * qty;

    li.innerHTML = `
      <span class="cart-name">${item.name}</span>
      <div class="cart-qty">
        <button class="dec" aria-label="decrease">−</button>
        <span>${qty}</span>
        <button class="inc" aria-label="increase">+</button>
      </div>
      <span class="cart-price">$${money(itemTotalCents)}</span>
      <button class="remove" aria-label="remove">✕</button>
    `;

    li.querySelector(".dec").onclick = () => changeQty(id, -1);
    li.querySelector(".inc").onclick = () => changeQty(id, +1);
    li.querySelector(".remove").onclick = () => removeFromCart(id);

    cartList.appendChild(li);
  });

  updateTotals();
}

async function addToCart(id, price, name) {
  const priceCents = toCents(price);
  if (!Number.isInteger(priceCents) || priceCents <= 0) {
    return notify("Invalid price data.");
  }
  try {
    const data = await requestJSON("/api/cart/add", {
      id,
      name,
      qty: 1,
      priceCents
    });
    cart = mapFromArrayPairs(data.cart);
    lastTotals = data.totals || lastTotals;
    renderCart();
  } catch (err) {
    console.error("addToCart failed:", err);
  }
}

async function changeQty(id, delta) {
  const current = cart.get(id)?.qty || 0;
  const next = current + delta;

  if (next <= 0) {
    return removeFromCart(id);
  }
  if (!Number.isInteger(next) || next <= 0) {
    return notify("Quantity must be at least 1.");
  }

  try {
    const data = await requestJSON("/api/cart/setQty", { id, qty: next });
    cart = mapFromArrayPairs(data.cart);
    lastTotals = data.totals || lastTotals;
    renderCart();
  } catch (err) {
    console.error("changeQty failed:", err);
  }
}

async function removeFromCart(id) {
  try {
    const data = await requestJSON("/api/cart/remove", { id });
    cart = mapFromArrayPairs(data.cart);
    lastTotals = data.totals || lastTotals;
    renderCart();
  } catch (err) {
    console.error("removeFromCart failed:", err);
  }
}

function updateTotals() {
  const t = lastTotals;
  subtotalEl.textContent = `$${money(t.subtotal)}`;
  taxEl.textContent = `$${money(t.tax)}`;
  totalEl.textContent = `$${money(t.total)}`;
  checkoutBtn.disabled = cart.size === 0;
}

async function requestJSON(url, body) {
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body || {})
  });
  let data = {};
  try {
    data = await res.json();
  } catch (err) {
    console.debug("No JSON body for", url, err);
    data = {};
  }
  if (!res.ok) {
    const msg = data.error || `Request failed: ${res.status}`;
    notify(msg);
    throw new Error(msg);
  }
  return data;
}

function mapFromArrayPairs(pairs) {
  const m = new Map();
  (pairs || []).forEach(([k, v]) => m.set(k, v));
  return m;
}

function validateSearch(value) {
  const v = String(value || "").trim();

  // limit excessive search length (prevent long-string DoS or malformed input)
  if (v.length > 30) return "Search is too long.";

  // block MongoDB operators to prevent NoSQL injection
  const bannedNoSQL = /(\$ne|\$gt|\$lt|\$regex|\$where|\$or|\$and|\$exists|\$in|\$nin)/i;

  // block HTML/JavaScript tags to prevent XSS injection
  const bannedXSS = /[<>]/;

  // block general code or query manipulation patterns
  const bannedGeneric = /(;|--|['"`])/;

  if (bannedNoSQL.test(v)) return "Please avoid NoSQL operators or special characters in search.";
  if (bannedXSS.test(v)) return "HTML tags are not allowed.";
  if (bannedGeneric.test(v)) return "Please avoid special characters in search.";

  return "";
}


function bindEvents() {
  searchInput.addEventListener("input", () => {
    const err = validateSearch(searchInput.value);
    if (err) {
      notify(err);
      searchInput.value = "";
      renderMenu(menu);
      return;
    }
    renderMenu(applyFilters(menu));
  });
  categorySelect.addEventListener("change", () => renderMenu(applyFilters(menu)));
  veganOnlyCheckbox.addEventListener("change", () => renderMenu(applyFilters(menu)));
  checkoutBtn.addEventListener("click", async () => {
  try {
    const res = await fetch("/api/orders", { method: "POST" });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Order failed");
    window.location.href = `/checkout?orderId=${encodeURIComponent(data.orderId)}`;
  } catch (e) {
    notify(e.message);
  }
});
}

document.addEventListener("DOMContentLoaded", async () => {
  bindEvents();
  await loadMenu();
  renderMenu(applyFilters(menu));
  renderCart();
});
