/* ==========================================================================
   SHEO Client Controller - Dynamic Features
   ========================================================================== */

// --------------------------------------------------------------------------
// 1. Data Store
// --------------------------------------------------------------------------

const products = [
  {
    id: 1,
    name: "SHEO Hyperion Run",
    category: "Athletic",
    price: 149.99,
    oldPrice: 189.99,
    rating: 4.8,
    reviews: 128,
    image: "assets/best-running-shoes-india.png",
    colors: ["#7c3aed", "#10b981", "#ffffff"],
    badge: "30% OFF",
    desc: "Experience ultimate speed and comfort with the Hyperion Run. Built with carbon fiber plate technology and reactive foam cushioning for explosive energy return."
  },
  {
    id: 2,
    name: "SHEO Retro Classic",
    category: "Casual",
    price: 109.99,
    oldPrice: null,
    rating: 4.6,
    reviews: 85,
    image: "assets/best-walking-shoes-india.png",
    colors: ["#f1f1f6", "#d1d5db", "#b5a642"],
    badge: "New Arrival",
    desc: "The Retro Classic blends standard heritage court-side styling with premium, sustainable leather panels. Versatile enough for any daily outfit."
  },
  {
    id: 3,
    name: "SHEO Apex Court",
    category: "Athletic",
    price: 169.99,
    oldPrice: 199.99,
    rating: 4.9,
    reviews: 210,
    image: "assets/best-sports-shoes-india.png",
    colors: ["#f43f5e", "#000000", "#ffffff"],
    badge: "Best Seller",
    desc: "Dominate the hardwood. The Apex Court delivers ankle stability, locked-in midfoot fit, and high-impact bounce cushions for high flyers."
  },
  {
    id: 4,
    name: "SHEO Urban Walker",
    category: "Casual",
    price: 89.99,
    oldPrice: 119.99,
    rating: 4.5,
    reviews: 62,
    image: "assets/best-walking-shoes-india.png",
    colors: ["#0b0b0f", "#374151"],
    badge: "Hot Deal",
    desc: "Designed for the modern nomad, the Urban Walker features a slip-resistant rubber outsole and a breathable, knit upper for all-day comfort."
  },
  {
    id: 5,
    name: "SHEO Glide Running",
    category: "Athletic",
    price: 129.99,
    oldPrice: null,
    rating: 4.7,
    reviews: 94,
    image: "assets/best-running-shoes-india.png",
    colors: ["#06b6d4", "#7c3aed"],
    badge: null,
    desc: "Glide smoothly through your long-distance routes. Features high-mileage durable outsole and responsive midsole pods."
  },
  {
    id: 6,
    name: "SHEO Sovereign Oxford",
    category: "Premium",
    price: 249.99,
    oldPrice: 299.99,
    rating: 4.9,
    reviews: 45,
    image: "assets/best-walking-shoes-india.png",
    colors: ["#b5a642", "#000000"],
    badge: "Premium Store",
    desc: "Handcrafted Italian leather dress shoes. A perfect blend of heritage craftsmanship and modern comfort sole inserts."
  }
];

const blogPosts = [
  {
    id: 1,
    title: "How to Properly Clean and Protect Your Sneakers",
    category: "Care",
    date: "June 15, 2026",
    readTime: "5 min read",
    image: "assets/best-walking-shoes-india.png",
    desc: "Keep your kicks looking brand new. We outline the complete steps, from cleaning suede to protecting knits from water damage and mud."
  },
  {
    id: 2,
    title: "Running Shoe Guide: Finding Your Perfect Fit",
    category: "Guides",
    date: "May 28, 2026",
    readTime: "8 min read",
    image: "assets/best-running-shoes-india.png",
    desc: "Pronation, drop height, and foam densities explained. Learn how to select the right running shoes tailored to your specific biomechanics."
  },
  {
    id: 3,
    title: "Sneaker Styling: Transitioning from Day to Night",
    category: "Style",
    date: "April 14, 2026",
    readTime: "4 min read",
    image: "assets/best-sports-shoes-india.png",
    desc: "Sneakers are no longer just for the gym. Learn how to style premium athletic shoes with tailored trousers and casual suits."
  }
];

// --------------------------------------------------------------------------
// 2. Cart Operations (State Management)
// --------------------------------------------------------------------------

let cart = JSON.parse(localStorage.getItem('sheo_cart')) || [];

function saveCart() {
  localStorage.setItem('sheo_cart', JSON.stringify(cart));
  updateCartBadge();
  renderCartItems();
}

