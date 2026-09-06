/**
 * Sriyani Dress Point - Authentication & Admin Portal State
 */

const USERS_STORAGE_KEY = 'sriyani_users_list_v2';
const SESSION_STORAGE_KEY = 'sriyani_active_session_v2';

// Default Admin & Pre-registered Customers
const DEFAULT_USERS = [
  {
    id: "admin-01",
    name: "Sriyani Central Administration",
    email: "admin@sriyanidresspoint.lk",
    phone: "+94 35 222 3456",
    city: "Kegalle",
    role: "admin",
    password: "admin123",
    registeredAt: "2026-01-10T10:00:00Z"
  },
  {
    id: "cust-01",
    name: "Chamari Atapattu",
    email: "chamari@gmail.com",
    phone: "+94 77 123 4567",
    city: "Kandy",
    role: "customer",
    password: "password123",
    registeredAt: "2026-08-15T14:30:00Z"
  },
  {
    id: "cust-02",
    name: "Dr. Danushka Jayasinghe",
    email: "danushka@gmail.com",
    phone: "+94 71 987 6543",
    city: "Kurunegala",
    role: "customer",
    password: "password123",
    registeredAt: "2026-08-28T09:15:00Z"
  }
];

function getUsersList() {
  try {
    const data = localStorage.getItem(USERS_STORAGE_KEY);
    if (data) {
      return JSON.parse(data);
    }
  } catch (e) {
    console.error("Error reading users from storage", e);
  }
  localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(DEFAULT_USERS));
  return [...DEFAULT_USERS];
}

function saveUsersList(users) {
  try {
    localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
  } catch (e) {
    console.error("Error saving users", e);
  }
}

function getCurrentSession() {
  try {
    const session = localStorage.getItem(SESSION_STORAGE_KEY);
    return session ? JSON.parse(session) : null;
  } catch (e) {
    return null;
  }
}

function setCurrentSession(user) {
  if (!user) {
    localStorage.removeItem(SESSION_STORAGE_KEY);
  } else {
    const safeUser = {
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      city: user.city,
      role: user.role,
      loginAt: new Date().toISOString()
    };
    localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(safeUser));
  }
  updateAuthUI();
}

// Registration
function registerCustomer(name, email, phone, city, password) {
  const users = getUsersList();
  const normalizedEmail = email.trim().toLowerCase();

  const existing = users.find(u => u.email.toLowerCase() === normalizedEmail);
  if (existing) {
    throw new Error("An account with this email address already exists.");
  }

  const newUser = {
    id: "cust-" + Date.now(),
    name: name.trim(),
    email: normalizedEmail,
    phone: phone.trim(),
    city: city.trim(),
    role: "customer",
    password: password,
    registeredAt: new Date().toISOString()
  };

  users.push(newUser);
  saveUsersList(users);

  setCurrentSession(newUser);
  return newUser;
}

// Login
function loginUser(email, password, expectedRole = 'customer') {
  const users = getUsersList();
  const normalizedEmail = email.trim().toLowerCase();

  const user = users.find(u => u.email.toLowerCase() === normalizedEmail);
  if (!user) {
    throw new Error("Invalid email or account does not exist.");
  }

  if (user.password !== password) {
    throw new Error("Incorrect password. Please try again.");
  }

  if (expectedRole === 'admin' && user.role !== 'admin') {
    throw new Error("Access denied. Admin privileges required.");
  }

  setCurrentSession(user);
  return user;
}

function logoutUser() {
  const session = getCurrentSession();
  const name = session ? session.name : "User";
  setCurrentSession(null);
  showToast(`You have successfully logged out, ${name}.`, "info");
}

// Admin Operations
function getAllCustomers() {
  const users = getUsersList();
  return users.filter(u => u.role === 'customer');
}

function deleteCustomer(email) {
  let users = getUsersList();
  users = users.filter(u => u.email.toLowerCase() !== email.toLowerCase());
  saveUsersList(users);
  if (typeof renderAdminCustomerTable === 'function') {
    renderAdminCustomerTable();
  }
  if (typeof updateAdminKPIs === 'function') {
    updateAdminKPIs();
  }
}

