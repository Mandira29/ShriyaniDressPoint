/**
 * Sriyani Dress Point - Main Application Script
 * Haute Couture Creative Edition
 */

document.addEventListener('DOMContentLoaded', () => {
  initHeroSlider();
  renderProducts('all');
  initProductFilterTabs();
  renderBranches();
  initBranchSearchAndFilter();
  initFlashSaleCountdown();
  initQuickViewModal();
  initSearchAutocomplete();
  initMobileMenu();
  initNewsletterForm();
  initAuthModals();
  initAdminWorkspace();
  initPaymentGatewayListeners();
  initVirtualStylist();
  initVirtualFittingRoom();
  
  // Initialize States
  updateCartUI();
  updateWishlistUI();
  updateAuthUI();
});


/* ==========================================================================
   1. HERO SLIDER LOGIC
   ========================================================================== */
function initHeroSlider() {
  const slides = document.querySelectorAll('.hero-slide');
  const dotsContainer = document.querySelector('.hero-dots');
  const prevBtn = document.querySelector('.hero-nav-prev');
  const nextBtn = document.querySelector('.hero-nav-next');
  
  if (!slides.length) return;

  let currentSlide = 0;
  let slideInterval = null;

  if (dotsContainer) {
    dotsContainer.innerHTML = '';
    slides.forEach((_, idx) => {
      const dot = document.createElement('button');
      dot.className = `hero-dot ${idx === 0 ? 'active' : ''}`;
      dot.setAttribute('aria-label', `Go to slide ${idx + 1}`);
      dot.addEventListener('click', () => goToSlide(idx));
      dotsContainer.appendChild(dot);
    });
  }

  function goToSlide(n) {
    slides[currentSlide].classList.remove('active');
    const dots = document.querySelectorAll('.hero-dot');
    if (dots[currentSlide]) dots[currentSlide].classList.remove('active');

    currentSlide = (n + slides.length) % slides.length;

    slides[currentSlide].classList.add('active');
    if (dots[currentSlide]) dots[currentSlide].classList.add('active');
  }

  function nextSlide() {
    goToSlide(currentSlide + 1);
  }

  function prevSlide() {
    goToSlide(currentSlide - 1);
  }

  if (nextBtn) nextBtn.addEventListener('click', () => {
    nextSlide();
    resetAutoSlide();
  });

  if (prevBtn) prevBtn.addEventListener('click', () => {
    prevSlide();
    resetAutoSlide();
  });

  function startAutoSlide() {
    slideInterval = setInterval(nextSlide, 5500);
  }

  function resetAutoSlide() {
    clearInterval(slideInterval);
    startAutoSlide();
  }

  const sliderContainer = document.querySelector('.hero-slider-wrapper');
  if (sliderContainer) {
    sliderContainer.addEventListener('mouseenter', () => clearInterval(slideInterval));
    sliderContainer.addEventListener('mouseleave', startAutoSlide);
  }

  startAutoSlide();
}

/* ==========================================================================
   2. PRODUCT CATALOG RENDERING & FILTERING (CUSTOMER VIEW)
   ========================================================================== */
function renderProducts(category = 'all') {
  const grid = document.getElementById('productGrid');
  if (!grid) return;

  const catalog = (typeof getProductsCatalog === 'function') ? getProductsCatalog() : PRODUCTS_DATA;

  let filtered = catalog;
  if (category !== 'all') {
    const c = category.toLowerCase();
    if (c === 'sarees') {
      filtered = catalog.filter(p => p.category === 'sarees');
    } else if (c === 'men') {
      filtered = catalog.filter(p => p.category === 'men');
    } else if (c === 'women') {
      filtered = catalog.filter(p => p.category === 'women' || p.category === 'sarees');
    } else if (c === 'kids') {
      filtered = catalog.filter(p => p.category === 'kids');
    } else if (c === 'bridal') {
      filtered = catalog.filter(p => p.category === 'bridal' || p.category === 'sarees');
    }
  }

  grid.innerHTML = filtered.map(product => {
    const isWished = isInWishlist(product.id);
    return `
      <div class="product-card" data-category="${product.category}">
        <div class="product-img-wrapper">
          <img src="${product.image}" alt="${product.name}" class="product-img" loading="lazy" />
          ${product.badge ? `<span class="badge-tag">${product.badge}</span>` : ''}
          <button type="button" class="btn-wishlist ${isWished ? 'active' : ''}" 
                  data-wishlist-id="${product.id}" 
                  onclick="handleWishlistClick(${product.id}, this)" 
                  aria-label="Add to wishlist">
            <i class="${isWished ? 'fa-solid' : 'fa-regular'} fa-heart"></i>
          </button>
          <button type="button" class="btn-quickview" onclick="openQuickView(${product.id})">
            <i class="fa-regular fa-eye"></i> Quick View
          </button>
        </div>
        <div class="product-info">
          <div class="product-meta-top">
            <span class="product-category-label">${product.category.toUpperCase()}</span>
            <div class="product-rating">
              <i class="fa-solid fa-star"></i>
              <span>${product.rating}</span>
              <span class="review-count">(${product.reviews})</span>
            </div>
          </div>
          <h3 class="product-name" onclick="openQuickView(${product.id})">${product.name}</h3>
          <div class="product-pricing">
            <span class="current-price">${formatLKR(product.price)}</span>
            ${product.originalPrice ? `<span class="original-price">${formatLKR(product.originalPrice)}</span>` : ''}
            ${product.discount ? `<span class="discount-pill">${product.discount}</span>` : ''}
          </div>
          <button type="button" class="btn-add-cart" onclick="addToCart(${product.id}, 1)">
            <i class="fa-solid fa-bag-shopping"></i> Add to Bag
          </button>
          <button type="button" class="btn-tryon-card" onclick="openVirtualFittingRoom(${product.id})" title="Try on in 3D Virtual Fitting Room">
            <i class="fa-solid fa-person-dress"></i> Virtual Try-On
          </button>
        </div>
      </div>
    `;
  }).join('');
}

function handleWishlistClick(id, btn) {
  const isNowActive = toggleWishlist(id);
  btn.classList.toggle('active', isNowActive);
  btn.innerHTML = `<i class="${isNowActive ? 'fa-solid' : 'fa-regular'} fa-heart"></i>`;
}

function initProductFilterTabs() {
  const tabs = document.querySelectorAll('.product-filter-btn');
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      const category = tab.getAttribute('data-filter');
      renderProducts(category);
    });
  });
}

function selectCategoryAndScroll(category) {
  const session = getCurrentSession();
  if (!session) {
    showToast("Please sign in or create an account to view this collection!", "info");
    openAuthModal('register');
    return;
  }

  document.querySelectorAll('.product-filter-btn').forEach(btn => {
    if (btn.getAttribute('data-filter') === category) {
      btn.classList.add('active');
    } else {
      btn.classList.remove('active');
    }
  });

  renderProducts(category);
  scrollToSection('collection');
}

/* ==========================================================================
   3. QUICK VIEW MODAL
   ========================================================================== */
let activeQuickViewProduct = null;
let selectedSize = null;
let selectedColor = null;
let currentQuantity = 1;

function initQuickViewModal() {
  const modal = document.getElementById('quickViewModal');
  const closeBtn = document.getElementById('closeQuickView');
  const backdrop = document.getElementById('modalBackdrop');

  if (closeBtn) closeBtn.addEventListener('click', closeQuickView);
  if (backdrop) backdrop.addEventListener('click', closeQuickView);

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeQuickView();
  });
}

function openQuickView(productId) {
  const catalog = (typeof getProductsCatalog === 'function') ? getProductsCatalog() : PRODUCTS_DATA;
  const product = catalog.find(p => p.id === productId);
  if (!product) return;

  activeQuickViewProduct = product;
  selectedSize = product.sizes ? product.sizes[0] : 'Standard';
  selectedColor = product.colors ? product.colors[0] : null;
  currentQuantity = 1;

  const modal = document.getElementById('quickViewModal');
  const backdrop = document.getElementById('modalBackdrop');
  const container = document.getElementById('quickViewContent');

  if (!modal || !container) return;

  container.innerHTML = `
    <div class="qv-grid">
      <div class="qv-gallery">
        <img src="${product.image}" alt="${product.name}" class="qv-main-image" />
        <div class="qv-badges">
          <span class="qv-badge">${product.badge || 'Popular'}</span>
          ${product.discount ? `<span class="qv-discount">${product.discount} OFF</span>` : ''}
        </div>
      </div>
      <div class="qv-details">
        <span class="qv-category">${product.category.toUpperCase()}</span>
        <h2 class="qv-title">${product.name}</h2>
        <div class="qv-rating">
          <span class="stars"><i class="fa-solid fa-star"></i> ${product.rating}</span>
          <span class="reviews">Based on ${product.reviews} customer reviews in Sri Lanka</span>
        </div>
        <div class="qv-price-box">
          <span class="qv-price">${formatLKR(product.price)}</span>
          ${product.originalPrice ? `<span class="qv-original-price">${formatLKR(product.originalPrice)}</span>` : ''}
        </div>
        <p class="qv-description">${product.description}</p>

        ${product.sizes && product.sizes.length ? `
          <div class="qv-option-group">
            <label class="qv-option-label">Select Size: <strong id="qvSelectedSizeName">${selectedSize}</strong></label>
            <div class="qv-size-selector">
              ${product.sizes.map((sz, i) => `
                <button type="button" class="qv-size-btn ${i === 0 ? 'active' : ''}" 
                        onclick="setQuickViewSize('${sz}', this)">
                  ${sz}
                </button>
              `).join('')}
            </div>
          </div>
        ` : ''}

        ${product.colors && product.colors.length ? `
          <div class="qv-option-group">
            <label class="qv-option-label">Available Shades:</label>
            <div class="qv-color-selector">
              ${product.colors.map((clr, i) => `
                <button type="button" class="qv-color-btn ${i === 0 ? 'active' : ''}" 
                        style="background-color: ${clr};" 
                        onclick="setQuickViewColor('${clr}', this)"
                        aria-label="Color shade ${clr}">
                </button>
              `).join('')}
            </div>
          </div>
        ` : ''}

        <div class="qv-actions">
          <div class="qty-stepper qv-stepper">
            <button type="button" onclick="adjustQuickViewQty(-1)"><i class="fa-solid fa-minus"></i></button>
            <span id="qvQtyDisplay">1</span>
            <button type="button" onclick="adjustQuickViewQty(1)"><i class="fa-solid fa-plus"></i></button>
          </div>
          <button type="button" class="btn-primary qv-add-btn" onclick="addQuickViewToCart()">
            <i class="fa-solid fa-bag-shopping"></i> Add to Bag
          </button>
        </div>

        <button type="button" class="btn-tryon-card" style="margin-top: 0.75rem; padding: 0.65rem 1rem; font-size: 0.88rem; background: rgba(225, 29, 72, 0.1); border: 1.5px dashed #E11D48; border-radius: var(--radius-md);" onclick="closeQuickView(); openVirtualFittingRoom(${product.id})">
          <i class="fa-solid fa-person-dress"></i> Try On in 3D Virtual Fitting Room
        </button>

        <div class="qv-delivery-perks">
          <div class="perk-item">
            <i class="fa-solid fa-truck-fast"></i>
            <span>Islandwide Delivery (1-3 Business Days)</span>
          </div>
          <div class="perk-item">
            <i class="fa-solid fa-rotate-left"></i>
            <span>Easy 7-Day Exchange at Any Sriyani Branch</span>
          </div>
          <div class="perk-item">
            <i class="fa-solid fa-shield-halved"></i>
            <span>100% Guaranteed Authentic Fabric</span>
          </div>
        </div>
      </div>
    </div>
  `;

  modal.classList.add('open');
  backdrop.classList.add('open');
  document.body.classList.add('no-scroll');
}

