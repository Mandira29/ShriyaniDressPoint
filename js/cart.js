/**
 * Sriyani Dress Point - Cart, Wishlist & Online Payment Gateway Management
 */

const CART_STORAGE_KEY = 'sriyani_cart_v2';
const WISHLIST_STORAGE_KEY = 'sriyani_wishlist_v2';
const ORDERS_STORAGE_KEY = 'sriyani_orders_v2';
const FREE_SHIPPING_THRESHOLD = 10000;
const STANDARD_SHIPPING_FEE = 450;

// Seed Initial Sample Orders for Admin View
const DEFAULT_ORDERS = [
  {
    orderId: "SDP-2026-7812",
    customerName: "Chamari Atapattu",
    customerEmail: "chamari@gmail.com",
    customerPhone: "+94 77 123 4567",
    deliveryCity: "Kandy",
    deliveryAddress: "No. 42, Peradeniya Road, Kandy",
    items: [
      { name: "Royal Kanchipuram Silk Saree", quantity: 1, price: 18500, size: "Free Size" }
    ],
    subtotal: 18500,
    shippingFee: 0,
    total: 18500,
    paymentMethod: "Visa / Mastercard Online",
    paymentStatus: "PAID ONLINE",
    paymentReference: "TXN-VIS-9823410",
    orderDate: "2026-09-02T11:20:00Z"
  },
  {
    orderId: "SDP-2026-6401",
    customerName: "Dr. Danushka Jayasinghe",
    customerEmail: "danushka@gmail.com",
    customerPhone: "+94 71 987 6543",
    deliveryCity: "Kurunegala",
    deliveryAddress: "No. 15, Circular Road, Kurunegala",
    items: [
      { name: "Classic Men's Pure Linen Formal Shirt", quantity: 2, price: 4950, size: "L" },
      { name: "Handmade Sri Lankan Batik Sarong & Shirt Set", quantity: 1, price: 7850, size: "L" }
    ],
    subtotal: 17750,
    shippingFee: 0,
    total: 17750,
    paymentMethod: "Koko (Buy Now Pay Later)",
    paymentStatus: "PAID ONLINE (Koko 3x)",
    paymentReference: "KOKO-882319-LK",
    orderDate: "2026-09-04T15:45:00Z"
  }
];

function getOrdersList() {
  try {
    const data = localStorage.getItem(ORDERS_STORAGE_KEY);
    if (data) {
      return JSON.parse(data);
    }
  } catch (e) {
    console.error("Error loading orders", e);
  }
  localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(DEFAULT_ORDERS));
  return [...DEFAULT_ORDERS];
}

function saveOrdersList(orders) {
  try {
    localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(orders));
  } catch (e) {
    console.error("Error saving orders", e);
  }
}

// Currency Formatter
function formatLKR(amount) {
  return "LKR " + Number(amount).toLocaleString('en-US');
}

// Cart Storage Helper
function getCart() {
  try {
    const saved = localStorage.getItem(CART_STORAGE_KEY);
    return saved ? JSON.parse(saved) : [];
  } catch (e) {
    console.error("Error reading cart from localStorage", e);
    return [];
  }
}

function saveCart(cart) {
  try {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
    updateCartUI();
  } catch (e) {
    console.error("Error saving cart to localStorage", e);
  }
}

// Wishlist Storage Helper
function getWishlist() {
  try {
    const saved = localStorage.getItem(WISHLIST_STORAGE_KEY);
    return saved ? JSON.parse(saved) : [];
  } catch (e) {
    return [];
  }
}

function saveWishlist(wishlist) {
  try {
    localStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify(wishlist));
    updateWishlistUI();
  } catch (e) {
    console.error("Error saving wishlist", e);
  }
}

function toggleWishlist(productId) {
  let wishlist = getWishlist();
  const index = wishlist.indexOf(productId);
  let added = false;
  if (index > -1) {
    wishlist.splice(index, 1);
    added = false;
    showToast("Removed from your Wishlist", "info");
  } else {
    wishlist.push(productId);
    added = true;
    showToast("Added to your Wishlist ❤️", "success");
  }
  saveWishlist(wishlist);
  return added;
}