// UI State Synchronization (Enforces Customer Only Categories vs Admin Workspace)
function updateAuthUI() {
  const session = getCurrentSession();
  const userActionsSlot = document.getElementById('headerUserAuthSlot');
  const gateBanner = document.getElementById('guestAccountGate');
  const unlockedHeader = document.getElementById('customerUnlockedHeader');
  const customerNameDisplays = document.querySelectorAll('.customer-name-display');
  const adminTopBar = document.getElementById('adminTopBar');

  // Customer-only Sections
  const categoriesSection = document.getElementById('categories');
  const collectionSection = document.getElementById('collection');
  const dealsSection = document.getElementById('deals');
  const lookbookSection = document.getElementById('lookbook');

  // Admin-exclusive Workspace Section
  const adminMainWorkspace = document.getElementById('adminMainWorkspace');

  if (session) {
    customerNameDisplays.forEach(el => el.textContent = session.name);

    if (session.role === 'admin') {
      /* ==========================================================
         ADMIN VIEW: HIDE CATEGORIES & SHOPPING SECTIONS!
         DISPLAY DEDICATED ADMIN OPERATIONS WORKSPACE
         ========================================================== */
      if (categoriesSection) categoriesSection.style.display = 'none';
      if (collectionSection) collectionSection.style.display = 'none';
      if (dealsSection) dealsSection.style.display = 'none';
      if (lookbookSection) lookbookSection.style.display = 'none';
      if (gateBanner) gateBanner.style.display = 'none';
      if (unlockedHeader) unlockedHeader.style.display = 'none';

      // Show Admin Workspace
      if (adminMainWorkspace) adminMainWorkspace.style.display = 'block';
      if (adminTopBar) adminTopBar.style.display = 'block';

      if (userActionsSlot) {
        userActionsSlot.innerHTML = `
          <div class="user-auth-pill admin-pill">
            <i class="fa-solid fa-user-shield"></i>
            <span class="user-pill-name">Admin: ${session.name.split(' ')[0]}</span>
            <button type="button" class="btn-pill-logout" onclick="logoutUser()" title="Logout Admin">
              <i class="fa-solid fa-right-from-bracket"></i>
            </button>
          </div>
        `;
      }

      // Populate Admin Tables & KPIs
      if (typeof updateAdminKPIs === 'function') updateAdminKPIs();
      if (typeof renderAdminCustomerTable === 'function') renderAdminCustomerTable();
      if (typeof renderAdminOrdersTable === 'function') renderAdminOrdersTable();
      if (typeof renderAdminStockOrdersTable === 'function') renderAdminStockOrdersTable();
      if (typeof renderAdminSupplierInvoicesTable === 'function') renderAdminSupplierInvoicesTable();
      if (typeof renderAdminCatalogTable === 'function') renderAdminCatalogTable();

    } else {
      /* ==========================================================
         CUSTOMER VIEW: SHOW CATEGORIES (Men, Women, Kids, Bridal)!
         HIDE ADMIN WORKSPACE
         ========================================================== */
      if (adminMainWorkspace) adminMainWorkspace.style.display = 'none';
      if (adminTopBar) adminTopBar.style.display = 'none';

      // Show Customer Categories & Shopping
      if (categoriesSection) categoriesSection.style.display = 'block';
      if (collectionSection) collectionSection.style.display = 'block';
      if (dealsSection) dealsSection.style.display = 'block';
      if (lookbookSection) lookbookSection.style.display = 'block';

      if (gateBanner) gateBanner.style.display = 'none';
      if (unlockedHeader) unlockedHeader.style.display = 'block';

      if (userActionsSlot) {
        userActionsSlot.innerHTML = `
          <div class="user-auth-pill customer-pill">
            <div class="user-avatar-mini">
              <i class="fa-solid fa-user"></i>
            </div>
            <div class="user-pill-details">
              <span class="pill-greeting">Ayubowan,</span>
              <span class="user-pill-name">${session.name.split(' ')[0]}</span>
            </div>
            <button type="button" class="btn-pill-logout" onclick="logoutUser()" title="Logout">
              <i class="fa-solid fa-right-from-bracket"></i>
            </button>
          </div>
        `;
      }
    }
  } else {
    /* ==========================================================
       GUEST VIEW: Prompt Account Creation / Login
       ========================================================== */
    if (adminTopBar) adminTopBar.style.display = 'none';
    if (adminMainWorkspace) adminMainWorkspace.style.display = 'none';
    if (unlockedHeader) unlockedHeader.style.display = 'none';

    // Show guest gate banner above categories
    if (categoriesSection) categoriesSection.style.display = 'block';
    if (gateBanner) gateBanner.style.display = 'block';
    if (collectionSection) collectionSection.style.display = 'block';
    if (dealsSection) dealsSection.style.display = 'block';
    if (lookbookSection) lookbookSection.style.display = 'block';

    if (userActionsSlot) {
      userActionsSlot.innerHTML = `
        <button type="button" class="btn-header-login" onclick="openAuthModal('login')">
          <i class="fa-regular fa-user"></i> Sign In
        </button>
        <button type="button" class="btn-header-register" onclick="openAuthModal('register')">
          Join Free
        </button>
      `;
    }
  }

  // Refresh products in customer view
  if (typeof renderProducts === 'function' && (!session || session.role === 'customer')) {
    const activeFilter = document.querySelector('.product-filter-btn.active');
    const cat = activeFilter ? activeFilter.getAttribute('data-filter') : 'all';
    renderProducts(cat);
  }
}