function updateCartBadge() {
  const badges = document.querySelectorAll('.cart-badge-count');
  const totalCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  
  badges.forEach(badge => {
    badge.innerText = totalCount;
    if (totalCount > 0) {
      badge.style.display = 'flex';
    } else {
      badge.style.display = 'none';
    }
  });
}

function addToCart(productId, size, color, quantity = 1) {
  const product = products.find(p => p.id === parseInt(productId));
  if (!product) return;

  const existingItemIndex = cart.findIndex(item => 
    item.product.id === product.id && 
    item.size === size && 
    item.color === color
  );

  if (existingItemIndex > -1) {
    cart[existingItemIndex].quantity += quantity;
  } else {
    cart.push({
      product,
      size,
      color,
      quantity
    });
  }

  saveCart();
  showCartDrawer(true);
}

function removeFromCart(index) {
  cart.splice(index, 1);
  saveCart();
}

function changeQuantity(index, delta) {
  cart[index].quantity += delta;
  if (cart[index].quantity <= 0) {
    cart.splice(index, 1);
  }
  saveCart();
}

function renderCartItems() {
  const container = document.getElementById('cart-items-container');
  const summarySubtotal = document.getElementById('cart-subtotal');
  const summaryTotal = document.getElementById('cart-total');
  
  if (!container) return;
  
  if (cart.length === 0) {
    container.innerHTML = `
      <div class="cart-empty">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
        </svg>
        <p>Your shopping cart is empty.</p>
        <button class="btn btn--secondary" onclick="showCartDrawer(false)">Continue Shopping</button>
      </div>
    `;
    if (summarySubtotal) summarySubtotal.innerText = "$0.00";
    if (summaryTotal) summaryTotal.innerText = "$0.00";
    return;
  }

  let subtotal = 0;
  container.innerHTML = cart.map((item, index) => {
    const itemTotal = item.product.price * item.quantity;
    subtotal += itemTotal;
    return `
      <div class="cart-item">
        <div class="cart-item__img-container">
          <img src="${item.product.image}" alt="${item.product.name}" class="cart-item__img">
        </div>
        <div class="cart-item__details">
          <h4 class="cart-item__title">${item.product.name}</h4>
          <span class="cart-item__options">Size: ${item.size} | Color: <span style="display:inline-block; width:10px; height:10px; border-radius:50%; background:${item.color}; border:1px solid #888; margin-left:3px; vertical-align:middle;"></span></span>
          <span class="cart-item__price">$${item.product.price.toFixed(2)}</span>
        </div>
        <div class="cart-item__actions">
          <div class="quantity-selector">
            <button class="quantity-btn" onclick="changeQuantity(${index}, -1)">-</button>
            <span class="quantity-val">${item.quantity}</span>
            <button class="quantity-btn" onclick="changeQuantity(${index}, 1)">+</button>
          </div>
          <button class="cart-item__remove" onclick="removeFromCart(${index})">
            <svg xmlns="http://www.w3.org/2000/svg" style="width:14px; height:14px;" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
            Remove
          </button>
        </div>
      </div>
    `;
  }).join('');

  if (summarySubtotal) summarySubtotal.innerText = `$${subtotal.toFixed(2)}`;
  if (summaryTotal) summaryTotal.innerText = `$${subtotal.toFixed(2)}`;
}

function showCartDrawer(show) {
  const drawer = document.getElementById('cart-drawer');
  const backdrop = document.getElementById('cart-backdrop');
  if (drawer && backdrop) {
    if (show) {
      drawer.classList.add('cart-drawer--open');
      backdrop.classList.add('cart-backdrop--active');
    } else {
      drawer.classList.remove('cart-drawer--open');
      backdrop.classList.remove('cart-backdrop--active');
    }
  }
}

// --------------------------------------------------------------------------
// 3. Theme Handler (Dark / Light)
// --------------------------------------------------------------------------

function initTheme() {
  const toggleBtn = document.getElementById('theme-toggle');
  if (!toggleBtn) return;
  
  const savedTheme = localStorage.getItem('sheo_theme') || 'dark';
  document.documentElement.setAttribute('data-theme', savedTheme);
  updateThemeIcon(savedTheme);

  toggleBtn.addEventListener('click', () => {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('sheo_theme', newTheme);
    updateThemeIcon(newTheme);
  });
}