function isInWishlist(productId) {
  return getWishlist().includes(productId);
}

// Cart Actions
function addToCart(productId, quantity = 1, size = null, color = null) {
  const catalog = (typeof getProductsCatalog === 'function') ? getProductsCatalog() : PRODUCTS_DATA;
  const product = catalog.find(p => p.id === productId);
  if (!product) return;

  const chosenSize = size || (product.sizes && product.sizes[0]) || "Standard";
  const chosenColor = color || (product.colors && product.colors[0]) || null;

  let cart = getCart();
  const existingIndex = cart.findIndex(
    item => item.id === productId && item.size === chosenSize && item.color === chosenColor
  );

  if (existingIndex > -1) {
    cart[existingIndex].quantity += quantity;
  } else {
    cart.push({
      id: product.id,
      name: product.name,
      price: product.price,
      originalPrice: product.originalPrice,
      image: product.image,
      size: chosenSize,
      color: chosenColor,
      quantity: quantity
    });
  }

  saveCart(cart);
  showToast(`"${product.name}" added to bag!`, "success");
  openCartDrawer();
}

function updateCartItemQty(index, change) {
  let cart = getCart();
  if (cart[index]) {
    cart[index].quantity += change;
    if (cart[index].quantity <= 0) {
      cart.splice(index, 1);
      showToast("Item removed from bag", "info");
    }
    saveCart(cart);
  }
}

function removeCartItem(index) {
  let cart = getCart();
  if (cart[index]) {
    const itemName = cart[index].name;
    cart.splice(index, 1);
    saveCart(cart);
    showToast(`Removed "${itemName}"`, "info");
  }
}

function getCartTotals() {
  const cart = getCart();
  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const itemCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const isFreeShipping = subtotal >= FREE_SHIPPING_THRESHOLD || subtotal === 0;
  const shippingFee = (subtotal === 0 || isFreeShipping) ? 0 : STANDARD_SHIPPING_FEE;
  const finalTotal = subtotal + shippingFee;

  return { subtotal, itemCount, isFreeShipping, shippingFee, finalTotal };
}