function setQuickViewSize(size, btn) {
  selectedSize = size;
  document.querySelectorAll('.qv-size-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  const label = document.getElementById('qvSelectedSizeName');
  if (label) label.textContent = size;
}

function setQuickViewColor(color, btn) {
  selectedColor = color;
  document.querySelectorAll('.qv-color-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
}

function adjustQuickViewQty(delta) {
  currentQuantity = Math.max(1, currentQuantity + delta);
  const display = document.getElementById('qvQtyDisplay');
  if (display) display.textContent = currentQuantity;
}

function addQuickViewToCart() {
  if (activeQuickViewProduct) {
    addToCart(activeQuickViewProduct.id, currentQuantity, selectedSize, selectedColor);
    closeQuickView();
  }
}

function closeQuickView() {
  const modal = document.getElementById('quickViewModal');
  const backdrop = document.getElementById('modalBackdrop');
  if (modal && backdrop) {
    modal.classList.remove('open');
    backdrop.classList.remove('open');
    document.body.classList.remove('no-scroll');
  }
}

/* ==========================================================================
   4. NEW INTERACTIVE VIRTUAL STYLIST & OCCASION MATCHER
   ========================================================================== */
const STYLIST_OCCASIONS = {
  wedding: {
    title: "Royal Poruwa & Wedding Celebration Ensemble",
    desc: "A timeless handloom silk saree paired with artisan temple jewelry and embroidered velvet.",
    items: [
      { name: "Royal Kanchipuram Silk Saree", type: "Main Attire", price: 18500, image: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=600&q=80", size: "Free Size" },
      { name: "Antique Gold Temple Choker & Jhumkas", type: "Jewelry Piece", price: 6200, image: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=600&q=80", size: "One Size" },
      { name: "Hand-Embroidered Zari Velvet Clutch", type: "Accessory", price: 4800, image: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=600&q=80", size: "Standard" }
    ],
    originalTotal: 29500,
    bundlePrice: 25000,
    savings: "Save LKR 4,500 (15% OFF)"
  },
  festive: {
    title: "Sinhala & Tamil Avurudu Festive Ensemble",
    desc: "Artisan handwoven natural cotton with traditional Sri Lankan batik accents.",
    items: [
      { name: "Contemporary Handloom Cotton Saree", type: "Main Attire", price: 9400, image: "https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=600&q=80", size: "Free Size" },
      { name: "Sri Lankan Handmade Batik Silk Scarf", type: "Heritage Layer", price: 3800, image: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=600&q=80", size: "Standard" },
      { name: "Traditional Brass Lotus Bangle Set", type: "Handmade Ornament", price: 3200, image: "https://images.unsplash.com/photo-1611591475883-94b23838b939?auto=format&fit=crop&w=600&q=80", size: "Free Size" }
    ],
    originalTotal: 16400,
    bundlePrice: 13900,
    savings: "Save LKR 2,500 (15% OFF)"
  },
  corporate: {
    title: "Men's Executive Colombo Boardroom Suite",
    desc: "Tailored 100% European linen shirt with structured wool-blend tuxedo blazer.",
    items: [
      { name: "Classic Men's Pure Linen Formal Shirt", type: "Tailored Shirt", price: 4950, image: "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=600&q=80", size: "L" },
      { name: "Tailored Wool-Blend Tuxedo Suit Blazer", type: "Executive Jacket", price: 19800, image: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=600&q=80", size: "40R" },
      { name: "Woven Silk Necktie & Cufflinks Set", type: "Accessories", price: 3500, image: "https://images.unsplash.com/photo-1598033129183-c4f50c736f10?auto=format&fit=crop&w=600&q=80", size: "Standard" }
    ],
    originalTotal: 28250,
    bundlePrice: 24000,
    savings: "Save LKR 4,250 (15% OFF)"
  },
  resort: {
    title: "Southern Coastline Luxury Sunset Gala",
    desc: "Breezy pastel layered chiffon maxi dress with artisan handmade batik wrap.",
    items: [
      { name: "Elegant Pastel Chiffon Maxi Dress", type: "Designer Gown", price: 6450, image: "https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?auto=format&fit=crop&w=600&q=80", size: "M" },
      { name: "Handmade Batik Silk Resort Shrug", type: "Beach Wrap", price: 5200, image: "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=600&q=80", size: "Free Size" },
      { name: "Pearl Studded Woven Evening Handbag", type: "Footwear & Bag", price: 3400, image: "https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=600&q=80", size: "Standard" }
    ],
    originalTotal: 15050,
    bundlePrice: 12800,
    savings: "Save LKR 2,250 (15% OFF)"
  }
};

let activeStylistKey = 'wedding';

function initVirtualStylist() {
  document.querySelectorAll('.occasion-pill-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.occasion-pill-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      activeStylistKey = btn.getAttribute('data-occasion');
      renderStylistOccasion(activeStylistKey);
    });
  });

  renderStylistOccasion('wedding');
}

function renderStylistOccasion(key) {
  const container = document.getElementById('stylistEnsembleContainer');
  if (!container) return;

  const data = STYLIST_OCCASIONS[key];
  if (!data) return;

  container.innerHTML = `
    <div class="ensemble-pieces-grid">
      ${data.items.map((item, idx) => `
        <div class="ensemble-item">
          <img src="${item.image}" alt="${item.name}" class="ensemble-item-img" />
          <div class="ensemble-item-body">
            <span>Piece 0${idx + 1} • ${item.type}</span>
            <h4>${item.name}</h4>
            <strong>${formatLKR(item.price)}</strong>
          </div>
        </div>
      `).join('')}
    </div>

    <div class="ensemble-bundle-bar">
      <div class="bundle-pricing-wrap">
        <h3>Complete 3-Piece Curated Look</h3>
        <span class="bundle-price">${formatLKR(data.bundlePrice)}</span>
        <span style="text-decoration: line-through; color: #94A3B8; margin-left: 0.5rem;">${formatLKR(data.originalTotal)}</span>
        <span class="bundle-save">${data.savings}</span>
      </div>
      <button type="button" class="btn-gold" onclick="addCompleteLookToBag('${key}')">
        <i class="fa-solid fa-sparkles"></i> Add Complete 3-Piece Look to Bag
      </button>
    </div>
  `;
}

function addCompleteLookToBag(key) {
  const data = STYLIST_OCCASIONS[key];
  if (!data) return;

  data.items.forEach(item => {
    let cart = getCart();
    cart.push({
      id: 900 + Math.floor(Math.random() * 90),
      name: item.name,
      price: Math.round(data.bundlePrice / 3),
      originalPrice: item.price,
      image: item.image,
      size: item.size,
      color: null,
      quantity: 1
    });
    saveCart(cart);
  });

  showToast(`Ensemble added to Bag with 15% Curated Discount! 🎉`, 'success');
  openCartDrawer();
}

/* ==========================================================================
   5. SRI LANKA BRANCH LOCATOR
   ========================================================================== */
function renderBranches(filterQuery = '', filterDistrict = 'all') {
  const container = document.getElementById('branchesContainer');
  const countDisplay = document.getElementById('branchCountDisplay');
  if (!container) return;

  const q = filterQuery.trim().toLowerCase();

  const filtered = BRANCHES_DATA.filter(branch => {
    const matchesSearch = !q || 
      branch.name.toLowerCase().includes(q) ||
      branch.city.toLowerCase().includes(q) ||
      branch.district.toLowerCase().includes(q) ||
      branch.address.toLowerCase().includes(q);

    const matchesDistrict = filterDistrict === 'all' || branch.district.toLowerCase() === filterDistrict.toLowerCase();

    return matchesSearch && matchesDistrict;
  });

  if (countDisplay) {
    countDisplay.textContent = `Showing ${filtered.length} of ${BRANCHES_DATA.length} Showrooms Across Sri Lanka`;
  }

  if (filtered.length === 0) {
    container.innerHTML = `
      <div class="no-branches-found">
        <i class="fa-solid fa-map-location-dot"></i>
        <h3>No Branches Found</h3>
        <p>We couldn't find any showroom matching "${filterQuery}". Please try another town or district.</p>
        <button type="button" class="btn-secondary" onclick="resetBranchFilters()">View All Branches</button>
      </div>
    `;
    return;
  }

  container.innerHTML = filtered.map(branch => `
    <div class="branch-card ${branch.isFlagship ? 'flagship-card' : ''}">
      <div class="branch-header">
        <div class="branch-title-wrap">
          <h3 class="branch-name">${branch.name}</h3>
          <span class="branch-district-tag"><i class="fa-solid fa-location-dot"></i> ${branch.city}, ${branch.district}</span>
        </div>
        ${branch.isFlagship ? '<span class="flagship-badge"><i class="fa-solid fa-crown"></i> Flagship Store</span>' : ''}
      </div>

      <div class="branch-details">
        <div class="detail-row">
          <i class="fa-solid fa-map-pin"></i>
          <span>${branch.address}</span>
        </div>
        <div class="detail-row">
          <i class="fa-solid fa-phone"></i>
          <span><a href="tel:${branch.phone.split('/')[0].trim()}">${branch.phone}</a></span>
        </div>
        <div class="detail-row">
          <i class="fa-regular fa-clock"></i>
          <span>${branch.hours} <small style="color: #10B981; font-weight: 700; margin-left: 0.3rem;">• Open Now</small></span>
        </div>
      </div>

      <div class="branch-features">
        ${branch.features.map(f => `<span class="feature-chip"><i class="fa-solid fa-check"></i> ${f}</span>`).join('')}
      </div>

      <div class="branch-actions">
        <a href="https://maps.google.com/?q=${encodeURIComponent(branch.address)}" 
           target="_blank" 
           rel="noopener noreferrer" 
           class="btn-branch-map">
          <i class="fa-solid fa-diamond-turn-right"></i> Get Directions
        </a>
        <a href="tel:${branch.phone.split('/')[0].trim()}" class="btn-branch-call">
          <i class="fa-solid fa-phone"></i> Call Showroom
        </a>
      </div>
    </div>
  `).join('');
}

function initBranchSearchAndFilter() {
  const searchInput = document.getElementById('branchSearchInput');
  const districtSelect = document.getElementById('branchDistrictSelect');

  if (searchInput) {
    searchInput.addEventListener('input', () => {
      renderBranches(searchInput.value, districtSelect ? districtSelect.value : 'all');
    });
  }

  if (districtSelect) {
    districtSelect.addEventListener('change', () => {
      renderBranches(searchInput ? searchInput.value : '', districtSelect.value);
    });
  }
}

function resetBranchFilters() {
  const searchInput = document.getElementById('branchSearchInput');
  const districtSelect = document.getElementById('branchDistrictSelect');
  if (searchInput) searchInput.value = '';
  if (districtSelect) districtSelect.value = 'all';
  renderBranches('', 'all');
}

/* ==========================================================================
   6. FLASH SALE COUNTDOWN TIMER
   ========================================================================== */
function initFlashSaleCountdown() {
  const targetDate = new Date().getTime() + (3 * 24 * 60 * 60 * 1000) + (18 * 60 * 60 * 1000);

  const daysEl = document.getElementById('timerDays');
  const hoursEl = document.getElementById('timerHours');
  const minsEl = document.getElementById('timerMinutes');
  const secsEl = document.getElementById('timerSeconds');

  function updateTimer() {
    const now = new Date().getTime();
    const distance = targetDate - now;

    if (distance <= 0) {
      if (daysEl) daysEl.textContent = '00';
      if (hoursEl) hoursEl.textContent = '00';
      if (minsEl) minsEl.textContent = '00';
      if (secsEl) secsEl.textContent = '00';
      return;
    }

    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    if (daysEl) daysEl.textContent = String(days).padStart(2, '0');
    if (hoursEl) hoursEl.textContent = String(hours).padStart(2, '0');
    if (minsEl) minsEl.textContent = String(minutes).padStart(2, '0');
    if (secsEl) secsEl.textContent = String(seconds).padStart(2, '0');
  }

  updateTimer();
  setInterval(updateTimer, 1000);
}

/* ==========================================================================
   7. LIVE SEARCH AUTOCOMPLETE
   ========================================================================== */
function initSearchAutocomplete() {
  const searchInput = document.getElementById('headerSearchInput');
  const resultsContainer = document.getElementById('searchResultsDropdown');

  if (!searchInput || !resultsContainer) return;

  searchInput.addEventListener('input', () => {
    const q = searchInput.value.trim().toLowerCase();
    if (q.length < 2) {
      resultsContainer.classList.remove('open');
      resultsContainer.innerHTML = '';
      return;
    }

    const catalog = (typeof getProductsCatalog === 'function') ? getProductsCatalog() : PRODUCTS_DATA;
    const matches = catalog.filter(p => 
      p.name.toLowerCase().includes(q) || 
      p.category.toLowerCase().includes(q) ||
      (p.tag && p.tag.toLowerCase().includes(q))
    ).slice(0, 5);

    if (matches.length === 0) {
      resultsContainer.innerHTML = `
        <div class="search-no-result">No matching fashion items for "${q}"</div>
      `;
    } else {
      resultsContainer.innerHTML = matches.map(item => `
        <div class="search-result-item" onclick="openQuickView(${item.id}); closeSearchDropdown();">
          <img src="${item.image}" alt="${item.name}" class="search-result-thumb" />
          <div class="search-result-details">
            <span class="search-result-name">${item.name}</span>
            <span class="search-result-price">${formatLKR(item.price)}</span>
          </div>
          <span class="search-result-cat">${item.category}</span>
        </div>
      `).join('');
    }

    resultsContainer.classList.add('open');
  });

  document.addEventListener('click', (e) => {
    if (!searchInput.contains(e.target) && !resultsContainer.contains(e.target)) {
      closeSearchDropdown();
    }
  });
}

function closeSearchDropdown() {
  const resultsContainer = document.getElementById('searchResultsDropdown');
  if (resultsContainer) resultsContainer.classList.remove('open');
}

/* ==========================================================================
   8. AUTHENTICATION MODAL & LOGIC
   ========================================================================== */
function initAuthModals() {
  const modal = document.getElementById('authModal');
  const closeBtn = document.getElementById('closeAuthModal');
  const backdrop = document.getElementById('authBackdrop');

  if (closeBtn) closeBtn.addEventListener('click', closeAuthModal);
  if (backdrop) backdrop.addEventListener('click', closeAuthModal);

  document.querySelectorAll('.auth-tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      switchAuthTab(btn.getAttribute('data-tab'));
    });
  });

  // Customer Login Form
  const loginForm = document.getElementById('customerLoginForm');
  if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const email = document.getElementById('loginEmail').value;
      const pass = document.getElementById('loginPassword').value;
      try {
        const user = loginUser(email, pass, 'customer');
        showToast(`Welcome back, ${user.name}!`, 'success');
        closeAuthModal();
        loginForm.reset();
      } catch (err) {
        showToast(err.message, 'warning');
      }
    });
  }

  // Customer Register Form
  const regForm = document.getElementById('customerRegisterForm');
  if (regForm) {
    regForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('regName').value;
      const email = document.getElementById('regEmail').value;
      const phone = document.getElementById('regPhone').value;
      const city = document.getElementById('regCity').value;
      const pass = document.getElementById('regPassword').value;

      try {
        const newUser = registerCustomer(name, email, phone, city, pass);
        showToast(`Ayubowan, ${newUser.name}! Your account has been created.`, 'success');
        closeAuthModal();
        regForm.reset();
      } catch (err) {
        showToast(err.message, 'warning');
      }
    });
  }

  // Admin Login Form
  const adminForm = document.getElementById('adminLoginForm');
  if (adminForm) {
    adminForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const email = document.getElementById('adminEmail').value;
      const pass = document.getElementById('adminPassword').value;

      try {
        const admin = loginUser(email, pass, 'admin');
        showToast(`Admin Mode Active: Welcome ${admin.name}`, 'success');
        closeAuthModal();
        adminForm.reset();
      } catch (err) {
        showToast(err.message, 'warning');
      }
    });
  }
}