function updateThemeIcon(theme) {
  const toggleBtn = document.getElementById('theme-toggle');
  if (!toggleBtn) return;
  
  if (theme === 'light') {
    // Show Moon Icon for light theme (meaning clicking turns to dark)
    toggleBtn.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" style="width:20px; height:20px;" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
        <path stroke-linecap="round" stroke-linejoin="round" d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z" />
      </svg>
    `;
  } else {
    // Show Sun Icon for dark theme
    toggleBtn.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" style="width:20px; height:20px;" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
        <path stroke-linecap="round" stroke-linejoin="round" d="M12 3v2.25m0 13.5V21m8.966-8.966h-2.25m-13.5 0H3m14.364-7.364l-1.591 1.591M6.82 17.18l-1.591 1.591m12.94 0l-1.591-1.591M6.82 6.82L5.23 5.23M12 7.5a4.5 4.5 0 110 9 4.5 4.5 0 010-9z" />
      </svg>
    `;
  }
}

// --------------------------------------------------------------------------
// 4. Countdown Timer (Limited Time Deals)
// --------------------------------------------------------------------------

function initCountdown() {
  const countdownEl = document.querySelector('.countdown');
  if (!countdownEl) return;

  // Set target date to 24 hours from current session launch
  let targetDate = localStorage.getItem('sheo_deal_target');
  if (!targetDate) {
    targetDate = new Date().getTime() + (24 * 60 * 60 * 1000); // 24 hours
    localStorage.setItem('sheo_deal_target', targetDate);
  } else {
    targetDate = parseInt(targetDate);
    // If expired, reset it
    if (new Date().getTime() > targetDate) {
      targetDate = new Date().getTime() + (24 * 60 * 60 * 1000);
      localStorage.setItem('sheo_deal_target', targetDate);
    }
  }

  function updateTimer() {
    const now = new Date().getTime();
    const distance = targetDate - now;

    if (distance < 0) {
      clearInterval(timerInterval);
      return;
    }

    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    const hrEl = document.getElementById('timer-hours');
    const minEl = document.getElementById('timer-minutes');
    const secEl = document.getElementById('timer-seconds');

    if (hrEl) hrEl.innerText = hours.toString().padStart(2, '0');
    if (minEl) minEl.innerText = minutes.toString().padStart(2, '0');
    if (secEl) secEl.innerText = seconds.toString().padStart(2, '0');
  }

  updateTimer();
  const timerInterval = setInterval(updateTimer, 1000);
}

// --------------------------------------------------------------------------
// 5. Visual Shoe Customizer Toggle
// --------------------------------------------------------------------------

function initCustomizer() {
  const visual = document.getElementById('customizer-visual');
  const swatches = document.querySelectorAll('.customizer .swatch');
  
  if (!visual || swatches.length === 0) return;

  swatches.forEach(swatch => {
    swatch.addEventListener('click', () => {
      swatches.forEach(s => s.classList.remove('swatch--active'));
      swatch.classList.add('swatch--active');
      const hue = swatch.dataset.color;
      visual.setAttribute('data-hue', hue);
    });
  });
}

// --------------------------------------------------------------------------
// 6. Quick View Product Modal
// --------------------------------------------------------------------------

let activeModalProduct = null;
let selectedSize = "9";
let selectedColor = "";