// UI Updating
function updateCartUI() {
  const { subtotal, itemCount, isFreeShipping, shippingFee, finalTotal } = getCartTotals();
  const cart = getCart();

  // Badges
  document.querySelectorAll('.cart-badge-count').forEach(el => {
    el.textContent = itemCount;
    el.style.display = itemCount > 0 ? 'flex' : 'none';
  });

  // Drawer Items
  const itemsContainer = document.getElementById('cartDrawerItems');
  const cartEmptyState = document.getElementById('cartEmptyState');
  const cartFooter = document.getElementById('cartDrawerFooter');

  if (itemsContainer) {
    if (cart.length === 0) {
      itemsContainer.innerHTML = '';
      if (cartEmptyState) cartEmptyState.style.display = 'block';
      if (cartFooter) cartFooter.style.display = 'none';
    } else {
      if (cartEmptyState) cartEmptyState.style.display = 'none';
      if (cartFooter) cartFooter.style.display = 'block';

      itemsContainer.innerHTML = cart.map((item, index) => `
        <div class="cart-item">
          <img src="${item.image}" alt="${item.name}" class="cart-item-img" />
          <div class="cart-item-info">
            <h4 class="cart-item-title">${item.name}</h4>
            <div class="cart-item-meta">
              <span class="meta-tag">Size: ${item.size}</span>
              ${item.color ? `<span class="meta-color" style="background-color: ${item.color};"></span>` : ''}
            </div>
            <div class="cart-item-price">${formatLKR(item.price)}</div>
            <div class="cart-item-controls">
              <div class="qty-stepper">
                <button type="button" onclick="updateCartItemQty(${index}, -1)" aria-label="Decrease quantity">
                  <i class="fa-solid fa-minus"></i>
                </button>
                <span class="qty-value">${item.quantity}</span>
                <button type="button" onclick="updateCartItemQty(${index}, 1)" aria-label="Increase quantity">
                  <i class="fa-solid fa-plus"></i>
                </button>
              </div>
              <button type="button" class="btn-remove-item" onclick="removeCartItem(${index})" aria-label="Remove item">
                <i class="fa-regular fa-trash-can"></i>
              </button>
            </div>
          </div>
        </div>
      `).join('');
    }
  }

  // Shipping meter
  const shippingProgress = document.getElementById('freeShippingProgress');
  const shippingNotice = document.getElementById('freeShippingNotice');

  if (shippingProgress && shippingNotice) {
    if (subtotal === 0) {
      shippingProgress.style.width = '0%';
      shippingNotice.innerHTML = `Add <strong>${formatLKR(FREE_SHIPPING_THRESHOLD)}</strong> more for <strong>FREE Islandwide Delivery</strong>!`;
    } else if (isFreeShipping) {
      shippingProgress.style.width = '100%';
      shippingProgress.style.backgroundColor = '#10B981';
      shippingNotice.innerHTML = `🎉 <strong>Congratulations!</strong> You qualified for <strong>FREE Islandwide Delivery</strong>!`;
    } else {
      const remaining = FREE_SHIPPING_THRESHOLD - subtotal;
      const percent = Math.min(100, Math.round((subtotal / FREE_SHIPPING_THRESHOLD) * 100));
      shippingProgress.style.width = `${percent}%`;
      shippingProgress.style.backgroundColor = '#8B133E';
      shippingNotice.innerHTML = `Add <strong>${formatLKR(remaining)}</strong> more for <strong>FREE Islandwide Delivery</strong>!`;
    }
  }

  // Subtotals
  const subtotalEl = document.getElementById('cartSubtotalAmount');
  const shippingFeeEl = document.getElementById('cartShippingFee');
  const finalTotalEl = document.getElementById('cartFinalTotal');

  if (subtotalEl) subtotalEl.textContent = formatLKR(subtotal);
  if (shippingFeeEl) shippingFeeEl.textContent = isFreeShipping ? 'FREE' : formatLKR(shippingFee);
  if (finalTotalEl) finalTotalEl.textContent = formatLKR(finalTotal);
}

function updateWishlistUI() {
  const wishlist = getWishlist();
  document.querySelectorAll('.wishlist-badge-count').forEach(el => {
    el.textContent = wishlist.length;
    el.style.display = wishlist.length > 0 ? 'flex' : 'none';
  });

  document.querySelectorAll('[data-wishlist-id]').forEach(btn => {
    const id = parseInt(btn.getAttribute('data-wishlist-id'), 10);
    if (isInWishlist(id)) {
      btn.classList.add('active');
      btn.innerHTML = '<i class="fa-solid fa-heart"></i>';
    } else {
      btn.classList.remove('active');
      btn.innerHTML = '<i class="fa-regular fa-heart"></i>';
    }
  });
}

// Drawer Drawer Controls
function openCartDrawer() {
  const drawer = document.getElementById('cartDrawer');
  const backdrop = document.getElementById('cartBackdrop');
  if (drawer && backdrop) {
    drawer.classList.add('open');
    backdrop.classList.add('open');
    document.body.classList.add('no-scroll');
  }
}

function closeCartDrawer() {
  const drawer = document.getElementById('cartDrawer');
  const backdrop = document.getElementById('cartBackdrop');
  if (drawer && backdrop) {
    drawer.classList.remove('open');
    backdrop.classList.remove('open');
    document.body.classList.remove('no-scroll');
  }
}

/* ==========================================================================
   ONLINE PAYMENT GATEWAY & CHECKOUT FLOW
   ========================================================================== */

let selectedPaymentMethod = 'card';