function openAuthModal(defaultTab = 'login') {
  const modal = document.getElementById('authModal');
  const backdrop = document.getElementById('authBackdrop');
  if (modal && backdrop) {
    switchAuthTab(defaultTab);
    modal.classList.add('open');
    backdrop.classList.add('open');
    document.body.classList.add('no-scroll');
  }
}

function closeAuthModal() {
  const modal = document.getElementById('authModal');
  const backdrop = document.getElementById('authBackdrop');
  if (modal && backdrop) {
    modal.classList.remove('open');
    backdrop.classList.remove('open');
    document.body.classList.remove('no-scroll');
  }
}

function switchAuthTab(tab) {
  document.querySelectorAll('.auth-tab-btn').forEach(btn => {
    btn.classList.toggle('active', btn.getAttribute('data-tab') === tab);
  });

  const loginPane = document.getElementById('paneCustomerLogin');
  const regPane = document.getElementById('paneCustomerRegister');
  const adminPane = document.getElementById('paneAdminLogin');

  if (loginPane) loginPane.style.display = tab === 'login' ? 'block' : 'none';
  if (regPane) regPane.style.display = tab === 'register' ? 'block' : 'none';
  if (adminPane) adminPane.style.display = tab === 'admin' ? 'block' : 'none';
}

/* ==========================================================================
   9. ADMIN OPERATIONS WORKSPACE (B2B PROCUREMENT & PAYMENTS)
   ========================================================================== */
let currentStockOrderFilter = 'all';
let currentSupplierInvoiceFilter = 'all';