function openQuickView(productId) {
  const modal = document.getElementById('quickview-modal');
  const product = products.find(p => p.id === parseInt(productId));
  
  if (!modal || !product) return;
  
  activeModalProduct = product;
  selectedColor = product.colors[0]; // Default to first color
  selectedSize = "9"; // Default size

  // Render elements in modal
  document.getElementById('modal-brand').innerText = product.category;
  document.getElementById('modal-title').innerText = product.name;
  document.getElementById('modal-image').src = product.image;
  document.getElementById('modal-image').alt = product.name;
  document.getElementById('modal-price').innerText = `$${product.price.toFixed(2)}`;
  
  const oldPriceEl = document.getElementById('modal-price-old');
  if (product.oldPrice) {
    oldPriceEl.innerText = `$${product.oldPrice.toFixed(2)}`;
    oldPriceEl.style.display = 'inline-block';
  } else {
    oldPriceEl.style.display = 'none';
  }
  
  document.getElementById('modal-desc').innerText = product.desc;
  
  // Render Star Rating
  const starsContainer = document.getElementById('modal-stars');
  starsContainer.innerHTML = Array.from({length: 5}, (_, i) => {
    const fill = i < Math.floor(product.rating) ? 'currentColor' : 'none';
    return `
      <svg xmlns="http://www.w3.org/2000/svg" fill="${fill}" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" style="width:16px; height:16px;">
        <path stroke-linecap="round" stroke-linejoin="round" d="M11.48 3.499c.195-.583 1.026-.583 1.22 0l2.122 6.356a1 1 0 00.95.69h6.723c.622 0 .88.78.377 1.14l-5.438 3.952a1 1 0 00-.364 1.118l2.122 6.356c.195.583-.466 1.066-.962.724l-5.439-3.952a1 1 0 00-1.17 0l-5.439 3.952c-.496.342-1.157-.141-.962-.724l2.122-6.356a1 1 0 00-.364-1.118L2.244 12.685c-.503-.36-.245-1.14.378-1.14h6.723a1 1 0 00.95-.69l2.12-6.356z" />
      </svg>
    `;
  }).join('');
  document.getElementById('modal-reviews-count').innerText = `(${product.reviews} customer reviews)`;

  // Render Color Pickers
  const colorsContainer = document.getElementById('modal-colors');
  colorsContainer.innerHTML = product.colors.map((color, index) => `
    <button class="swatch ${index === 0 ? 'swatch--active' : ''}" data-color="${color}" onclick="selectModalColor(this, '${color}')">
      <span class="swatch__color" style="background:${color};"></span>
    </button>
  `).join('');

  // Size buttons activation reset
  const sizeButtons = document.querySelectorAll('.size-grid .size-btn');
  sizeButtons.forEach(btn => {
    btn.classList.remove('size-btn--active');
    if (btn.innerText === selectedSize) {
      btn.classList.add('size-btn--active');
    }
  });

  // Open Modal
  modal.classList.add('modal--open');
}

function selectModalColor(element, color) {
  const swatches = document.querySelectorAll('#modal-colors .swatch');
  swatches.forEach(s => s.classList.remove('swatch--active'));
  element.classList.add('swatch--active');
  selectedColor = color;
}

function selectModalSize(sizeVal) {
  selectedSize = sizeVal.toString();
  const sizeButtons = document.querySelectorAll('.size-grid .size-btn');
  sizeButtons.forEach(btn => {
    btn.classList.remove('size-btn--active');
    if (btn.innerText === selectedSize) {
      btn.classList.add('size-btn--active');
    }
  });
}

function closeQuickView() {
  const modal = document.getElementById('quickview-modal');
  if (modal) {
    modal.classList.remove('modal--open');
  }
}

function addActiveProductToCart() {
  if (activeModalProduct) {
    addToCart(activeModalProduct.id, selectedSize, selectedColor, 1);
    closeQuickView();
  }
}

// --------------------------------------------------------------------------
// 7. Product Catalog Filter & Render Logic
// --------------------------------------------------------------------------

let activeCategory = "All";
let maxPrice = 300;
let searchQuery = "";
let sortBy = "featured";