function openPaymentGateway() {
  const cart = getCart();
  if (cart.length === 0) {
    showToast("Your shopping bag is empty. Please add items to checkout.", "warning");
    return;
  }

  // Check customer login session
  const session = (typeof getCurrentSession === 'function') ? getCurrentSession() : null;
  if (!session) {
    showToast("Please sign in or create an account to proceed to checkout!", "info");
    closeCartDrawer();
    openAuthModal('login');
    return;
  }

  closeCartDrawer();

  const modal = document.getElementById('paymentGatewayModal');
  const backdrop = document.getElementById('paymentGatewayBackdrop');
  if (!modal || !backdrop) return;

  const { subtotal, isFreeShipping, shippingFee, finalTotal } = getCartTotals();

  // Populate Customer & Order Details
  const nameInput = document.getElementById('checkoutCustomerName');
  const emailInput = document.getElementById('checkoutCustomerEmail');
  const phoneInput = document.getElementById('checkoutCustomerPhone');
  const cityInput = document.getElementById('checkoutDeliveryCity');

  if (nameInput) nameInput.value = session.name || '';
  if (emailInput) emailInput.value = session.email || '';
  if (phoneInput) phoneInput.value = session.phone || '';
  if (cityInput) cityInput.value = session.city || 'Colombo';

  // Populate Bill Summaries
  const subtotalDisplay = document.getElementById('checkoutSubtotal');
  const shippingDisplay = document.getElementById('checkoutShipping');
  const totalDisplay = document.getElementById('checkoutFinalTotal');
  const payBtnAmount = document.getElementById('payBtnAmountDisplay');
  const kokoInstallment = document.getElementById('kokoInstallmentCalc');

  if (subtotalDisplay) subtotalDisplay.textContent = formatLKR(subtotal);
  if (shippingDisplay) shippingDisplay.textContent = isFreeShipping ? 'FREE' : formatLKR(shippingFee);
  if (totalDisplay) totalDisplay.textContent = formatLKR(finalTotal);
  if (payBtnAmount) payBtnAmount.textContent = formatLKR(finalTotal);

  // Calculate 3-month installment (Koko & Mintpay)
  if (kokoInstallment) {
    const installment = Math.round(finalTotal / 3);
    kokoInstallment.textContent = formatLKR(installment);
  }

  switchPaymentMethod('card');

  modal.classList.add('open');
  backdrop.classList.add('open');
  document.body.classList.add('no-scroll');
}

function closePaymentGateway() {
  const modal = document.getElementById('paymentGatewayModal');
  const backdrop = document.getElementById('paymentGatewayBackdrop');
  if (modal && backdrop) {
    modal.classList.remove('open');
    backdrop.classList.remove('open');
    document.body.classList.remove('no-scroll');
  }
}

function switchPaymentMethod(method) {
  selectedPaymentMethod = method;

  document.querySelectorAll('.gateway-method-tab').forEach(tab => {
    tab.classList.toggle('active', tab.getAttribute('data-method') === method);
  });

  const cardPane = document.getElementById('gatewayPaneCard');
  const kokoPane = document.getElementById('gatewayPaneKoko');
  const mintpayPane = document.getElementById('gatewayPaneMintpay');
  const codPane = document.getElementById('gatewayPaneCod');

  if (cardPane) cardPane.style.display = method === 'card' ? 'block' : 'none';
  if (kokoPane) kokoPane.style.display = method === 'koko' ? 'block' : 'none';
  if (mintpayPane) mintpayPane.style.display = method === 'mintpay' ? 'block' : 'none';
  if (codPane) codPane.style.display = method === 'cod' ? 'block' : 'none';

  const payBtn = document.getElementById('btnSubmitPayment');
  if (payBtn) {
    if (method === 'card') {
      payBtn.innerHTML = `<i class="fa-solid fa-lock"></i> Pay <span id="payBtnAmountDisplay">${document.getElementById('checkoutFinalTotal').textContent}</span> Securely`;
    } else if (method === 'koko') {
      payBtn.innerHTML = `<i class="fa-solid fa-bolt"></i> Pay with Koko (3x Installments)`;
    } else if (method === 'mintpay') {
      payBtn.innerHTML = `<i class="fa-solid fa-credit-card"></i> Pay with Mintpay`;
    } else {
      payBtn.innerHTML = `<i class="fa-solid fa-truck-ramp-box"></i> Confirm Cash on Delivery Order`;
    }
  }
}