function initAdminWorkspace() {
  document.querySelectorAll('.admin-ws-tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.admin-ws-tab-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      switchAdminWorkspaceTab(btn.getAttribute('data-tab'));
    });
  });

  const custSearch = document.getElementById('adminWsCustomerSearch');
  if (custSearch) {
    custSearch.addEventListener('input', () => {
      renderAdminCustomerTable(custSearch.value);
    });
  }

  const orderSearch = document.getElementById('adminWsOrderSearch');
  if (orderSearch) {
    orderSearch.addEventListener('input', () => {
      renderAdminOrdersTable(orderSearch.value);
    });
  }

  const stockSearch = document.getElementById('adminWsStockOrderSearch');
  if (stockSearch) {
    stockSearch.addEventListener('input', () => {
      renderAdminStockOrdersTable(stockSearch.value, currentStockOrderFilter);
    });
  }

  const invSearch = document.getElementById('adminWsSupplierInvoiceSearch');
  if (invSearch) {
    invSearch.addEventListener('input', () => {
      renderAdminSupplierInvoicesTable(invSearch.value, currentSupplierInvoiceFilter);
    });
  }

  const catSearch = document.getElementById('adminWsCatalogSearch');
  if (catSearch) {
    catSearch.addEventListener('input', () => {
      renderAdminCatalogTable(catSearch.value);
    });
  }

  // Stock Order Filter Chips
  const stockChips = document.querySelectorAll('#stockOrderFilterChips .filter-chip');
  stockChips.forEach(chip => {
    chip.addEventListener('click', () => {
      stockChips.forEach(c => c.classList.remove('active'));
      chip.classList.add('active');
      currentStockOrderFilter = chip.getAttribute('data-status');
      const q = stockSearch ? stockSearch.value : '';
      renderAdminStockOrdersTable(q, currentStockOrderFilter);
    });
  });

  // Supplier Invoice Filter Chips
  const invChips = document.querySelectorAll('#supplierInvoiceFilterChips .filter-chip');
  invChips.forEach(chip => {
    chip.addEventListener('click', () => {
      invChips.forEach(c => c.classList.remove('active'));
      chip.classList.add('active');
      currentSupplierInvoiceFilter = chip.getAttribute('data-status');
      const q = invSearch ? invSearch.value : '';
      renderAdminSupplierInvoicesTable(q, currentSupplierInvoiceFilter);
    });
  });

  // Stock Order Live Cost Recalculation
  const qtyInput = document.getElementById('stockOrderQuantity');
  const unitCostInput = document.getElementById('stockOrderUnitCost');
  if (qtyInput && unitCostInput) {
    qtyInput.addEventListener('input', recalcStockOrderTotals);
    unitCostInput.addEventListener('input', recalcStockOrderTotals);
  }

  // Stock Order Form Submit
  const stockOrderForm = document.getElementById('orderStockForm');
  if (stockOrderForm) {
    stockOrderForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const supSelect = document.getElementById('stockOrderSupplier');
      const catSelect = document.getElementById('stockOrderCategory');
      const catText = catSelect ? catSelect.options[catSelect.selectedIndex].text : "Garment";

      const orderData = {
        supplierId: supSelect.value,
        category: catSelect.value,
        categoryName: catText,
        itemName: document.getElementById('stockOrderItemName').value,
        deliveryBranch: document.getElementById('stockOrderBranch').value,
        priority: document.getElementById('stockOrderPriority').value,
        quantity: document.getElementById('stockOrderQuantity').value,
        unitCost: document.getElementById('stockOrderUnitCost').value,
        expectedDate: document.getElementById('stockOrderExpectedDate').value,
        notes: document.getElementById('stockOrderNotes').value
      };

      const res = createPurchaseOrder(orderData);
      closeOrderStockModal();
      showToast(`Purchase Order ${res.po.poId} issued & Invoice ${res.invoice.invoiceId} generated!`, 'success');

      updateAdminKPIs();
      switchAdminWorkspaceTab('stock-orders');
    });
  }

  // Supplier Payment Form Submit
  const supPaymentForm = document.getElementById('supplierPaymentForm');
  if (supPaymentForm) {
    supPaymentForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const invId = document.getElementById('supplierPaymentInvoiceId').value;
      const selectedMethod = document.querySelector('input[name="corpPayMethod"]:checked')?.value || "Commercial Bank Corporate Direct Wire";
      const paymentRef = document.getElementById('supplierPaymentRef').value;

      const updated = paySupplierInvoice(invId, selectedMethod, paymentRef);
      closeSupplierPaymentModal();

      if (updated) {
        showToast(`Supplier Invoice ${invId} successfully settled (${formatLKR(updated.totalAmount)})!`, 'success');
        updateAdminKPIs();
        renderAdminSupplierInvoicesTable();
      }
    });
  }

  // Radio styling for corpPayMethod
  document.querySelectorAll('.corp-pay-option').forEach(option => {
    option.addEventListener('click', () => {
      document.querySelectorAll('.corp-pay-option').forEach(o => o.classList.remove('active'));
      option.classList.add('active');
    });
  });

  // Add Product Form Submit
  const addProductForm = document.getElementById('adminWsAddProductForm');
  if (addProductForm) {
    addProductForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const checkedSizes = [];
      document.querySelectorAll('input[name="adminWsProdSize"]:checked').forEach(cb => {
        checkedSizes.push(cb.value);
      });

      const productData = {
        name: document.getElementById('adminWsProdName').value,
        category: document.getElementById('adminWsProdCategory').value,
        price: document.getElementById('adminWsProdPrice').value,
        originalPrice: document.getElementById('adminWsProdOrigPrice').value || null,
        badge: document.getElementById('adminWsProdBadge').value || 'New Arrival',
        image: document.getElementById('adminWsProdImage').value || "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=800&q=80",
        description: document.getElementById('adminWsProdDesc').value || "Premium designer item from Sriyani Dress Point.",
        sizes: checkedSizes.length ? checkedSizes : ["Free Size"],
        colors: ["#8B133E", "#1E293B"]
      };

      const created = addNewProductToCatalog(productData);
      showToast(`Item "${created.name}" published into category "${created.category.toUpperCase()}"!`, 'success');
      addProductForm.reset();

      updateAdminKPIs();
      renderAdminCatalogTable();
      switchAdminWorkspaceTab('catalog');
    });
  }
}

function switchAdminWorkspaceTab(tab) {
  document.querySelectorAll('.admin-ws-tab-btn').forEach(b => {
    b.classList.toggle('active', b.getAttribute('data-tab') === tab);
  });

  const paneCustomers = document.getElementById('adminWsPaneCustomers');
  const paneOrders = document.getElementById('adminWsPaneOrders');
  const paneStockOrders = document.getElementById('adminWsPaneStockOrders');
  const paneSupplierInvoices = document.getElementById('adminWsPaneSupplierInvoices');
  const paneAddItem = document.getElementById('adminWsPaneAddItem');
  const paneCatalog = document.getElementById('adminWsPaneCatalog');

  if (paneCustomers) paneCustomers.style.display = tab === 'customers' ? 'block' : 'none';
  if (paneOrders) paneOrders.style.display = tab === 'orders' ? 'block' : 'none';
  if (paneStockOrders) paneStockOrders.style.display = tab === 'stock-orders' ? 'block' : 'none';
  if (paneSupplierInvoices) paneSupplierInvoices.style.display = tab === 'invoices' ? 'block' : 'none';
  if (paneAddItem) paneAddItem.style.display = tab === 'add-item' ? 'block' : 'none';
  if (paneCatalog) paneCatalog.style.display = tab === 'catalog' ? 'block' : 'none';

  if (tab === 'customers') renderAdminCustomerTable();
  if (tab === 'orders') renderAdminOrdersTable();
  if (tab === 'stock-orders') renderAdminStockOrdersTable('', currentStockOrderFilter);
  if (tab === 'invoices') renderAdminSupplierInvoicesTable('', currentSupplierInvoiceFilter);
  if (tab === 'catalog') renderAdminCatalogTable();
}

function updateAdminKPIs() {
  const customers = getAllCustomers();
  const orders = getOrdersList();
  const catalog = getProductsCatalog();
  const stockOrders = typeof getPurchaseOrders === 'function' ? getPurchaseOrders() : [];
  const supplierInvoices = typeof getSupplierInvoices === 'function' ? getSupplierInvoices() : [];
  const suppliers = typeof getSuppliers === 'function' ? getSuppliers() : [];

  const totalRev = orders.reduce((sum, ord) => sum + (ord.total || 0), 0);
  const pendingPayables = supplierInvoices
    .filter(inv => inv.paymentStatus === 'Pending')
    .reduce((sum, inv) => sum + (inv.totalAmount || 0), 0);
  const pendingInvoicesCount = supplierInvoices.filter(inv => inv.paymentStatus === 'Pending').length;

  const kpiCust = document.getElementById('kpiTotalCustomers');
  const kpiOrders = document.getElementById('kpiTotalOrders');
  const kpiRev = document.getElementById('kpiTotalRevenue');
  const kpiStock = document.getElementById('kpiStockOrders');
  const kpiPayables = document.getElementById('kpiSupplierPayables');
  const kpiSuppliers = document.getElementById('kpiTotalSuppliers');

  if (kpiCust) kpiCust.textContent = customers.length;
  if (kpiOrders) kpiOrders.textContent = orders.length;
  if (kpiRev) kpiRev.textContent = formatLKR(totalRev);
  if (kpiStock) kpiStock.textContent = stockOrders.length;
  if (kpiPayables) kpiPayables.textContent = formatLKR(pendingPayables);
  if (kpiSuppliers) kpiSuppliers.textContent = suppliers.length;

  // Dynamic Tab Badges
  const badgeCust = document.getElementById('tabBadgeCustomers');
  const badgeOrders = document.getElementById('tabBadgeOrders');
  const badgeStock = document.getElementById('tabBadgeStockOrders');
  const badgeInvoices = document.getElementById('tabBadgeInvoices');
  const badgeCat = document.getElementById('tabBadgeCatalog');

  if (badgeCust) badgeCust.textContent = customers.length;
  if (badgeOrders) badgeOrders.textContent = orders.length;
  if (badgeStock) badgeStock.textContent = stockOrders.length;
  if (badgeInvoices) {
    badgeInvoices.textContent = pendingInvoicesCount;
    badgeInvoices.style.display = pendingInvoicesCount > 0 ? 'inline-block' : 'none';
  }
  if (badgeCat) badgeCat.textContent = catalog.length;
}

function renderAdminCustomerTable(query = '') {
  const tableBody = document.getElementById('adminWsCustomerTableBody');
  const countBadge = document.getElementById('adminWsCustomerCount');
  if (!tableBody) return;

  const customers = getAllCustomers();
  const q = query.trim().toLowerCase();

  const filtered = customers.filter(c => 
    !q || 
    c.name.toLowerCase().includes(q) ||
    c.email.toLowerCase().includes(q) ||
    c.phone.toLowerCase().includes(q) ||
    c.city.toLowerCase().includes(q)
  );

  if (countBadge) countBadge.textContent = `${filtered.length} Registered`;

  if (filtered.length === 0) {
    tableBody.innerHTML = `<tr><td colspan="6" class="table-empty">No customer records found matching "${query}".</td></tr>`;
    return;
  }

  tableBody.innerHTML = filtered.map((c, idx) => {
    const formattedDate = new Date(c.registeredAt).toLocaleDateString('en-GB', {
      year: 'numeric', month: 'short', day: 'numeric'
    });

    return `
      <tr>
        <td><strong>#${idx + 1}</strong></td>
        <td>
          <div class="cust-table-user">
            <div class="cust-table-avatar"><i class="fa-solid fa-user"></i></div>
            <div>
              <strong>${c.name}</strong>
              <small>${c.email}</small>
            </div>
          </div>
        </td>
        <td><a href="tel:${c.phone}" class="cust-phone-link"><i class="fa-solid fa-phone"></i> ${c.phone}</a></td>
        <td><span class="cust-city-badge"><i class="fa-solid fa-location-dot"></i> ${c.city}</span></td>
        <td>${formattedDate}</td>
        <td>
          <button type="button" class="btn-table-action delete" onclick="confirmDeleteCustomer('${c.email}', '${c.name}')" title="Delete customer">
            <i class="fa-regular fa-trash-can"></i>
          </button>
        </td>
      </tr>
    `;
  }).join('');
}