function renderProductsGrid() {
  const grid = document.getElementById('products-grid');
  if (!grid) return;

  // Filter
  const filtered = products.filter(product => {
    const matchesCategory = activeCategory === "All" || product.category === activeCategory;
    const matchesPrice = product.price <= maxPrice;
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          product.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesPrice && matchesSearch;
  });

  // Sort
  if (sortBy === "price-low") {
    filtered.sort((a, b) => a.price - b.price);
  } else if (sortBy === "price-high") {
    filtered.sort((a, b) => b.price - a.price);
  } else if (sortBy === "rating") {
    filtered.sort((a, b) => b.rating - a.rating);
  } else {
    // Featured/default sort by ID
    filtered.sort((a, b) => a.id - b.id);
  }

  // Update counts
  const countEl = document.getElementById('products-count');
  if (countEl) countEl.innerText = `${filtered.length} products found`;

  if (filtered.length === 0) {
    grid.innerHTML = `
      <div style="grid-column: 1/-1; text-align: center; padding: 48px; color: var(--text-muted);">
        <p style="font-size:18px; margin-bottom:12px;">No products match your filters.</p>
        <button class="btn btn--secondary" onclick="resetFilters()">Reset Filters</button>
      </div>
    `;
    return;
  }

  grid.innerHTML = filtered.map((product, idx) => {
    const starMarkup = Array.from({length: 5}, (_, i) => {
      const fill = i < Math.floor(product.rating) ? 'currentColor' : 'none';
      return `<svg xmlns="http://www.w3.org/2000/svg" fill="${fill}" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M11.48 3.499c.195-.583 1.026-.583 1.22 0l2.122 6.356a1 1 0 00.95.69h6.723c.622 0 .88.78.377 1.14l-5.438 3.952a1 1 0 00-.364 1.118l2.122 6.356c.195.583-.466 1.066-.962.724l-5.439-3.952a1 1 0 00-1.17 0l-5.439 3.952c-.496.342-1.157-.141-.962-.724l2.122-6.356a1 1 0 00-.364-1.118L2.244 12.685c-.503-.36-.245-1.14.378-1.14h6.723a1 1 0 00.95-.69l2.12-6.356z" /></svg>`;
    }).join('');

    const badges = product.badge ? `<span class="product-card__badge product-card__badge--deal">${product.badge}</span>` : '';
    const oldPriceMarkup = product.oldPrice ? `<span class="product-card__price--old">$${product.oldPrice.toFixed(2)}</span>` : '';
    const colorDots = product.colors.map(color => `<span class="product-card__color-dot" style="background:${color};"></span>`).join('');

    return `
      <div class="product-card" style="animation-delay: ${idx * 0.1}s">
        <div class="product-card__badge-container">${badges}</div>
        <button class="product-card__wishlist icon-btn" onclick="toggleWishlist(this)">
          <svg xmlns="http://www.w3.org/2000/svg" style="width:18px; height:18px;" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
        </button>
        <div class="product-card__img-container">
          <img src="${product.image}" alt="${product.name}" class="product-card__img">
          <div class="product-card__actions-overlay">
            <button class="product-card__overlay-btn product-card__overlay-btn--cart" onclick="addToCart(${product.id}, '9', '${product.colors[0]}')">
              <svg xmlns="http://www.w3.org/2000/svg" style="width:16px; height:16px;" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007z" />
              </svg>
              Add to Cart
            </button>
            <button class="product-card__overlay-btn product-card__overlay-btn--view" onclick="openQuickView(${product.id})">
              Quick View
            </button>
          </div>
        </div>
        <div class="product-card__info">
          <span class="product-card__category">${product.category}</span>
          <h3 class="product-card__title" onclick="openQuickView(${product.id})">${product.name}</h3>
          <div class="product-card__rating">
            <div class="stars">${starMarkup}</div>
            <span class="product-card__rating-text">${product.rating} (${product.reviews})</span>
          </div>
          <div class="product-card__footer">
            <div class="product-card__price-container">
              <span class="product-card__price">$${product.price.toFixed(2)}</span>
              ${oldPriceMarkup}
            </div>
            <div class="product-card__colors">${colorDots}</div>
          </div>
        </div>
      </div>
    `;
  }).join('');
}

function initCatalogFilters() {
  const searchInput = document.getElementById('catalog-search');
  const priceInput = document.getElementById('price-range-slider');
  const priceValueLabel = document.getElementById('price-slider-value');
  const sortSelect = document.getElementById('catalog-sort');
  
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      searchQuery = e.target.value;
      renderProductsGrid();
    });
  }

  if (priceInput) {
    priceInput.addEventListener('input', (e) => {
      maxPrice = parseFloat(e.target.value);
      if (priceValueLabel) priceValueLabel.innerText = `$${maxPrice}`;
      renderProductsGrid();
    });
  }

  if (sortSelect) {
    sortSelect.addEventListener('change', (e) => {
      sortBy = e.target.value;
      renderProductsGrid();
    });
  }

  // Bind category button actions
  const catButtons = document.querySelectorAll('.filter-pill-btn');
  catButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      catButtons.forEach(b => b.classList.remove('filter-pill-btn--active'));
      btn.classList.add('filter-pill-btn--active');
      activeCategory = btn.dataset.category;
      renderProductsGrid();
    });
  });
}

function resetFilters() {
  activeCategory = "All";
  maxPrice = 300;
  searchQuery = "";
  sortBy = "featured";

  const searchInput = document.getElementById('catalog-search');
  if (searchInput) searchInput.value = "";

  const priceInput = document.getElementById('price-range-slider');
  if (priceInput) priceInput.value = 300;

  const priceValueLabel = document.getElementById('price-slider-value');
  if (priceValueLabel) priceValueLabel.innerText = "$300";

  const sortSelect = document.getElementById('catalog-sort');
  if (sortSelect) sortSelect.value = "featured";

  const catButtons = document.querySelectorAll('.filter-pill-btn');
  catButtons.forEach(btn => {
    btn.classList.remove('filter-pill-btn--active');
    if (btn.dataset.category === "All") {
      btn.classList.add('filter-pill-btn--active');
    }
  });

  renderProductsGrid();
}