function processPayment(event) {
  event.preventDefault();

  const cart = getCart();
  if (cart.length === 0) return;

  const session = (typeof getCurrentSession === 'function') ? getCurrentSession() : null;
  const { subtotal, isFreeShipping, shippingFee, finalTotal } = getCartTotals();

  const customerName = document.getElementById('checkoutCustomerName').value || 'Customer';
  const customerEmail = document.getElementById('checkoutCustomerEmail').value || 'customer@sriyanidresspoint.lk';
  const customerPhone = document.getElementById('checkoutCustomerPhone').value || '+94 77 000 0000';
  const deliveryCity = document.getElementById('checkoutDeliveryCity').value || 'Colombo';
  const deliveryAddress = document.getElementById('checkoutDeliveryAddress').value || 'Main Street, Sri Lanka';

  // Loading animation on button
  const submitBtn = document.getElementById('btnSubmitPayment');
  const originalHtml = submitBtn.innerHTML;
  submitBtn.disabled = true;
  submitBtn.innerHTML = `<i class="fa-solid fa-circle-notch fa-spin"></i> Processing Payment Gateway...`;

  setTimeout(() => {
    // Generate Order ID & Reference
    const orderNum = Math.floor(1000 + Math.random() * 9000);
    const orderId = `SDP-2026-${orderNum}`;
    
    let paymentStatus = "PAID ONLINE";
    let paymentRef = `TXN-SDP-${Date.now().toString().slice(-6)}`;
    let methodLabel = "Visa / Mastercard Online Gateway";

    if (selectedPaymentMethod === 'koko') {
      paymentStatus = "PAID ONLINE (Koko 3x)";
      paymentRef = `KOKO-${Date.now().toString().slice(-6)}`;
      methodLabel = "Koko Buy Now Pay Later";
    } else if (selectedPaymentMethod === 'mintpay') {
      paymentStatus = "PAID ONLINE (Mintpay)";
      paymentRef = `MINT-${Date.now().toString().slice(-6)}`;
      methodLabel = "Mintpay Online Payment";
    } else if (selectedPaymentMethod === 'cod') {
      paymentStatus = "PENDING (Cash on Delivery)";
      paymentRef = `COD-${Date.now().toString().slice(-6)}`;
      methodLabel = "Cash on Delivery";
    }

    const orderData = {
      orderId,
      customerName,
      customerEmail,
      customerPhone,
      deliveryCity,
      deliveryAddress,
      items: cart.map(i => ({ name: i.name, quantity: i.quantity, price: i.price, size: i.size })),
      subtotal,
      shippingFee,
      total: finalTotal,
      paymentMethod: methodLabel,
      paymentStatus,
      paymentReference: paymentRef,
      orderDate: new Date().toISOString()
    };

    // Save to Orders List
    const orders = getOrdersList();
    orders.unshift(orderData);
    saveOrdersList(orders);

    // Empty Cart
    saveCart([]);

    submitBtn.disabled = false;
    submitBtn.innerHTML = originalHtml;
    closePaymentGateway();

    // Show Invoice Receipt
    showOrderSuccessInvoice(orderData);
    showToast(`Payment Successful! Order ${orderId} confirmed.`, "success");

    // Refresh Admin Orders view if admin is open
    if (typeof renderAdminOrdersTable === 'function') {
      renderAdminOrdersTable();
    }
  }, 1400);
}