function renderAdminOrdersTable(query = '') {
  const tableBody = document.getElementById('adminWsOrdersTableBody');
  const countBadge = document.getElementById('adminWsOrdersCount');
  if (!tableBody) return;

  const orders = getOrdersList();
  const q = query.trim().toLowerCase();

  const filtered = orders.filter(o =>
    !q ||
    o.orderId.toLowerCase().includes(q) ||
    o.customerName.toLowerCase().includes(q) ||
    o.paymentMethod.toLowerCase().includes(q) ||
    o.deliveryCity.toLowerCase().includes(q)
  );

  if (countBadge) countBadge.textContent = `${filtered.length} Orders`;

  if (filtered.length === 0) {
    tableBody.innerHTML = `<tr><td colspan="7" class="table-empty">No customer orders matching "${query}".</td></tr>`;
    return;
  }

  tableBody.innerHTML = filtered.map(o => {
    const orderDateStr = new Date(o.orderDate).toLocaleString('en-GB', {
      month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
    });

    return `
      <tr>
        <td><strong>${o.orderId}</strong></td>
        <td>
          <strong>${o.customerName}</strong>
          <small style="display: block; color: #94A3B8;">${o.customerPhone} • ${o.deliveryCity}</small>
        </td>
        <td>
          <small>${o.items.map(it => `${it.quantity}x ${it.name} (${it.size})`).join('<br>')}</small>
        </td>
        <td><strong>${formatLKR(o.total)}</strong></td>
        <td>
          <span class="payment-method-pill ${o.paymentMethod.toLowerCase().includes('koko') ? 'koko' : (o.paymentMethod.toLowerCase().includes('visa') ? 'card' : 'cod')}">
            ${o.paymentMethod}
          </span>
          <small style="display: block; color: #10B981; font-weight: 700; margin-top: 2px;">${o.paymentStatus}</small>
        </td>
        <td>${orderDateStr}</td>
        <td>
          <button type="button" class="btn-table-action view" onclick='showOrderSuccessInvoice(${JSON.stringify(o).replace(/'/g, "&apos;")})' title="View Official Receipt">
            <i class="fa-solid fa-file-invoice"></i>
          </button>
        </td>
      </tr>
    `;
  }).join('');
}

function confirmDeleteCustomer(email, name) {
  if (confirm(`Are you sure you want to remove customer account for "${name}"?`)) {
    deleteCustomer(email);
    showToast(`Customer account "${name}" removed.`, "info");
  }
}

function renderAdminCatalogTable(query = '') {
  const tableBody = document.getElementById('adminWsCatalogTableBody');
  const countBadge = document.getElementById('adminWsCatalogCount');
  if (!tableBody) return;

  const catalog = getProductsCatalog();
  const q = query.trim().toLowerCase();

  const filtered = catalog.filter(p => 
    !q ||
    p.name.toLowerCase().includes(q) ||
    p.category.toLowerCase().includes(q)
  );

  if (countBadge) countBadge.textContent = `${filtered.length} Items`;

  if (filtered.length === 0) {
    tableBody.innerHTML = `<tr><td colspan="6" class="table-empty">No catalog items matching "${query}".</td></tr>`;
    return;
  }

  tableBody.innerHTML = filtered.map(p => `
    <tr>
      <td>
        <img src="${p.image}" alt="${p.name}" class="admin-prod-thumb" />
      </td>
      <td>
        <strong>${p.name}</strong>
        ${p.badge ? `<span class="badge-mini">${p.badge}</span>` : ''}
      </td>
      <td><span class="cat-pill ${p.category}">${p.category.toUpperCase()}</span></td>
      <td><strong>${formatLKR(p.price)}</strong></td>
      <td>${p.sizes.join(', ')}</td>
      <td>
        <button type="button" class="btn-table-action delete" onclick="confirmDeleteProduct(${p.id}, '${p.name}')" title="Delete product">
          <i class="fa-regular fa-trash-can"></i>
        </button>
      </td>
    </tr>
  `).join('');
}

function confirmDeleteProduct(id, name) {
  if (confirm(`Are you sure you want to remove "${name}" from the store catalog?`)) {
    removeProductFromCatalog(id);
    renderAdminCatalogTable();
    updateAdminKPIs();
    renderProducts('all');
    showToast(`"${name}" removed from catalog.`, "info");
  }
}

function setAdminWsImagePreset(url) {
  const input = document.getElementById('adminWsProdImage');
  const preview = document.getElementById('adminWsImagePreview');
  if (input) input.value = url;
  if (preview) {
    preview.src = url;
    preview.style.display = 'block';
  }
}

/* ==========================================================================
   B2B SUPPLIER STOCK PROCUREMENT & INVOICE PAYMENT HANDLERS
   ========================================================================== */
function renderAdminStockOrdersTable(query = '', statusFilter = 'all') {
  const tableBody = document.getElementById('adminWsStockOrdersTableBody');
  const countBadge = document.getElementById('adminWsStockOrdersCount');
  if (!tableBody) return;

  const orders = getPurchaseOrders();
  const q = query.trim().toLowerCase();

  const filtered = orders.filter(o => {
    const matchesQuery = !q ||
      o.poId.toLowerCase().includes(q) ||
      o.supplierName.toLowerCase().includes(q) ||
      o.itemName.toLowerCase().includes(q) ||
      o.deliveryBranch.toLowerCase().includes(q);

    const matchesStatus = statusFilter === 'all' || o.status.toLowerCase() === statusFilter.toLowerCase();
    return matchesQuery && matchesStatus;
  });

  if (countBadge) countBadge.textContent = `${filtered.length} Orders`;

  if (filtered.length === 0) {
    tableBody.innerHTML = `<tr><td colspan="9" class="table-empty">No supplier purchase orders matching criteria.</td></tr>`;
    return;
  }

  tableBody.innerHTML = filtered.map(o => {
    const statusClass = `status-${o.status.toLowerCase().replace(/\s+/g, '-')}`;
    return `
      <tr>
        <td><strong>${o.poId}</strong></td>
        <td>
          <strong>${o.supplierName}</strong>
          <small style="display: block; color: #94A3B8;">${o.priority}</small>
        </td>
        <td>
          <strong>${o.itemName}</strong>
          <small style="display: block; color: var(--color-gold);">${o.categoryName || o.category.toUpperCase()}</small>
        </td>
        <td>${o.quantity} Units</td>
        <td><strong>${formatLKR(o.total)}</strong></td>
        <td><small><i class="fa-solid fa-location-dot" style="color: var(--color-gold);"></i> ${o.deliveryBranch}</small></td>
        <td>${o.expectedDate}</td>
        <td><span class="status-pill ${statusClass}">${o.status}</span></td>
        <td>
          <div style="display: flex; gap: 0.4rem;">
            <button type="button" class="btn-table-action view" onclick="openSupplierInvoiceModal('${o.invoiceId}')" title="View Supplier Invoice">
              <i class="fa-solid fa-file-invoice"></i>
            </button>
            <button type="button" class="btn-table-action delete" onclick="confirmDeletePurchaseOrder('${o.poId}')" title="Cancel PO">
              <i class="fa-regular fa-trash-can"></i>
            </button>
          </div>
        </td>
      </tr>
    `;
  }).join('');
}

function renderAdminSupplierInvoicesTable(query = '', statusFilter = 'all') {
  const tableBody = document.getElementById('adminWsInvoicesTableBody');
  const countBadge = document.getElementById('adminWsInvoicesCount');
  if (!tableBody) return;

  const invoices = getSupplierInvoices();
  const q = query.trim().toLowerCase();

  const filtered = invoices.filter(inv => {
    const matchesQuery = !q ||
      inv.invoiceId.toLowerCase().includes(q) ||
      inv.poId.toLowerCase().includes(q) ||
      inv.supplierName.toLowerCase().includes(q) ||
      (inv.supplierVat && inv.supplierVat.toLowerCase().includes(q));

    const matchesStatus = statusFilter === 'all' || inv.paymentStatus.toLowerCase() === statusFilter.toLowerCase();
    return matchesQuery && matchesStatus;
  });

  if (countBadge) countBadge.textContent = `${filtered.length} Invoices`;

  if (filtered.length === 0) {
    tableBody.innerHTML = `<tr><td colspan="8" class="table-empty">No supplier invoices found matching criteria.</td></tr>`;
    return;
  }

  tableBody.innerHTML = filtered.map(inv => {
    const isPaid = inv.paymentStatus === 'Paid';
    const statusClass = isPaid ? 'status-paid' : (new Date(inv.dueDate) < new Date() ? 'status-overdue' : 'status-pending');

    return `
      <tr>
        <td><strong>${inv.invoiceId}</strong></td>
        <td><span style="color: var(--color-gold); font-weight: 700;">${inv.poId}</span></td>
        <td>
          <strong>${inv.supplierName}</strong>
          <small style="display: block; color: #94A3B8;">VAT: ${inv.supplierVat || 'N/A'}</small>
        </td>
        <td><strong>${formatLKR(inv.totalAmount)}</strong></td>
        <td>${inv.issueDate}</td>
        <td>${inv.dueDate}</td>
        <td><span class="status-pill ${statusClass}">${inv.paymentStatus}</span></td>
        <td>
          <div style="display: flex; gap: 0.4rem; align-items: center;">
            ${!isPaid ? `
              <button type="button" class="btn-table-primary" style="padding: 0.35rem 0.75rem; font-size: 0.75rem; background: #10B981; color: white;" onclick="openSupplierPaymentModal('${inv.invoiceId}')" title="Pay Supplier Bill">
                <i class="fa-solid fa-credit-card"></i> Pay Now
              </button>
            ` : `
              <span style="font-size: 0.75rem; color: #10B981; font-weight: 700;"><i class="fa-solid fa-circle-check"></i> Settled</span>
            `}
            <button type="button" class="btn-table-action view" onclick="openSupplierInvoiceModal('${inv.invoiceId}')" title="View Official B2B Tax Invoice">
              <i class="fa-solid fa-file-invoice"></i>
            </button>
            <button type="button" class="btn-table-action" style="background: #334155; color: white;" onclick="printSupplierInvoiceDirectly('${inv.invoiceId}')" title="Print Invoice">
              <i class="fa-solid fa-print"></i>
            </button>
          </div>
        </td>
      </tr>
    `;
  }).join('');
}

function recalcStockOrderTotals() {
  const qty = Number(document.getElementById('stockOrderQuantity')?.value) || 0;
  const unit = Number(document.getElementById('stockOrderUnitCost')?.value) || 0;
  const subtotal = qty * unit;
  const tax = Math.round(subtotal * 0.15);
  const total = subtotal + tax;

  const subEl = document.getElementById('stockOrderSubtotal');
  const taxEl = document.getElementById('stockOrderTax');
  const totEl = document.getElementById('stockOrderTotal');

  if (subEl) subEl.textContent = formatLKR(subtotal);
  if (taxEl) taxEl.textContent = formatLKR(tax);
  if (totEl) totEl.textContent = formatLKR(total);
}