function toggleWishlist(button) {
  button.classList.toggle('icon-btn--active');
  const svg = button.querySelector('svg');
  if (button.classList.contains('icon-btn--active')) {
    svg.style.fill = 'var(--secondary-color)';
    svg.style.stroke = 'var(--secondary-color)';
    button.style.borderColor = 'var(--secondary-color)';
  } else {
    svg.style.fill = 'none';
    svg.style.stroke = 'currentColor';
    button.style.borderColor = '';
  }
}

// --------------------------------------------------------------------------
// 8. Blog Filter & Render Logic
// --------------------------------------------------------------------------

let activeBlogTag = "All";
let blogSearchQuery = "";

function renderBlogPosts() {
  const grid = document.getElementById('blog-posts-grid');
  if (!grid) return;

  const filtered = blogPosts.filter(post => {
    const matchesTag = activeBlogTag === "All" || post.category === activeBlogTag;
    const matchesSearch = post.title.toLowerCase().includes(blogSearchQuery.toLowerCase()) || 
                          post.desc.toLowerCase().includes(blogSearchQuery.toLowerCase());
    return matchesTag && matchesSearch;
  });

  if (filtered.length === 0) {
    grid.innerHTML = `
      <div style="grid-column: 1/-1; text-align: center; padding: 48px; color: var(--text-muted);">
        <p>No article matching your criteria found.</p>
      </div>
    `;
    return;
  }

  grid.innerHTML = filtered.map(post => `
    <article class="blog-card">
      <div class="blog-card__img-container">
        <img src="${post.image}" alt="${post.title}" class="blog-card__img">
      </div>
      <div class="blog-card__content">
        <span class="blog-card__tag">${post.category}</span>
        <h3 class="blog-card__title">${post.title}</h3>
        <p class="blog-card__desc">${post.desc}</p>
        <div class="blog-card__footer">
          <div class="blog-meta">
            <div class="blog-meta__item">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span>${post.date}</span>
            </div>
            <div class="blog-meta__item">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>${post.readTime}</span>
            </div>
          </div>
        </div>
      </div>
    </article>
  `).join('');
}

function initBlogFilters() {
  const searchInput = document.getElementById('blog-search');
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      blogSearchQuery = e.target.value;
      renderBlogPosts();
    });
  }

  const tagButtons = document.querySelectorAll('.blog-tag-btn');
  tagButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      tagButtons.forEach(b => b.classList.remove('filter-pill-btn--active'));
      btn.classList.add('filter-pill-btn--active');
      activeBlogTag = btn.dataset.tag;
      renderBlogPosts();
    });
  });
}

// --------------------------------------------------------------------------
// 9. Sticky Header shrink & mobile menu toggle
// --------------------------------------------------------------------------

function initHeaderScroll() {
  const header = document.getElementById('header');
  if (!header) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 20) {
      header.classList.add('header--scrolled');
    } else {
      header.classList.remove('header--scrolled');
    }
  });
}

// --------------------------------------------------------------------------
// 10. Global Initialization
// --------------------------------------------------------------------------

document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  initHeaderScroll();
  saveCart(); // Initial badge counts and drawer render
  
  // URL Param checking for category presets
  const urlParams = new URLSearchParams(window.location.search);
  const categoryParam = urlParams.get('category');
  if (categoryParam) {
    activeCategory = categoryParam;
    
    const catButtons = document.querySelectorAll('.filter-pill-btn');
    if (catButtons.length > 0) {
      catButtons.forEach(btn => {
        btn.classList.remove('filter-pill-btn--active');
        if (btn.dataset.category === categoryParam) {
          btn.classList.add('filter-pill-btn--active');
        }
      });
    }
  }
  
  // Page specific check
  initCountdown(); // Home Page countdown
  initCustomizer(); // Home Page customization display
  
  initCatalogFilters(); // Catalog filters listeners
  renderProductsGrid(); // Catalog grid rendering
  
  initBlogFilters(); // Blog filters listeners
  renderBlogPosts(); // Blog grid rendering

  // Close modal on escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeQuickView();
      showCartDrawer(false);
    }
  });
  
  // Newsletter Form Submit validation message
  const newsletterForm = document.getElementById('newsletter-form');
  if (newsletterForm) {
    newsletterForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const input = newsletterForm.querySelector('input');
      if (input && input.value.trim() !== '') {
        alert(`Thank you for subscribing! Deals will be sent to ${input.value}.`);
        input.value = '';
      }
    });
  }
});