function showOrderSuccessInvoice(order) {
  const modal = document.getElementById('orderInvoiceModal');
  const backdrop = document.getElementById('orderInvoiceBackdrop');
  const content = document.getElementById('orderInvoiceContent');

  if (!modal || !content) return;

  const dateStr = new Date(order.orderDate).toLocaleString('en-GB', {
    day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit'
  });

  content.innerHTML = `
    <div class="invoice-box" id="printableInvoice">
      <div class="invoice-header">
        <div class="invoice-brand">
          <div class="brand-emblem"><i class="fa-solid fa-gem"></i></div>
          <div>
            <h2 class="invoice-brand-name">SRIYANI DRESS POINT</h2>
            <small>Official Online Tax Invoice & Receipt</small>
          </div>
        </div>
        <div class="invoice-meta">
          <span class="invoice-badge-paid">${order.paymentStatus}</span>
          <div class="invoice-id">Order ID: <strong>${order.orderId}</strong></div>
          <div class="invoice-date">${dateStr}</div>
        </div>
      </div>

      <div class="invoice-parties">
        <div class="invoice-party-col">
          <strong>Billed & Shipped To:</strong>
          <p>${order.customerName}</p>
          <p>${order.deliveryAddress}, ${order.deliveryCity}</p>
          <p>Contact: ${order.customerPhone}</p>
          <p>Email: ${order.customerEmail}</p>
        </div>
        <div class="invoice-party-col right">
          <strong>Merchant Details:</strong>
          <p>Sriyani Dress Point (Pvt) Ltd</p>
          <p>Head Office: No. 189, Main Street, Kegalle</p>
          <p>Hotline: +94 35 222 3456</p>
          <p>Payment Ref: <code>${order.paymentReference}</code></p>
        </div>
      </div>

      <table class="invoice-items-table">
        <thead>
          <tr>
            <th>Item Description</th>
            <th>Size</th>
            <th>Qty</th>
            <th>Unit Price</th>
            <th class="text-right">Total</th>
          </tr>
        </thead>
        <tbody>
          ${order.items.map(it => `
            <tr>
              <td><strong>${it.name}</strong></td>
              <td>${it.size}</td>
              <td>${it.quantity}</td>
              <td>${formatLKR(it.price)}</td>
              <td class="text-right">${formatLKR(it.price * it.quantity)}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>

      <div class="invoice-totals">
        <div class="totals-row">
          <span>Subtotal:</span>
          <strong>${formatLKR(order.subtotal)}</strong>
        </div>
        <div class="totals-row">
          <span>Islandwide Delivery Fee:</span>
          <span>${order.shippingFee === 0 ? 'FREE' : formatLKR(order.shippingFee)}</span>
        </div>
        <div class="totals-row grand">
          <span>Total Paid in LKR:</span>
          <strong>${formatLKR(order.total)}</strong>
        </div>
      </div>

      <div class="invoice-footer-perk">
        <div class="perk-item">
          <i class="fa-solid fa-truck-fast"></i>
          <span>Estimated delivery within 1-3 business days across Sri Lanka.</span>
        </div>
        <div class="perk-item">
          <i class="fa-solid fa-rotate-left"></i>
          <span>7-Day Exchange available at any Sriyani Dress Point branch with this receipt.</span>
        </div>
      </div>
    </div>

    <div class="invoice-modal-actions">
      <button type="button" class="btn-primary" onclick="window.print();">
        <i class="fa-solid fa-print"></i> Print Official Receipt
      </button>
      <button type="button" class="btn-secondary" onclick="closeOrderInvoiceModal();">
        Continue Shopping
      </button>
    </div>
  `;

  modal.classList.add('open');
  if (backdrop) backdrop.classList.add('open');
  document.body.classList.add('no-scroll');
}

function closeOrderInvoiceModal() {
  const modal = document.getElementById('orderInvoiceModal');
  const backdrop = document.getElementById('orderInvoiceBackdrop');
  if (modal && backdrop) {
    modal.classList.remove('open');
    backdrop.classList.remove('open');
    document.body.classList.remove('no-scroll');
  }
}

// Toast Notification
function showToast(message, type = 'info') {
  let container = document.getElementById('toastContainer');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toastContainer';
    container.className = 'toast-container';
    document.body.appendChild(container);
  }

  const toast = document.createElement('div');
  toast.className = `toast-message toast-${type}`;
  
  let icon = '<i class="fa-solid fa-circle-check"></i>';
  if (type === 'info') icon = '<i class="fa-solid fa-circle-info"></i>';
  if (type === 'warning') icon = '<i class="fa-solid fa-triangle-exclamation"></i>';

  toast.innerHTML = `
    <span class="toast-icon">${icon}</span>
    <span class="toast-text">${message}</span>
  `;

  container.appendChild(toast);

  setTimeout(() => toast.classList.add('show'), 10);
  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => toast.remove(), 300);
  }, 3500);
}