function openOrderStockModal() {
  const modal = document.getElementById('orderStockModal');
  const backdrop = document.getElementById('orderStockBackdrop');
  if (!modal) return;

  const dateInput = document.getElementById('stockOrderExpectedDate');
  if (dateInput && !dateInput.value) {
    const d = new Date();
    d.setDate(d.getDate() + 12);
    dateInput.value = d.toISOString().split('T')[0];
  }

  recalcStockOrderTotals();
  modal.classList.add('open');
  if (backdrop) backdrop.classList.add('open');
  document.body.classList.add('no-scroll');
}

function closeOrderStockModal() {
  const modal = document.getElementById('orderStockModal');
  const backdrop = document.getElementById('orderStockBackdrop');
  if (modal) modal.classList.remove('open');
  if (backdrop) backdrop.classList.remove('open');
  document.body.classList.remove('no-scroll');
}

function openSupplierPaymentModal(invoiceId) {
  const modal = document.getElementById('supplierPaymentModal');
  const backdrop = document.getElementById('supplierPaymentBackdrop');
  const summaryBox = document.getElementById('supplierPaymentSummaryBox');
  const invInput = document.getElementById('supplierPaymentInvoiceId');
  const refInput = document.getElementById('supplierPaymentRef');

  const inv = getSupplierInvoiceById(invoiceId);
  if (!inv) {
    showToast('Invoice not found.', 'error');
    return;
  }

  if (invInput) invInput.value = inv.invoiceId;
  if (refInput) refInput.value = `CB-TXN-${Math.floor(100000 + Math.random() * 900000)}`;

  if (summaryBox) {
    summaryBox.innerHTML = `
      <div>
        <span style="font-size: 0.75rem; text-transform: uppercase; color: #94A3B8; font-weight: 700;">PAYABLE INVOICE:</span>
        <strong style="display: block; font-size: 1.1rem; color: white;">${inv.invoiceId} (${inv.poId})</strong>
        <span style="font-size: 0.85rem; color: #CBD5E1;">Supplier: <strong>${inv.supplierName}</strong></span>
      </div>
      <div style="text-align: right;">
        <span style="font-size: 0.75rem; text-transform: uppercase; color: #94A3B8; font-weight: 700;">TOTAL PAYABLE:</span>
        <strong style="display: block; font-size: 1.35rem; color: #10B981;">${formatLKR(inv.totalAmount)}</strong>
        <span style="font-size: 0.78rem; color: #F59E0B;">Due Date: ${inv.dueDate}</span>
      </div>
    `;
  }

  modal.classList.add('open');
  if (backdrop) backdrop.classList.add('open');
  document.body.classList.add('no-scroll');
}

function closeSupplierPaymentModal() {
  const modal = document.getElementById('supplierPaymentModal');
  const backdrop = document.getElementById('supplierPaymentBackdrop');
  if (modal) modal.classList.remove('open');
  if (backdrop) backdrop.classList.remove('open');
  document.body.classList.remove('no-scroll');
}

function openSupplierInvoiceModal(invoiceId) {
  const modal = document.getElementById('supplierInvoiceModal');
  const backdrop = document.getElementById('supplierInvoiceBackdrop');
  const content = document.getElementById('supplierInvoiceContent');

  const inv = getSupplierInvoiceById(invoiceId);
  if (!inv) {
    showToast('Invoice details could not be retrieved.', 'error');
    return;
  }

  const isPaid = inv.paymentStatus === 'Paid';

  if (content) {
    content.innerHTML = `
      <div class="b2b-invoice-paper">
        <div class="b2b-invoice-header">
          <div>
            <div style="display: flex; align-items: center; gap: 0.75rem; margin-bottom: 0.5rem;">
              <div style="width: 44px; height: 44px; background: linear-gradient(135deg, #8B133E, #C59B27); border-radius: 50%; display: flex; align-items: center; justify-content: center; color: white; font-size: 1.2rem;">
                <i class="fa-solid fa-crown"></i>
              </div>
              <div>
                <strong style="font-family: var(--font-brand); font-size: 1.35rem; letter-spacing: 2px; color: #780B32;">SRIYANI DRESS POINT</strong>
                <span style="display: block; font-size: 0.65rem; font-weight: 800; letter-spacing: 2px; color: #8B133E;">CENTRAL PROCUREMENT & LOGISTICS</span>
              </div>
            </div>
            <p style="font-size: 0.82rem; color: #64748B; line-height: 1.4;">
              Head Office: No. 189, Main Street, Kegalle, Sri Lanka<br>
              VAT Reg: <strong>VAT-LK-77889900</strong> | Hotline: +94 35 222 3456
            </p>
          </div>

          <div class="b2b-invoice-title">
            <h2>COMMERCIAL TAX INVOICE</h2>
            <div style="font-size: 0.9rem; color: #475569;">
              <strong>Invoice #:</strong> ${inv.invoiceId}<br>
              <strong>PO Ref #:</strong> ${inv.poId}<br>
              <strong>Issue Date:</strong> ${inv.issueDate}<br>
              <strong>Due Date:</strong> ${inv.dueDate}
            </div>
            <div class="b2b-stamp-watermark ${isPaid ? 'paid' : 'pending'}">
              ${isPaid ? 'PAID & SETTLED' : 'PAYMENT PENDING'}
            </div>
          </div>
        </div>

        <div class="b2b-parties-grid">
          <div class="b2b-party-box">
            <h4>Billed By (Supplier)</h4>
            <strong>${inv.supplierName}</strong>
            <p style="color: #475569; margin: 0; line-height: 1.4;">
              City: ${inv.supplierCity || 'Sri Lanka'}<br>
              Email: ${inv.supplierEmail || 'orders@supplier.lk'}<br>
              Phone: ${inv.supplierPhone || '+94 11 000 0000'}<br>
              VAT No: <strong>${inv.supplierVat || 'VAT-LK-0000'}</strong>
            </p>
          </div>

          <div class="b2b-party-box">
            <h4>Billed To (Buyer & Consignee)</h4>
            <strong>Sriyani Dress Point (Pvt) Ltd</strong>
            <p style="color: #475569; margin: 0; line-height: 1.4;">
              Receiving Branch: <strong>${inv.deliveryBranch}</strong><br>
              Corporate Account: Commercial Bank Kegalle<br>
              Payment Terms: Net 30 Commercial Invoice<br>
              Procurement Officer: Admin Portal Clearance
            </p>
          </div>
        </div>

        <table class="b2b-invoice-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Description of Goods / Fabrics</th>
              <th>Quantity</th>
              <th>Unit Cost (LKR)</th>
              <th style="text-align: right;">Amount (LKR)</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>1</td>
              <td>
                <strong>${inv.itemName}</strong>
                <small style="display: block; color: #64748B;">Certified Sri Lankan High Grade Weave / Garment Lot</small>
              </td>
              <td>${inv.quantity}</td>
              <td>${formatLKR(inv.unitCost)}</td>
              <td style="text-align: right;"><strong>${formatLKR(inv.subtotal)}</strong></td>
            </tr>
          </tbody>
        </table>

        <div class="b2b-invoice-totals">
          <div class="b2b-totals-row">
            <span>Subtotal:</span>
            <strong>${formatLKR(inv.subtotal)}</strong>
          </div>
          <div class="b2b-totals-row">
            <span>VAT (15%):</span>
            <strong>${formatLKR(inv.tax)}</strong>
          </div>
          <div class="b2b-totals-row grand">
            <span>Grand Total:</span>
            <span>${formatLKR(inv.totalAmount)}</span>
          </div>
        </div>

        ${isPaid ? `
          <div style="background: #F0FDF4; border: 1px solid #BBF7D0; border-radius: var(--radius-sm); padding: 0.85rem 1.25rem; margin-bottom: 1.5rem; font-size: 0.85rem; color: #166534;">
            <i class="fa-solid fa-circle-check" style="color: #10B981; margin-right: 0.35rem;"></i>
            <strong>Payment Cleared:</strong> Settled via <strong>${inv.paymentMethod}</strong> | Ref: <strong>${inv.paymentRef}</strong> on ${new Date(inv.paymentDate).toLocaleString('en-GB')}.
          </div>
        ` : ''}

        <div style="display: flex; justify-content: space-between; border-top: 1px solid #E2E8F0; padding-top: 1.5rem; margin-top: 1.5rem; font-size: 0.8rem; color: #94A3B8;">
          <div>Authorized By: <strong>Head of Procurement</strong> (Sriyani Dress Point)</div>
          <div>Computer Generated Commercial Tax Invoice</div>
        </div>
      </div>

      <div class="b2b-invoice-footer-actions">
        <button type="button" class="btn-outline" onclick="closeSupplierInvoiceModal()">Close</button>
        <div style="display: flex; gap: 0.75rem;">
          ${!isPaid ? `
            <button type="button" class="btn-primary" style="background: #10B981; color: white;" onclick="closeSupplierInvoiceModal(); openSupplierPaymentModal('${inv.invoiceId}');">
              <i class="fa-solid fa-credit-card"></i> Pay This Bill Now
            </button>
          ` : ''}
          <button type="button" class="btn-primary" onclick="window.print()">
            <i class="fa-solid fa-print"></i> Print Official Tax Invoice
          </button>
        </div>
      </div>
    `;
  }

  modal.classList.add('open');
  if (backdrop) backdrop.classList.add('open');
  document.body.classList.add('no-scroll');
}

function closeSupplierInvoiceModal() {
  const modal = document.getElementById('supplierInvoiceModal');
  const backdrop = document.getElementById('supplierInvoiceBackdrop');
  if (modal) modal.classList.remove('open');
  if (backdrop) backdrop.classList.remove('open');
  document.body.classList.remove('no-scroll');
}

function printSupplierInvoiceDirectly(invoiceId) {
  openSupplierInvoiceModal(invoiceId);
  setTimeout(() => {
    window.print();
  }, 350);
}

function confirmDeletePurchaseOrder(poId) {
  if (confirm(`Are you sure you want to cancel Purchase Order "${poId}" and its linked invoice?`)) {
    deletePurchaseOrder(poId);
    showToast(`Purchase Order "${poId}" cancelled.`, 'info');
    updateAdminKPIs();
    renderAdminStockOrdersTable('', currentStockOrderFilter);
    renderAdminSupplierInvoicesTable('', currentSupplierInvoiceFilter);
  }
}

function printProcurementReport() {
  switchAdminWorkspaceTab('invoices');
  setTimeout(() => {
    window.print();
  }, 400);
}

/* ==========================================================================
   10. PAYMENT GATEWAY LISTENERS & CARD FORMATTING
   ========================================================================== */
