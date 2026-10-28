const image = (id, width = 900) => `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${width}&q=82`;
const initialProducts = [
  { id: "everyday-01", name: "Everyday 01", category: "Sneakers", brand: "StepStyle", price: 98, rating: 4.9, reviews: 248, color: "White", sizes: [6, 7, 8, 9, 10, 11, 12], badge: "Bestseller", newness: 1, image: image("photo-1542291026-7eec264c27ff"), description: "Your go-anywhere, do-anything favorite. Cushioned underfoot with a clean, considered shape." },
  { id: "stride-runner", name: "Stride Runner", category: "Running Shoes", brand: "StepStyle", price: 124, rating: 4.8, reviews: 186, color: "Orange", sizes: [6, 7, 8, 9, 10, 11], badge: "New", newness: 2, image: image("photo-1552674605-db6ffd4facb5"), description: "Easy miles start here. Responsive cushioning and a breathable knit upper keep every run feeling light." },
  { id: "court-classic", name: "Court Classic", category: "Sneakers", brand: "StepStyle", price: 110, rating: 4.9, reviews: 132, color: "White", sizes: [7, 8, 9, 10, 11, 12], badge: "Bestseller", newness: 3, image: image("photo-1525966222134-fcfa99b8ae77"), description: "A little retro, a lot comfortable. The clean low-top that works with just about everything." },
  { id: "terra-walk", name: "Terra Walk", category: "Casual Shoes", brand: "StepStyle", price: 89, rating: 4.7, reviews: 94, color: "Sage", sizes: [6, 7, 8, 9, 10, 11, 12], badge: "Everyday", newness: 4, image: image("photo-1520256862855-398228c41684"), description: "Take the scenic route. A flexible sole and soft lining make long days feel like easy days." },
  { id: "pace-pro", name: "Pace Pro", category: "Sports Shoes", brand: "Northline", price: 145, rating: 4.8, reviews: 76, color: "Blue", sizes: [7, 8, 9, 10, 11], badge: "Performance", newness: 5, image: image("photo-1460353581641-37baddab0fa2"), description: "Made for movement, wherever you find it. Stable support with energy return for your next challenge." },
  { id: "city-loafer", name: "City Loafer", category: "Formal Shoes", brand: "StepStyle", price: 138, rating: 4.6, reviews: 58, color: "Black", sizes: [7, 8, 9, 10, 11, 12], badge: "New", newness: 6, image: image("photo-1614252235316-8c857d38b5f4"), description: "A modern essential with a little polish. Soft leather-look finish and all-day comfort, built in." },
  { id: "sun-day", name: "Sun Day Slide", category: "Sandals", brand: "Dayform", price: 64, rating: 4.7, reviews: 121, color: "Orange", sizes: [6, 7, 8, 9, 10, 11], badge: "Easy days", newness: 7, image: image("photo-1603487742131-4160ec999306"), description: "Slip into the slower side of things. A cushioned footbed makes these your warm-weather favorite." },
  { id: "cloud-knit", name: "Cloud Knit", category: "Running Shoes", brand: "Northline", price: 132, rating: 4.9, reviews: 203, color: "White", sizes: [6, 7, 8, 9, 10, 11, 12], badge: "Top rated", newness: 8, image: image("photo-1495555961986-6d4c1ecb7be3"), description: "Soft, breathable, and ready for wherever. A knit upper and cloud-soft midsole do the most with the least." },
  { id: "weekender", name: "The Weekender", category: "Casual Shoes", brand: "Dayform", price: 105, rating: 4.6, reviews: 67, color: "Black", sizes: [6, 7, 8, 9, 10, 11], badge: "Everyday", newness: 9, image: image("photo-1495555961986-6d4c1ecb7be3") },
  { id: "court-high", name: "Court High", category: "Sports Shoes", brand: "Northline", price: 119, rating: 4.5, reviews: 49, color: "Blue", sizes: [7, 8, 9, 10, 11, 12], badge: "New", newness: 10, image: image("photo-1600185365483-26d7a4cc7519") },
  { id: "soft-step", name: "Soft Step", category: "Sandals", brand: "Dayform", price: 58, rating: 4.6, reviews: 83, color: "Sage", sizes: [6, 7, 8, 9, 10], badge: "Easy days", newness: 11, image: image("photo-1562273138-f46be4ebdf33") },
  { id: "weekday-derby", name: "Weekday Derby", category: "Formal Shoes", brand: "StepStyle", price: 159, rating: 4.8, reviews: 38, color: "Black", sizes: [7, 8, 9, 10, 11, 12], badge: "New", newness: 12, image: image("photo-1614252235316-8c857d38b5f4") }
];
const readStore = (key, fallback) => {
  try { const value = localStorage.getItem(key); return value ? JSON.parse(value) : fallback; }
  catch { return fallback; }
};
let products = readStore("stepstyle-products", initialProducts);
let cart = readStore("stepstyle-cart", []);
let orders = readStore("stepstyle-orders", []);
let account = readStore("stepstyle-account", null);
let activeCategory = "All";
let activeProductId = null;
let editingProductId = null;
let toastTimer;
const grid = document.querySelector("#product-grid");
const overlay = document.querySelector("#overlay");
const dialogContent = document.querySelector("#dialog-content");
const escapeHTML = value => String(value ?? "").replace(/[&<>"']/g, char => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[char]));
const money = amount => `$${Number(amount).toFixed(2)}`;
const persist = () => {
  try {
    localStorage.setItem("stepstyle-products", JSON.stringify(products));
    localStorage.setItem("stepstyle-cart", JSON.stringify(cart));
    localStorage.setItem("stepstyle-orders", JSON.stringify(orders));
    localStorage.setItem("stepstyle-account", JSON.stringify(account));
  } catch {
    showToast("Your browser could not save changes. Check storage settings.");
  }
};
function showToast(message) {
  const toast = document.querySelector("#toast");
  toast.textContent = message;
  toast.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove("show"), 2600);
}
function openDialog(markup) {
  dialogContent.innerHTML = markup;
  overlay.hidden = false;
  document.body.style.overflow = "hidden";
  overlay.querySelector(".dialog-close").focus();
}
function closeDialog() {
  overlay.hidden = true;
  document.body.style.overflow = "";
  activeProductId = null;
}
function renderProducts() {
  const brandFilter = document.querySelector("#brand-filter");
  const selectedBrand = brandFilter.value;
  const brands = [...new Set(products.map(product => product.brand))].sort();
  brandFilter.innerHTML = '<option value="">All brands</option>' + brands.map(brand => `<option value="${escapeHTML(brand)}">${escapeHTML(brand)}</option>`).join("");
  if (brands.includes(selectedBrand)) brandFilter.value = selectedBrand;
  const query = document.querySelector("#product-search").value.trim().toLowerCase();
  const maxPrice = Number(document.querySelector("#price-filter").value);
  const size = document.querySelector("#size-filter").value;
  const color = document.querySelector("#color-filter").value;
  const brand = document.querySelector("#brand-filter").value;
  const sort = document.querySelector("#sort-products").value;
  let visible = products.filter(product =>
    (activeCategory === "All" || product.category === activeCategory) &&
    product.price <= maxPrice &&
    (!size || product.sizes.map(String).includes(size)) &&
    (!color || product.color === color) &&
    (!brand || product.brand === brand) &&
    (!query || `${product.name} ${product.category} ${product.brand} ${product.color}`.toLowerCase().includes(query))
  );
  if (sort === "price-low") visible.sort((a, b) => a.price - b.price);
  if (sort === "price-high") visible.sort((a, b) => b.price - a.price);
  if (sort === "rating") visible.sort((a, b) => b.rating - a.rating);
  if (sort === "newest") visible.sort((a, b) => b.newness - a.newness);
  document.querySelector("#product-count").textContent = `Showing ${visible.length} ${visible.length === 1 ? "pair" : "pairs"}`;
  document.querySelector("#empty-state").hidden = visible.length > 0;
  grid.innerHTML = visible.map(product => `
    <article class="product-card" data-product-id="${escapeHTML(product.id)}" tabindex="0" aria-label="View ${escapeHTML(product.name)} details">
      <div class="product-image-wrap"><img src="${escapeHTML(product.image)}" alt="${escapeHTML(product.name)} shoe" loading="lazy"><span class="product-badge">${escapeHTML(product.badge || "StepStyle")}</span><button class="quick-add" data-quick-add="${escapeHTML(product.id)}" aria-label="Quick add ${escapeHTML(product.name)}">+</button></div>
      <div class="product-info"><div class="product-title-row"><h3 class="product-title">${escapeHTML(product.name)}</h3><span class="product-price">${money(product.price)}</span></div><p class="product-subtitle">${escapeHTML(product.category)} · ${escapeHTML(product.brand)}</p><span class="product-rating">★ <b>${Number(product.rating).toFixed(1)}</b> (${Number(product.reviews)})</span><div class="product-colors" aria-label="${escapeHTML(product.color)}"><span class="color-dot" style="background:${({ White: "#f4f2ec", Black: "#252525", Orange: "#ef7045", Sage: "#93a68d", Blue: "#809cb7" })[product.color] || "#ccc"}"></span><span class="product-subtitle">${escapeHTML(product.color)}</span></div></div>
    </article>`).join("");
}
function updateCartBadge() {
  document.querySelector(".cart-count").textContent = cart.reduce((total, item) => total + item.quantity, 0);
}
function addToCart(id, size = 9) {
  const product = products.find(item => item.id === id);
  if (!product) return;
  if (!product.sizes.map(Number).includes(Number(size))) size = product.sizes[0];
  const existing = cart.find(item => item.id === id && Number(item.size) === Number(size));
  if (existing) existing.quantity += 1;
  else cart.push({ id, size: Number(size), quantity: 1 });
  persist();
  updateCartBadge();
  showToast(`${product.name} added to your bag`);
}
function showProduct(id) {
  const product = products.find(item => item.id === id);
  if (!product) return;
  activeProductId = id;
  const sizes = product.sizes.map(size => `<option value="${escapeHTML(size)}" ${Number(size) === 9 ? "selected" : ""}>US ${escapeHTML(size)}</option>`).join("");
  openDialog(`<div class="detail-layout"><div><img class="detail-main-image" src="${escapeHTML(product.image)}" alt="${escapeHTML(product.name)}"><div class="detail-thumbs"><img src="${escapeHTML(product.image)}" alt="View 1 of ${escapeHTML(product.name)}"><img src="${escapeHTML(product.image)}" alt="View 2 of ${escapeHTML(product.name)}"><img src="${escapeHTML(product.image)}" alt="View 3 of ${escapeHTML(product.name)}"></div></div><div class="detail-copy"><p class="eyebrow">${escapeHTML(product.category)} / ${escapeHTML(product.brand)}</p><h2 id="dialog-title">${escapeHTML(product.name)}</h2><p class="detail-price">${money(product.price)}</p><p>★ ${Number(product.rating).toFixed(1)} · ${Number(product.reviews)} reviews</p><p>${escapeHTML(product.description || "Thoughtfully designed for every step. Comfortable, versatile, and made to be worn on repeat.")}</p><p><strong>Color:</strong> ${escapeHTML(product.color)} &nbsp; · &nbsp; <strong>In stock</strong></p><label for="detail-size" class="visually-hidden">Choose size</label><select class="detail-select" id="detail-size">${sizes}</select><div class="detail-buttons"><button class="button button-dark" data-add-detail="${escapeHTML(product.id)}">Add to bag</button><button class="button button-outline" data-buy-now="${escapeHTML(product.id)}">Buy now ↗</button></div><div class="detail-reviews"><strong>Good things people say</strong><p>“A genuinely comfortable shoe. I wear them everywhere.”<br>— A StepStyle customer</p></div></div></div><h3>Pairs picked for you</h3><p>Explore the collection for more everyday favorites.</p>`);
}
function cartTotals() {
  const subtotal = cart.reduce((sum, item) => sum + (products.find(p => p.id === item.id)?.price || 0) * item.quantity, 0);
  const delivery = subtotal === 0 || subtotal >= 120 ? 0 : 8;
  return { subtotal, delivery, total: subtotal + delivery };
}
function showCart() {
  if (!cart.length) {
    openDialog(`<h2 id="dialog-title">Your bag is taking a breather.</h2><p>Nothing here just yet. Find a pair you love and we'll keep it safe for you.</p><a class="button button-dark" href="#shop" data-close>Explore the collection ↗</a>`);
    return;
  }
  const lines = cart.map((item, index) => {
    const product = products.find(p => p.id === item.id);
    if (!product) return "";
    return `<div class="cart-line"><img src="${escapeHTML(product.image)}" alt="${escapeHTML(product.name)}"><div><h3>${escapeHTML(product.name)}</h3><p>${escapeHTML(product.color)} · US ${escapeHTML(item.size)}</p><div class="quantity-control"><button data-quantity="${index}" data-change="-1" aria-label="Decrease quantity">−</button><span>${item.quantity}</span><button data-quantity="${index}" data-change="1" aria-label="Increase quantity">+</button></div></div><div class="cart-line-end"><strong>${money(product.price * item.quantity)}</strong><button class="remove-item" data-remove="${index}">Remove</button></div></div>`;
  }).join("");
  const totals = cartTotals();
  openDialog(`<p class="eyebrow">Good choice</p><h2 id="dialog-title">Your bag <span style="color:#85867f;font-size:15px">(${cart.reduce((n, i) => n + i.quantity, 0)})</span></h2>${lines}<div class="cart-summary"><div class="summary-row"><span>Subtotal</span><span>${money(totals.subtotal)}</span></div><div class="summary-row"><span>Delivery</span><span>${totals.delivery ? money(totals.delivery) : "Complimentary"}</span></div><div class="summary-row total"><span>Total</span><span>${money(totals.total)}</span></div></div><button class="button button-dark" id="checkout-button" style="width:100%">Continue to checkout ↗</button><p class="form-notice">Demo store: orders are saved only in this browser. No payment will be charged.</p>`);
}
function showCheckout() {
  const totals = cartTotals();
  openDialog(`<p class="eyebrow">Almost there</p><h2 id="dialog-title">Checkout</h2><p>Tell us where to send your new favorite pair.</p><form class="checkout-form" id="checkout-form"><label>First name<input name="firstName" autocomplete="given-name" required></label><label>Last name<input name="lastName" autocomplete="family-name" required></label><label class="wide">Email<input type="email" name="email" autocomplete="email" required></label><label class="wide">Street address<input name="address" autocomplete="street-address" required></label><label>City<input name="city" autocomplete="address-level2" required></label><label>Postal code<input name="postal" autocomplete="postal-code" required></label><label class="wide">Payment method<select name="payment"><option value="cash">Cash on delivery</option><option value="demo-card">Card (demo only — no charge)</option></select></label><div class="summary-row wide"><span>Order total (delivery ${totals.delivery ? money(totals.delivery) : "free"})</span><strong>${money(totals.total)}</strong></div><button class="button button-dark" type="submit">Place demo order ↗</button></form><p class="form-notice">Payments aren't configured. This checkout records a local demo order only; do not enter real card details.</p>`);
}
function showAccount() {
  if (account) {
    const history = orders.length ? orders.map(order => `<div class="order-card"><strong>Order ${escapeHTML(order.id)} · ${money(order.total)}</strong><p>${escapeHTML(order.date)} · ${order.items} item(s) · ${escapeHTML(order.status)}</p></div>`).join("") : "<p>No orders yet. Your next great pair is waiting.</p>";
    openDialog(`<p class="eyebrow">Your StepStyle</p><h2 id="dialog-title">Hello, ${escapeHTML(account.name || account.email.split("@")[0])}.</h2><p>${escapeHTML(account.email)}</p><h3>Your orders</h3>${history}<button class="button button-outline" id="logout-button">Log out</button><p class="form-notice">Demo profile stored in this browser only. Production accounts need a secure server.</p>`);
    return;
  }
  openAccountForm("login");
}
function openAccountForm(mode) {
  const signup = mode === "signup";
  openDialog(`<p class="eyebrow">StepStyle account</p><h2 id="dialog-title">${signup ? "A good fit." : "Welcome back."}</h2><p>${signup ? "Create your demo profile and keep your orders together." : "Sign in to see your profile and orders."}</p><form id="account-form" class="checkout-form">${signup ? '<label class="wide">Name<input name="name" autocomplete="name" required></label>' : ""}<label class="wide">Email<input type="email" name="email" autocomplete="email" required></label><label class="wide">Password<input type="password" name="password" autocomplete="${signup ? "new-password" : "current-password"}" minlength="6" required></label><button class="button button-dark" type="submit">${signup ? "Create demo account" : "Log in"}</button></form><p class="form-notice">Demo only: passwords are never saved. Real authentication requires a secure backend.</p><button class="account-switch" id="account-switch">${signup ? "Already have an account? Log in" : "New here? Create an account"}</button>`);
}
function showAdmin(tab = "products") {
  const revenue = orders.reduce((sum, order) => sum + order.total, 0);
  const tabs = `<div class="admin-tabs"><button data-admin-tab="products" class="${tab === "products" ? "active" : ""}">Products</button><button data-admin-tab="orders" class="${tab === "orders" ? "active" : ""}">Orders</button><button data-admin-tab="stats" class="${tab === "stats" ? "active" : ""}">Overview</button></div>`;
  let content = "";
  if (tab === "products") {
    const rows = products.map(p => `<div class="admin-product-row"><span><strong>${escapeHTML(p.name)}</strong> · ${money(p.price)} · ${escapeHTML(p.category)}</span><span><button data-edit-product="${escapeHTML(p.id)}">Edit</button><button data-delete-product="${escapeHTML(p.id)}">Delete</button></span></div>`).join("");
    content = `<h3>${editingProductId ? "Edit product" : "Add a product"}</h3><form id="admin-form" class="admin-form"><label>Name<input name="name" required></label><label>Category<select name="category">${["Sneakers", "Running Shoes", "Sports Shoes", "Casual Shoes", "Formal Shoes", "Sandals"].map(c => `<option>${c}</option>`).join("")}</select></label><label>Brand<input name="brand" value="StepStyle" required></label><label>Price (USD)<input name="price" type="number" min="1" step="1" required></label><label>Color<input name="color" value="White" required></label><label>Sizes (comma separated)<input name="sizes" value="6,7,8,9,10,11" required></label><label class="wide">Image URL (https)<input name="image" type="url" placeholder="https://..." required></label><label class="wide">Description<input name="description"></label><button class="button button-dark wide" type="submit">${editingProductId ? "Save changes" : "Add product"}</button></form><h3>Inventory (${products.length})</h3>${rows}`;
  } else if (tab === "orders") {
    content = `<h3>Customer orders (${orders.length})</h3>${orders.length ? orders.map(o => `<div class="admin-product-row"><span><strong>${escapeHTML(o.id)}</strong> · ${escapeHTML(o.customer)} · ${escapeHTML(o.date)}</span><span>${money(o.total)} · ${escapeHTML(o.status)}</span></div>`).join("") : "<p>No demo orders yet.</p>"}`;
  } else {
    content = `<div class="admin-stats"><div class="admin-stat"><strong>${orders.length}</strong><span>DEMO ORDERS</span></div><div class="admin-stat"><strong>${money(revenue)}</strong><span>DEMO SALES</span></div><div class="admin-stat"><strong>${products.length}</strong><span>PRODUCTS</span></div></div><p class="form-notice">Admin data is browser-local and this dashboard is intentionally unauthenticated for demonstration only. Secure roles and shared inventory need a backend.</p>`;
  }
  openDialog(`<p class="eyebrow">Store tools · demo</p><h2 id="dialog-title">Admin dashboard</h2>${tabs}${content}`);
}
function refreshAdmin(tab = "products") {
  editingProductId = null;
  showAdmin(tab);
}
function setCategory(category) {
  activeCategory = category;
  document.querySelectorAll(".category-tab").forEach(button => button.classList.toggle("active", button.dataset.category === category));
  renderProducts();
}
document.addEventListener("click", event => {
  const categoryButton = event.target.closest("[data-category]");
  if (categoryButton) {
    setCategory(categoryButton.dataset.category);
    if (categoryButton.classList.contains("category-card")) document.querySelector("#shop").scrollIntoView({ behavior: "smooth" });
  }
  const navCategory = event.target.closest("[data-nav-category]");
  if (navCategory) setCategory(navCategory.dataset.navCategory);
  const card = event.target.closest(".product-card");
  const quickAdd = event.target.closest("[data-quick-add]");
  if (quickAdd) { event.stopPropagation(); addToCart(quickAdd.dataset.quickAdd); }
  else if (card) showProduct(card.dataset.productId);
  const targetAdd = event.target.closest("[data-add-detail],[data-buy-now]");
  if (targetAdd) {
    const size = document.querySelector("#detail-size")?.value;
    addToCart(targetAdd.dataset.addDetail || targetAdd.dataset.buyNow, size);
    if (targetAdd.hasAttribute("data-buy-now")) showCart();
  }
  if (event.target.closest(".cart-trigger")) showCart();
  if (event.target.closest(".account-trigger")) showAccount();
  if (event.target.closest("#admin-trigger")) showAdmin();
  if (event.target.closest("[data-close]")) closeDialog();
  const quantityButton = event.target.closest("[data-quantity]");
  if (quantityButton) {
    const index = Number(quantityButton.dataset.quantity);
    if (cart[index]) {
      cart[index].quantity += Number(quantityButton.dataset.change);
      if (cart[index].quantity < 1) cart.splice(index, 1);
      persist(); updateCartBadge(); showCart();
    }
  }
  const removeButton = event.target.closest("[data-remove]");
  if (removeButton) {
    cart.splice(Number(removeButton.dataset.remove), 1); persist(); updateCartBadge(); showCart();
  }
  if (event.target.closest("#checkout-button")) showCheckout();
  if (event.target.closest("#account-switch")) openAccountForm(account ? "login" : dialogContent.querySelector("#account-form") ? (dialogContent.querySelector("#account-form").querySelector('[name="name"]') ? "login" : "signup") : "signup");
  if (event.target.closest("#logout-button")) { account = null; persist(); closeDialog(); showToast("You’ve logged out"); }
  const tabButton = event.target.closest("[data-admin-tab]");
  if (tabButton) refreshAdmin(tabButton.dataset.adminTab);
  const editButton = event.target.closest("[data-edit-product]");
  if (editButton) {
    editingProductId = editButton.dataset.editProduct;
    const product = products.find(p => p.id === editingProductId);
    showAdmin("products");
    const form = document.querySelector("#admin-form");
    for (const [key, value] of Object.entries({ name: product.name, category: product.category, brand: product.brand, price: product.price, color: product.color, sizes: product.sizes.join(","), image: product.image, description: product.description || "" })) if (form.elements[key]) form.elements[key].value = value;
  }
  const deleteButton = event.target.closest("[data-delete-product]");
  if (deleteButton) {
    const product = products.find(p => p.id === deleteButton.dataset.deleteProduct);
    if (product && window.confirm(`Delete ${product.name}?`)) {
      products = products.filter(p => p.id !== product.id); cart = cart.filter(item => item.id !== product.id); persist(); updateCartBadge(); showAdmin("products"); showToast("Product deleted");
    }
  }
});
document.querySelector("#product-grid").addEventListener("keydown", event => {
  if ((event.key === "Enter" || event.key === " ") && event.target.matches(".product-card")) { event.preventDefault(); showProduct(event.target.dataset.productId); }
});
document.querySelector("#product-search").addEventListener("input", renderProducts);
document.querySelector("#sort-products").addEventListener("change", renderProducts);
document.querySelector("#price-filter").addEventListener("input", event => { document.querySelector("#price-output").textContent = money(event.target.value); renderProducts(); });
["size-filter", "color-filter", "brand-filter"].forEach(id => document.querySelector(`#${id}`).addEventListener("change", renderProducts));
document.querySelector("#filter-toggle").addEventListener("click", event => {
  const panel = document.querySelector("#filter-panel"); panel.hidden = !panel.hidden;
  event.currentTarget.setAttribute("aria-expanded", String(!panel.hidden));
});
function resetFilters() {
  document.querySelector("#product-search").value = "";
  document.querySelector("#price-filter").value = 220;
  document.querySelector("#price-output").textContent = "$220.00";
  document.querySelector("#size-filter").value = "";
  document.querySelector("#color-filter").value = "";
  document.querySelector("#brand-filter").value = "";
  document.querySelector("#sort-products").value = "featured";
  setCategory("All");
}
document.querySelector("#clear-filters").addEventListener("click", resetFilters);
document.querySelector("#empty-reset").addEventListener("click", resetFilters);
document.querySelector("#search-focus").addEventListener("click", () => { document.querySelector("#product-search").focus(); document.querySelector("#shop").scrollIntoView({ behavior: "smooth" }); });
document.querySelector("#newsletter-form").addEventListener("submit",event=>{
  event.preventDefault();
  document.querySelector(".newsletter-message").textContent="You're on the list — thanks for joining.";
  event.currentTarget.reset();
});
document.querySelector(".menu-toggle").addEventListener("click",event=>{
  const nav = document.querySelector(".main-nav"); const open = nav.classList.toggle("open");
  event.currentTarget.setAttribute("aria-expanded", String(open));
});
document.querySelector(".main-nav").addEventListener("click", event => {
  if (event.target.closest("a")) { document.querySelector(".main-nav").classList.remove("open"); document.querySelector(".menu-toggle").setAttribute("aria-expanded", "false"); }
});
overlay.addEventListener("click", event => { if (event.target === overlay) closeDialog(); });
document.addEventListener("keydown", event => { if (event.key === "Escape" && !overlay.hidden) closeDialog(); });
dialogContent.addEventListener("click", event => {
  const thumb = event.target.closest(".detail-thumbs img");
  if (thumb) document.querySelector(".detail-main-image").src = thumb.src;
});
dialogContent.addEventListener("submit", event => {
  event.preventDefault();
  const form = event.target;
  if (form.id === "checkout-form") {
    if (!cart.length) { showToast("Your bag is empty"); return; }
    const data = new FormData(form); const totals = cartTotals();
    const order = { id: `SS-${Date.now().toString().slice(-7)}`, customer: `${data.get("firstName")} ${data.get("lastName")}`, email: data.get("email"), date: new Date().toLocaleDateString(), total: totals.total, items: cart.reduce((n, i) => n + i.quantity, 0), status: "Demo order", payment: data.get("payment") };
    orders.unshift(order); cart = []; persist(); updateCartBadge();
    openDialog(`<p class="eyebrow">All set</p><h2 id="dialog-title">Thanks, ${escapeHTML(data.get("firstName"))}.</h2><p>Your demo order <strong>${escapeHTML(order.id)}</strong> is saved in this browser. No payment was taken and no shipment was created.</p><button class="button button-dark" data-close>Back to browsing ↗</button>`);
  } else if (form.id === "account-form") {
    const data = new FormData(form);
    if (form.querySelector('[name="name"]')) {
      account = { name: String(data.get("name")).trim(), email: String(data.get("email")).trim() };
    } else if (!account || account.email.toLowerCase() !== String(data.get("email")).toLowerCase()) {
      showToast("Demo account not found. Create an account to continue."); return;
    }
    persist(); showAccount();
  } else if (form.id === "admin-form") {
    const data = new FormData(form);
    const productData = { name: String(data.get("name")).trim(), category: String(data.get("category")), brand: String(data.get("brand")).trim(), price: Number(data.get("price")), color: String(data.get("color")).trim(), sizes: String(data.get("sizes")).split(",").map(value => Number(value.trim())).filter(value => Number.isFinite(value) && value > 0), image: String(data.get("image")).trim(), description: String(data.get("description")).trim(), rating: 4.7, reviews: 0, badge: "New", newness: Date.now() };
    if (!/^https:\/\//i.test(productData.image) || !productData.sizes.length || !Number.isFinite(productData.price) || productData.price <= 0) { showToast("Enter an https image URL, valid sizes, and price."); return; }
    if (editingProductId) { const old = products.find(p => p.id === editingProductId); products = products.map(p => p.id === editingProductId ? { ...old, ...productData } : p); showToast("Product updated"); }
    else { products.unshift({ ...productData, id: `custom-${Date.now()}` }); showToast("Product added"); }
    editingProductId = null; persist(); renderProducts(); showAdmin("products");
  }
});
updateCartBadge();
renderProducts();