function initPaymentGatewayListeners() {
  const form = document.getElementById('paymentGatewayForm');
  if (form) {
    form.addEventListener('submit', processPayment);
  }

  const cardInput = document.getElementById('cardNumInput');
  if (cardInput) {
    cardInput.addEventListener('input', (e) => {
      let val = e.target.value.replace(/\D/g, '').substring(0, 16);
      let formatted = val.match(/.{1,4}/g)?.join(' ') || val;
      e.target.value = formatted;
    });
  }

  const expInput = document.getElementById('cardExpInput');
  if (expInput) {
    expInput.addEventListener('input', (e) => {
      let val = e.target.value.replace(/\D/g, '').substring(0, 4);
      if (val.length >= 2) {
        e.target.value = val.substring(0, 2) + '/' + val.substring(2);
      } else {
        e.target.value = val;
      }
    });
  }
}

/* ==========================================================================
   11. MOBILE NAVIGATION & DRAWER
   ========================================================================== */
function initMobileMenu() {
  const menuToggle = document.getElementById('mobileMenuToggle');
  const mobileNav = document.getElementById('mobileNavDrawer');
  const closeMobileNav = document.getElementById('closeMobileNav');
  const backdrop = document.getElementById('mobileNavBackdrop');

  if (!menuToggle || !mobileNav) return;

  function openMenu() {
    mobileNav.classList.add('open');
    if (backdrop) backdrop.classList.add('open');
    document.body.classList.add('no-scroll');
  }

  function closeMenu() {
    mobileNav.classList.remove('open');
    if (backdrop) backdrop.classList.remove('open');
    document.body.classList.remove('no-scroll');
  }

  menuToggle.addEventListener('click', openMenu);
  if (closeMobileNav) closeMobileNav.addEventListener('click', closeMenu);
  if (backdrop) backdrop.addEventListener('click', closeMenu);

  document.querySelectorAll('.mobile-nav-link').forEach(link => {
    link.addEventListener('click', closeMenu);
  });
}

/* ==========================================================================
   12. NEWSLETTER & SCROLL
   ========================================================================== */
function initNewsletterForm() {
  const form = document.getElementById('newsletterForm');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const emailInput = form.querySelector('input[type="email"]');
    if (emailInput && emailInput.value) {
      showToast(`Thank you! A 10% discount voucher has been sent to ${emailInput.value}`, 'success');
      emailInput.value = '';
    }
  });
}

function scrollToSection(sectionId) {
  const target = document.getElementById(sectionId);
  if (target) {
    const navHeight = 90;
    const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - navHeight;
    window.scrollTo({
      top: targetPosition,
      behavior: 'smooth'
    });
  }
}

/* ==========================================================================
   13. CUSTOMER VIRTUAL FITTING ROOM (3D STUDIO & AI FIT FINDER)
   ========================================================================== */
let vfrCurrentGender = 'female';
let vfrCurrentModelId = 'fem-1';
let vfrCurrentProduct = null;
let vfrCurrentLighting = 'daylight';
let vfrActiveColor = { name: "Original Royal", hex: "#8B133E" };
let vfrActiveTab = 'wardrobe';
let vfrFitResult = null;
let vfrCurrentRackFilter = 'all';

function initVirtualFittingRoom() {
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      const modal = document.getElementById('virtualFittingRoomModal');
      if (modal && modal.classList.contains('open')) {
        closeVirtualFittingRoom();
      }
    }
  });

  // Pre-calculate initial sizing based on default slider positions
  if (document.getElementById('sliderHeight')) {
    handleFittingMeasurementChange();
  }
}

function openVirtualFittingRoom(productId = null, targetGender = null) {
  const modal = document.getElementById('virtualFittingRoomModal');
  const backdrop = document.getElementById('virtualFittingRoomBackdrop');
  if (!modal || !backdrop) return;

  const catalog = (typeof getProductsCatalog === 'function') ? getProductsCatalog() : PRODUCTS_DATA;

  // 1. Determine target gender and product
  if (targetGender) {
    vfrCurrentGender = (targetGender === 'male') ? 'male' : 'female';
  }

  if (productId) {
    const found = catalog.find(p => p.id === productId);
    if (found) {
      vfrCurrentProduct = found;
      if (found.category === 'men') {
        vfrCurrentGender = 'male';
      } else {
        vfrCurrentGender = 'female';
      }
    }
  }

  // If no product selected, pick a default matching the gender
  if (!vfrCurrentProduct || (vfrCurrentGender === 'male' && vfrCurrentProduct.category !== 'men') || (vfrCurrentGender === 'female' && vfrCurrentProduct.category === 'men')) {
    vfrCurrentProduct = catalog.find(p => vfrCurrentGender === 'male' ? p.category === 'men' : (p.category === 'sarees' || p.category === 'women' || p.category === 'bridal')) || catalog[0];
  }

  // 2. Align model to gender
  const availableModels = getFittingModels(vfrCurrentGender);
  const currentModelExists = availableModels.some(m => m.id === vfrCurrentModelId);
  if (!currentModelExists) {
    vfrCurrentModelId = availableModels[0].id;
  }

  // 3. Update Gender toggle buttons
  updateFittingGenderButtonsUI();

  // 4. Render Mannequin Stage & Color Swatches
  renderFittingStage();
  renderFittingColorPalettes();

  // 5. Render Wardrobe Rack & Models
  renderFittingWardrobeRack();
  renderFittingModels();

  // 6. Recalculate AI Fit
  handleFittingMeasurementChange();

  // 7. Open Modal
  modal.classList.add('open');
  backdrop.classList.add('open');
  document.body.classList.add('no-scroll');
}

function closeVirtualFittingRoom() {
  const modal = document.getElementById('virtualFittingRoomModal');
  const backdrop = document.getElementById('virtualFittingRoomBackdrop');
  if (modal) modal.classList.remove('open');
  if (backdrop) backdrop.classList.remove('open');
  document.body.classList.remove('no-scroll');
}

function updateFittingGenderButtonsUI() {
  const femBtn = document.getElementById('vfrGenderFemBtn');
  const maleBtn = document.getElementById('vfrGenderMaleBtn');
  if (femBtn && maleBtn) {
    femBtn.classList.toggle('active', vfrCurrentGender === 'female');
    maleBtn.classList.toggle('active', vfrCurrentGender === 'male');
  }
}

function setFittingGender(gender) {
  vfrCurrentGender = gender;
  updateFittingGenderButtonsUI();

  // Pick first model for this gender
  const models = getFittingModels(gender);
  if (models.length) {
    selectFittingModel(models[0].id);
  }

  // If product does not match new gender, switch to first item matching gender
  const catalog = (typeof getProductsCatalog === 'function') ? getProductsCatalog() : PRODUCTS_DATA;
  if (vfrCurrentGender === 'male' && vfrCurrentProduct && vfrCurrentProduct.category !== 'men') {
    const maleProd = catalog.find(p => p.category === 'men');
    if (maleProd) selectFittingGarment(maleProd.id);
  } else if (vfrCurrentGender === 'female' && vfrCurrentProduct && vfrCurrentProduct.category === 'men') {
    const femProd = catalog.find(p => p.category === 'sarees' || p.category === 'women' || p.category === 'bridal');
    if (femProd) selectFittingGarment(femProd.id);
  }

  renderFittingWardrobeRack();
  renderFittingModels();
}

function switchVfrTab(tabName) {
  vfrActiveTab = tabName;

  // Update tabs buttons
  document.querySelectorAll('.vfr-tab-btn').forEach(btn => {
    btn.classList.toggle('active', btn.getAttribute('data-vfr-tab') === tabName);
  });

  // Switch panes
  const wardrobePane = document.getElementById('vfrTabWardrobe');
  const sizePane = document.getElementById('vfrTabSizeFinder');
  const modelPane = document.getElementById('vfrTabModel');

  if (wardrobePane) wardrobePane.style.display = (tabName === 'wardrobe') ? 'block' : 'none';
  if (sizePane) sizePane.style.display = (tabName === 'size-finder') ? 'block' : 'none';
  if (modelPane) modelPane.style.display = (tabName === 'model') ? 'block' : 'none';
}

function filterFittingRack(category, chipElement) {
  vfrCurrentRackFilter = category;
  if (chipElement) {
    document.querySelectorAll('.rack-chip').forEach(c => c.classList.remove('active'));
    chipElement.classList.add('active');
  }
  renderFittingWardrobeRack();
}

function renderFittingWardrobeRack() {
  const rackGrid = document.getElementById('fittingWardrobeRack');
  if (!rackGrid) return;

  const catalog = (typeof getProductsCatalog === 'function') ? getProductsCatalog() : PRODUCTS_DATA;
  let filtered = catalog;

  if (vfrCurrentRackFilter !== 'all') {
    const rf = vfrCurrentRackFilter.toLowerCase();
    if (rf === 'sarees') filtered = catalog.filter(p => p.category === 'sarees');
    else if (rf === 'bridal') filtered = catalog.filter(p => p.category === 'bridal');
    else if (rf === 'women') filtered = catalog.filter(p => p.category === 'women' || p.category === 'sarees' || p.category === 'bridal');
    else if (rf === 'men') filtered = catalog.filter(p => p.category === 'men');
  } else {
    // If 'all', prioritize garments aligned with currently active gender first
    filtered = [...catalog].sort((a, b) => {
      const aMatch = (vfrCurrentGender === 'male' ? a.category === 'men' : a.category !== 'men') ? -1 : 1;
      const bMatch = (vfrCurrentGender === 'male' ? b.category === 'men' : b.category !== 'men') ? -1 : 1;
      return aMatch - bMatch;
    });
  }

  rackGrid.innerHTML = filtered.map(item => {
    const isSelected = vfrCurrentProduct && vfrCurrentProduct.id === item.id;
    return `
      <div class="vfr-rack-item ${isSelected ? 'active' : ''}" onclick="selectFittingGarment(${item.id})">
        <div class="vfr-rack-thumb-wrap">
          <img src="${item.image}" alt="${item.name}" loading="lazy" />
          ${isSelected ? '<span class="vfr-rack-active-tag"><i class="fa-solid fa-check"></i> Fitted</span>' : ''}
        </div>
        <div class="vfr-rack-info">
          <h5>${item.name}</h5>
          <span class="vfr-rack-price">${formatLKR(item.price)}</span>
        </div>
      </div>
    `;
  }).join('');
}

function selectFittingGarment(productId) {
  const catalog = (typeof getProductsCatalog === 'function') ? getProductsCatalog() : PRODUCTS_DATA;
  const prod = catalog.find(p => p.id === productId);
  if (!prod) return;

  vfrCurrentProduct = prod;

  // Auto switch gender if clicking a garment from the other category
  if (prod.category === 'men' && vfrCurrentGender !== 'male') {
    vfrCurrentGender = 'male';
    updateFittingGenderButtonsUI();
    const maleModels = getFittingModels('male');
    if (maleModels.length) vfrCurrentModelId = maleModels[0].id;
    renderFittingModels();
  } else if (prod.category !== 'men' && vfrCurrentGender === 'male') {
    vfrCurrentGender = 'female';
    updateFittingGenderButtonsUI();
    const femModels = getFittingModels('female');
    if (femModels.length) vfrCurrentModelId = femModels[0].id;
    renderFittingModels();
  }

  // Reset active color to original
  vfrActiveColor = { name: "Original Royal", hex: "#8B133E" };

  renderFittingStage();
  renderFittingColorPalettes();
  renderFittingWardrobeRack();
  handleFittingMeasurementChange();

  // Pulse effect on stage
  const stage = document.getElementById('fittingMannequinCanvas');
  if (stage) {
    stage.classList.remove('drape-pulse');
    void stage.offsetWidth; // trigger reflow
    stage.classList.add('drape-pulse');
  }
}

function renderFittingModels() {
  const grid = document.getElementById('fittingModelsGrid');
  if (!grid) return;

  const models = getFittingModels(vfrCurrentGender);
  grid.innerHTML = models.map(m => {
    const isSelected = m.id === vfrCurrentModelId;
    return `
      <div class="vfr-model-card ${isSelected ? 'active' : ''}" onclick="selectFittingModel('${m.id}')">
        <img src="${m.image}" alt="${m.name}" class="vfr-model-avatar-thumb" />
        <div class="vfr-model-meta">
          <div class="model-name-row">
            <strong>${m.name}</strong>
            <span class="model-silhouette-tag">${m.silhouette}</span>
          </div>
          <p class="model-sub">${m.subtitle}</p>
          <div class="model-specs">
            <span>H: ${m.heightCm}cm</span>
            <span>B: ${m.bustIn}"</span>
            <span>W: ${m.waistIn}"</span>
          </div>
        </div>
      </div>
    `;
  }).join('');
}

function selectFittingModel(modelId) {
  const model = getFittingModelById(modelId);
  if (!model) return;

  vfrCurrentModelId = model.id;

  // Set default slider values to model's baseline
  const sliderH = document.getElementById('sliderHeight');
  const sliderB = document.getElementById('sliderBust');
  const sliderW = document.getElementById('sliderWaist');
  const sliderHp = document.getElementById('sliderHip');

  if (sliderH) sliderH.value = model.heightCm;
  if (sliderB) sliderB.value = model.bustIn;
  if (sliderW) sliderW.value = model.waistIn;
  if (sliderHp) sliderHp.value = model.hipIn;

  renderFittingStage();
  renderFittingModels();
  handleFittingMeasurementChange();
}

function renderFittingColorPalettes() {
  const container = document.getElementById('fittingColorPalette');
  if (!container) return;

  container.innerHTML = FITTING_COLOR_PALETTES.map((palette, i) => {
    const isSelected = vfrActiveColor && vfrActiveColor.hex === palette.hex;
    return `
      <button type="button" class="vfr-palette-btn ${isSelected ? 'active' : ''}" 
              style="background-color: ${palette.hex};" 
              onclick="changeFittingColor('${palette.hex}', '${palette.name}', '${palette.filter}')"
              title="${palette.name}">
        ${isSelected ? '<i class="fa-solid fa-check"></i>' : ''}
      </button>
    `;
  }).join('');
}

function changeFittingColor(colorHex, colorName, filterRule) {
  vfrActiveColor = { hex: colorHex, name: colorName };

  // Update swatches active class
  renderFittingColorPalettes();

  // Apply visual styling
  const garmentImg = document.getElementById('fittingGarmentImg');
  const tintOverlay = document.getElementById('fittingTintOverlay');
  const footerColor = document.getElementById('vfrFooterColorName');

  if (footerColor) footerColor.textContent = colorName;

  if (garmentImg && tintOverlay) {
    if (filterRule && filterRule !== 'none') {
      garmentImg.style.filter = filterRule;
      tintOverlay.style.opacity = '0';
    } else if (colorHex && colorHex !== '#8B133E') {
      garmentImg.style.filter = 'none';
      tintOverlay.style.backgroundColor = colorHex;
      tintOverlay.style.opacity = '0.35';
    } else {
      garmentImg.style.filter = 'none';
      tintOverlay.style.opacity = '0';
    }
  }
}

function changeFittingLighting(mode) {
  vfrCurrentLighting = mode;

  // Update pills
  document.querySelectorAll('.lighting-pill').forEach(pill => {
    pill.classList.toggle('active', pill.getAttribute('data-light') === mode);
  });

  const canvas = document.getElementById('fittingMannequinCanvas');
  if (!canvas) return;

  if (mode === 'daylight') {
    canvas.style.filter = 'brightness(1) contrast(1) saturate(1)';
  } else if (mode === 'gala') {
    canvas.style.filter = 'brightness(0.92) contrast(1.15) hue-rotate(8deg) saturate(1.1)';
  } else if (mode === 'sunset') {
    canvas.style.filter = 'brightness(0.98) contrast(1.05) hue-rotate(-12deg) saturate(1.25)';
  }
}

function renderFittingStage() {
  const model = getFittingModelById(vfrCurrentModelId);
  const avatarImg = document.getElementById('fittingAvatarImg');
  const garmentImg = document.getElementById('fittingGarmentImg');
  const footerThumb = document.getElementById('vfrFooterThumb');
  const footerTitle = document.getElementById('vfrFooterTitle');
  const footerPrice = document.getElementById('vfrFooterPrice');
  const footerColorName = document.getElementById('vfrFooterColorName');

  if (avatarImg && model) {
    avatarImg.src = model.fullSilhouette || model.image;
  }

  if (vfrCurrentProduct) {
    if (garmentImg) garmentImg.src = vfrCurrentProduct.image;
    if (footerThumb) footerThumb.src = vfrCurrentProduct.image;
    if (footerTitle) footerTitle.textContent = vfrCurrentProduct.name;
    if (footerPrice) footerPrice.textContent = formatLKR(vfrCurrentProduct.price);
  }

  if (footerColorName && vfrActiveColor) {
    footerColorName.textContent = vfrActiveColor.name;
  }
}

function handleFittingMeasurementChange() {
  const sliderH = document.getElementById('sliderHeight');
  const sliderB = document.getElementById('sliderBust');
  const sliderW = document.getElementById('sliderWaist');
  const sliderHp = document.getElementById('sliderHip');

  const height = sliderH ? parseInt(sliderH.value) : 165;
  const bust = sliderB ? parseInt(sliderB.value) : 34;
  const waist = sliderW ? parseInt(sliderW.value) : 28;
  const hip = sliderHp ? parseInt(sliderHp.value) : 38;

  // Update slider numeric display
  const valH = document.getElementById('valSliderHeight');
  const valB = document.getElementById('valSliderBust');
  const valW = document.getElementById('valSliderWaist');
  const valHp = document.getElementById('valSliderHip');

  if (valH) valH.textContent = `${height} cm`;
  if (valB) valB.textContent = `${bust} in`;
  if (valW) valW.textContent = `${waist} in`;
  if (valHp) valHp.textContent = `${hip} in`;

  // Compute recommendation
  vfrFitResult = calculateBestFitSize(vfrCurrentGender, { height, chest: bust, waist, hip });

  // Update AI Result Card
  const aiScoreNum = document.getElementById('vfrAiScoreNumber');
  const aiSizeBadge = document.getElementById('vfrAiSizeBadge');
  const aiChestFb = document.getElementById('vfrAiChestFeedback');
  const aiWaistFb = document.getElementById('vfrAiWaistFeedback');
  const aiLengthFb = document.getElementById('vfrAiLengthFeedback');
  const aiComment = document.getElementById('vfrAiComment');

  if (aiScoreNum) aiScoreNum.textContent = `${vfrFitResult.matchPercent}%`;
  if (aiSizeBadge) aiSizeBadge.textContent = `Size ${vfrFitResult.recommendedSize}`;
  if (aiChestFb) aiChestFb.textContent = vfrFitResult.chestScore;
  if (aiWaistFb) aiWaistFb.textContent = vfrFitResult.waistScore;
  if (aiLengthFb) aiLengthFb.textContent = vfrFitResult.lengthScore;
  if (aiComment) aiComment.textContent = vfrFitResult.comment;

  // Update Overlay Badges
  const matchRateBadge = document.getElementById('vfrMatchRateBadge');
  const sizeAdviceBadge = document.getElementById('vfrSizeAdviceBadge');
  const footerSize = document.getElementById('vfrFooterSize');

  if (matchRateBadge) matchRateBadge.textContent = `${vfrFitResult.matchPercent}% Match`;
  if (sizeAdviceBadge) sizeAdviceBadge.textContent = `Recommended Size ${vfrFitResult.recommendedSize}`;
  if (footerSize) footerSize.textContent = vfrFitResult.recommendedSize;
}

function handleUserPhotoUpload(event) {
  const file = event.target.files && event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = function(e) {
    const avatarImg = document.getElementById('fittingAvatarImg');
    if (avatarImg) {
      avatarImg.src = e.target.result;
      showToast("Custom portrait loaded! Sriyani 3D drape overlay calibrated.", "success");
    }
  };
  reader.readAsDataURL(file);
}

function addFittedLookToCart() {
  if (!vfrCurrentProduct) return;

  const recommendedSize = vfrFitResult ? vfrFitResult.recommendedSize : (vfrCurrentProduct.sizes ? vfrCurrentProduct.sizes[0] : 'M');
  const chosenColor = vfrActiveColor ? vfrActiveColor.hex : null;

  addToCart(vfrCurrentProduct.id, 1, recommendedSize, chosenColor);
  closeVirtualFittingRoom();
  showToast(`Added ${vfrCurrentProduct.name} (${recommendedSize}) to your Bag!`, 'success');
}

function shareFittedLook() {
  const prodName = vfrCurrentProduct ? vfrCurrentProduct.name : "Sriyani Fashion";
  const size = vfrFitResult ? vfrFitResult.recommendedSize : "M";
  const color = vfrActiveColor ? vfrActiveColor.name : "Royal";

  const shareText = `Check out my fitted outfit on Sriyani 3D Fitting Room: ${prodName} (Size: ${size}, Shade: ${color})!`;

  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(shareText).then(() => {
      showToast("Fitted outfit copied to clipboard! Share it with friends or bridal party.", "success");
    }).catch(() => {
      showToast(shareText, "info");
    });
  } else {
    showToast(shareText, "info");
  }
}

