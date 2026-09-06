/**
 * Sriyani Dress Point - Catalog & Branch Dataset
 */

const DEFAULT_PRODUCTS = [
  {
    id: 1,
    name: "Royal Kanchipuram Silk Saree",
    category: "sarees",
    price: 18500,
    originalPrice: 24000,
    discount: "-23%",
    rating: 4.9,
    reviews: 84,
    image: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80",
    badge: "Exclusive",
    description: "Exquisite hand-woven pure Kanchipuram silk saree with intricate golden zari border and matching blouse piece. Ideal for weddings and Sri Lankan celebrations.",
    sizes: ["Free Size"],
    colors: ["#800020", "#C59B27", "#1A472A"],
    tag: "Trending"
  },
  {
    id: 2,
    name: "Classic Men's Pure Linen Formal Shirt",
    category: "men",
    price: 4950,
    originalPrice: 6200,
    discount: "-20%",
    rating: 4.8,
    reviews: 62,
    image: "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=800&q=80",
    badge: "Bestseller",
    description: "Breathable 100% pure European linen shirt, tailored for Sri Lankan tropical comfort. Perfect for office elegance or evening occasions.",
    sizes: ["S", "M", "L", "XL", "XXL"],
    colors: ["#FFFFFF", "#E0F2FE", "#CBD5E1"],
    tag: "Men"
  },
  {
    id: 3,
    name: "Handmade Sri Lankan Batik Sarong & Shirt Set",
    category: "men",
    price: 7850,
    originalPrice: 9500,
    discount: "-17%",
    rating: 4.9,
    reviews: 47,
    image: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=800&q=80",
    badge: "Heritage",
    description: "Artisan crafted authentic Sri Lankan batik print cotton sarong paired with a coordinated modern collar shirt. A festive staple.",
    sizes: ["M", "L", "XL"],
    colors: ["#1E3A8A", "#78350F", "#065F46"],
    tag: "Traditional"
  },
  {
    id: 4,
    name: "Floral Embroidered Georgette Anarkali Gown",
    category: "women",
    price: 12900,
    originalPrice: 16500,
    discount: "-22%",
    rating: 4.7,
    reviews: 53,
    image: "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=800&q=80",
    badge: "New",
    description: "Graceful floor-length georgette party frock embellished with hand-embroidered sequin patterns and a lightweight dupatta.",
    sizes: ["S", "M", "L", "XL"],
    colors: ["#F43F5E", "#A855F7", "#0EA5E9"],
    tag: "Women"
  },
  {
    id: 5,
    name: "Luxury Bridal Red Velvet Lehenga Choli",
    category: "bridal",
    price: 48000,
    originalPrice: 60000,
    discount: "-20%",
    rating: 5.0,
    reviews: 38,
    image: "https://images.unsplash.com/photo-1594552072238-b8a33785b261?auto=format&fit=crop&w=800&q=80",
    badge: "Bridal Couture",
    description: "Masterpiece bridal attire with heavy zardozi, crystal work, cutdana detailing on deep crimson micro-velvet. Includes dual dupatta.",
    sizes: ["Custom Fit", "M", "L"],
    colors: ["#881337", "#B91C1C"],
    tag: "Bridal"
  },
  {
    id: 6,
    name: "Men's Tailored Wool-Blend Blazer Suit",
    category: "men",
    price: 19800,
    originalPrice: 25000,
    discount: "-21%",
    rating: 4.8,
    reviews: 41,
    image: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=800&q=80",
    badge: "Premium",
    description: "Slim-fit structured tuxedo blazer with satin shawl lapel. Tailored for galas, red carpet events, and wedding guests.",
    sizes: ["38R", "40R", "42R", "44R"],
    colors: ["#0F172A", "#1E293B", "#334155"],
    tag: "Men"
  },
  {
    id: 7,
    name: "Girls' Princess Embroidered Tulle Party Frock",
    category: "kids",
    price: 5200,
    originalPrice: 6500,
    discount: "-20%",
    rating: 4.9,
    reviews: 79,
    image: "https://images.unsplash.com/photo-1518831959646-742c3a14ebf7?auto=format&fit=crop&w=800&q=80",
    badge: "Kids Special",
    description: "Soft layered tulle frock with floral bodice, ribbon waistband, and skin-friendly cotton lining for maximum comfort.",
    sizes: ["2-3 Yrs", "4-5 Yrs", "6-7 Yrs", "8-9 Yrs"],
    colors: ["#FCE7F3", "#FEF08A", "#E0E7FF"],
    tag: "Kids"
  },
  {
    id: 8,
    name: "Boys' Festive Kurta Pyjama with Silk Waistcoat",
    category: "kids",
    price: 5800,
    originalPrice: 7200,
    discount: "-19%",
    rating: 4.8,
    reviews: 35,
    image: "https://images.unsplash.com/photo-1622290291468-a28f7a7dc6a8?auto=format&fit=crop&w=800&q=80",
    badge: "Festive",
    description: "Traditional 3-piece boys' ethnic set featuring a jacquard brocade vest, soft cotton kurta, and comfortable pajama bottoms.",
    sizes: ["3-4 Yrs", "5-6 Yrs", "7-8 Yrs", "9-10 Yrs"],
    colors: ["#D97706", "#2563EB", "#059669"],
    tag: "Kids"
  },
  {
    id: 9,
    name: "Contemporary Sri Lankan Handloom Cotton Saree",
    category: "sarees",
    price: 9400,
    originalPrice: 11500,
    discount: "-18%",
    rating: 4.9,
    reviews: 92,
    image: "https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=800&q=80",
    badge: "Eco Cotton",
    description: "Handwoven in Sri Lanka with 100% natural dyed cotton threads. Lightweight, elegant geometric motifs for stylish office wear.",
    sizes: ["Free Size"],
    colors: ["#0284C7", "#EA580C", "#475569"],
    tag: "Sarees"
  },
  {
    id: 10,
    name: "Women's Elegant Pastel Chiffon Maxi Dress",
    category: "women",
    price: 6450,
    originalPrice: 8200,
    discount: "-21%",
    rating: 4.7,
    reviews: 64,
    image: "https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?auto=format&fit=crop&w=800&q=80",
    badge: "Trending",
    description: "Flowy layered chiffon dress with flutter sleeves, pleated waistline, and an effortless silhouette for afternoon events.",
    sizes: ["S", "M", "L", "XL"],
    colors: ["#FED7AA", "#E9D5FF", "#BBF7D0"],
    tag: "Women"
  }
];

const PRODUCTS_STORAGE_KEY = 'sriyani_products_v2';

// Dynamic Catalog Storage Functions
function getProductsCatalog() {
  try {
    const stored = localStorage.getItem(PRODUCTS_STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (e) {
    console.error("Error loading products from storage", e);
  }
  // Initialize with defaults if empty
  localStorage.setItem(PRODUCTS_STORAGE_KEY, JSON.stringify(DEFAULT_PRODUCTS));
  return [...DEFAULT_PRODUCTS];
}

function saveProductsCatalog(products) {
  try {
    localStorage.setItem(PRODUCTS_STORAGE_KEY, JSON.stringify(products));
    window.PRODUCTS_DATA = products;
  } catch (e) {
    console.error("Error saving products to storage", e);
  }
}

function addNewProductToCatalog(productData) {
  const products = getProductsCatalog();
  const nextId = products.length > 0 ? Math.max(...products.map(p => p.id)) + 1 : 1;
  
  const newProduct = {
    id: nextId,
    name: productData.name,
    category: productData.category.toLowerCase(),
    price: Number(productData.price),
    originalPrice: productData.originalPrice ? Number(productData.originalPrice) : null,
    discount: productData.discount || (productData.originalPrice ? `-${Math.round((1 - productData.price / productData.originalPrice) * 100)}%` : null),
    rating: 5.0,
    reviews: 1,
    image: productData.image || "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=800&q=80",
    badge: productData.badge || "New Arrival",
    description: productData.description || "Premium designer clothing from Sriyani Dress Point.",
    sizes: productData.sizes && productData.sizes.length ? productData.sizes : ["Free Size"],
    colors: productData.colors && productData.colors.length ? productData.colors : ["#8B133E"],
    tag: productData.category.toUpperCase()
  };

  products.unshift(newProduct);
  saveProductsCatalog(products);
  return newProduct;
}

function removeProductFromCatalog(productId) {
  let products = getProductsCatalog();
  products = products.filter(p => p.id !== productId);
  saveProductsCatalog(products);
}

// Global reference
window.PRODUCTS_DATA = getProductsCatalog();

const BRANCHES_DATA = [
  {
    id: "kegalle-flagship",
    name: "Kegalle Main Flagship Showroom",
    city: "Kegalle",
    district: "Sabaragamuwa",
    address: "No. 189, Main Street, Kegalle, Sri Lanka",
    phone: "+94 35 222 2456 / +94 35 222 3456",
    email: "kegalle@sriyanidresspoint.lk",
    hours: "Mon - Sun: 9:00 AM - 9:00 PM",
    features: ["Flagship Mega Store", "Bridal Studio", "Tailoring Center", "Ample Car Parking", "Elevator & AC"],
    isFlagship: true,
    mapQuery: "Sriyani+Dress+Point+Kegalle"
  },
  {
    id: "kurunegala-mega",
    name: "Kurunegala Mega Showroom",
    city: "Kurunegala",
    district: "North Western",
    address: "No. 45, Colombo Road, Kurunegala, Sri Lanka",
    phone: "+94 37 222 9870",
    email: "kurunegala@sriyanidresspoint.lk",
    hours: "Mon - Sun: 9:00 AM - 9:00 PM",
    features: ["Multi-Story Showroom", "Kids Play Area", "Gents Executive Zone", "Valet Parking"],
    isFlagship: true,
    mapQuery: "Sriyani+Dress+Point+Kurunegala"
  },
  {
    id: "kandy-city",
    name: "Kandy Grand Showroom",
    city: "Kandy",
    district: "Central",
    address: "No. 88, Dalada Veediya, Kandy, Sri Lanka",
    phone: "+94 81 223 4455",
    email: "kandy@sriyanidresspoint.lk",
    hours: "Mon - Sun: 9:00 AM - 8:30 PM",
    features: ["Heritage Collection", "Saree Palace", "Western Wear", "Credit Card Offers"],
    isFlagship: false,
    mapQuery: "Sriyani+Dress+Point+Kandy"
  },
  {
    id: "ratnapura-gem",
    name: "Ratnapura City Center Branch",
    city: "Ratnapura",
    district: "Sabaragamuwa",
    address: "No. 112, Main Street, Ratnapura, Sri Lanka",
    phone: "+94 45 222 3123",
    email: "ratnapura@sriyanidresspoint.lk",
    hours: "Mon - Sun: 9:00 AM - 8:30 PM",
    features: ["Full Family Range", "Bridal Sarees", "Cosmetics Counter", "Easy Wheelchair Access"],
    isFlagship: false,
    mapQuery: "Sriyani+Dress+Point+Ratnapura"
  },
  {
    id: "matale-store",
    name: "Matale Prestige Showroom",
    city: "Matale",
    district: "Central",
    address: "No. 74, Trincomalee Street, Matale, Sri Lanka",
    phone: "+94 66 222 4589",
    email: "matale@sriyanidresspoint.lk",
    hours: "Mon - Sun: 9:00 AM - 8:30 PM",
    features: ["School Uniforms", "Casual & Party Wear", "Gift Vouchers", "Dedicated Customer Desk"],
    isFlagship: false,
    mapQuery: "Sriyani+Dress+Point+Matale"
  },
  {
    id: "negombo-coastal",
    name: "Negombo Coastal Showroom",
    city: "Negombo",
    district: "Western",
    address: "No. 230, Greens Road, Negombo, Sri Lanka",
    phone: "+94 31 223 8890",
    email: "negombo@sriyanidresspoint.lk",
    hours: "Mon - Sun: 9:30 AM - 9:00 PM",
    features: ["Tourist Fashion Corner", "Linen & Resort Wear", "Kids Fun Section", "Multi-lingual Staff"],
    isFlagship: false,
    mapQuery: "Sriyani+Dress+Point+Negombo"
  },
  {
    id: "gampaha-metro",
    name: "Gampaha City Branch",
    city: "Gampaha",
    district: "Western",
    address: "No. 15, Yakkala Road, Gampaha, Sri Lanka",
    phone: "+94 33 222 7654",
    email: "gampaha@sriyanidresspoint.lk",
    hours: "Mon - Sun: 9:00 AM - 8:30 PM",
    features: ["Office Wear Specialist", "Saree Draping Demos", "VIP Fitting Rooms"],
    isFlagship: false,
    mapQuery: "Sriyani+Dress+Point+Gampaha"
  },
  {
    id: "badulla-hillside",
    name: "Badulla Town Showroom",
    city: "Badulla",
    district: "Uva",
    address: "No. 32, Lower King Street, Badulla, Sri Lanka",
    phone: "+94 55 222 6543",
    email: "badulla@sriyanidresspoint.lk",
    hours: "Mon - Sun: 8:30 AM - 8:00 PM",
    features: ["Winter/Warm Wear Collection", "Traditional Clothing", "Family Fashion"],
    isFlagship: false,
    mapQuery: "Sriyani+Dress+Point+Badulla"
  }
];

const TESTIMONIALS_DATA = [
  {
    id: 1,
    name: "Chamari Atapattu",
    location: "Kandy, Sri Lanka",
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80",
    rating: 5,
    review: "Sriyani Dress Point is our family's trusted shopping paradise for every festive season. The Kanchipuram sarees and bridal selection at Kegalle showroom are unmatched anywhere in Sri Lanka!",
    purchase: "Royal Silk Saree & Party Wear"
  },
  {
    id: 2,
    name: "Dr. Danushka Jayasinghe",
    location: "Kurunegala, Sri Lanka",
    avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=200&q=80",
    rating: 5,
    review: "Superb quality pure linen shirts and formal suits. Their customer care at the Kurunegala showroom is outstanding with ample parking. Online delivery was swift within 48 hours.",
    purchase: "Men's Executive Suite & Linen Shirts"
  },
  {
    id: 3,
    name: "Nadeeka Wickramasinghe",
    location: "Negombo, Sri Lanka",
    avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80",
    rating: 5,
    review: "I ordered dresses for my daughters and batik sets for my husband. The fabrics are very soft, breathable, and colorfast. Best shopping experience with prompt cash on delivery!",
    purchase: "Kids Party Wear & Batik Sarong Set"
  }
];

/* ==========================================================================
   B2B SUPPLIERS, PURCHASE ORDERS & INVOICES MANAGEMENT
   ========================================================================== */
const STORAGE_KEY_SUPPLIERS = 'sriyani_suppliers_v2';
const STORAGE_KEY_PURCHASE_ORDERS = 'sriyani_purchase_orders_v2';
const STORAGE_KEY_SUPPLIER_INVOICES = 'sriyani_supplier_invoices_v2';

const DEFAULT_SUPPLIERS = [
  {
    id: "sup-1",
    name: "MAS Holdings Lanka",
    category: "Activewear & Performance Textiles",
    contactPerson: "Mr. Rohan Perera",
    email: "procurement@masholdings.lk",
    phone: "+94 11 472 8000",
    city: "Colombo",
    vatNumber: "VAT-LK-10029384",
    leadTimeDays: 7,
    rating: 4.9,
    status: "Active"
  },
  {
    id: "sup-2",
    name: "Brandix Textiles Ltd",
    category: "Pure Linen & Woven Cotton",
    contactPerson: "Ms. Shalini Fernando",
    email: "orders@brandix.com",
    phone: "+94 11 472 7000",
    city: "Seethawaka",
    vatNumber: "VAT-LK-20048192",
    leadTimeDays: 10,
    rating: 4.8,
    status: "Active"
  },
  {
    id: "sup-3",
    name: "Kandy Royal Silks & Sarees",
    category: "Handloom Silk & Kandyan Bridal Weaves",
    contactPerson: "Mr. Bandara Wickramasinghe",
    email: "sales@kandysilks.lk",
    phone: "+94 81 223 4455",
    city: "Kandy",
    vatNumber: "VAT-LK-30017283",
    leadTimeDays: 14,
    rating: 5.0,
    status: "Active"
  },
  {
    id: "sup-4",
    name: "Colombo Fashion Mills",
    category: "Bridal Lehengas & Embroidered Net",
    contactPerson: "Mrs. Farzana Ameer",
    email: "orders@colombofashionmills.com",
    phone: "+94 11 258 9900",
    city: "Colombo 03",
    vatNumber: "VAT-LK-40092817",
    leadTimeDays: 12,
    rating: 4.9,
    status: "Active"
  },
  {
    id: "sup-5",
    name: "Kegalle Lace & Embroidery Studio",
    category: "Traditional Avurudu Garments & Lace",
    contactPerson: "Mr. Samantha Jayasuriya",
    email: "lace@kegallecrafts.lk",
    phone: "+94 35 222 8899",
    city: "Kegalle",
    vatNumber: "VAT-LK-50061728",
    leadTimeDays: 5,
    rating: 4.7,
    status: "Active"
  },
  {
    id: "sup-6",
    name: "Hameedia Garment Industries",
    category: "Men's Tailoring & Formal Fabrics",
    contactPerson: "Mr. Nimal Dissanayake",
    email: "corporate@hameedia.com",
    phone: "+94 11 280 8888",
    city: "Ratmalana",
    vatNumber: "VAT-LK-60039281",
    leadTimeDays: 8,
    rating: 4.8,
    status: "Active"
  }
];

const DEFAULT_PURCHASE_ORDERS = [
  {
    poId: "PO-SRI-2026-101",
    supplierId: "sup-2",
    supplierName: "Brandix Textiles Ltd",
    category: "men",
    categoryName: "Men's Wear",
    itemName: "Pure Irish Linen Rolls (100% Breathable Weave - 500m)",
    quantity: 50,
    unitCost: 12000,
    subtotal: 600000,
    tax: 90000,
    total: 690000,
    deliveryBranch: "Kegalle Central Warehouse (Flagship)",
    orderDate: "2026-09-01T10:30:00Z",
    expectedDate: "2026-09-12",
    priority: "Express Urgent",
    status: "Dispatched",
    invoiceId: "INV-SUP-8821",
    notes: "Priority shipment for festive season men's linen collection."
  },
  {
    poId: "PO-SRI-2026-102",
    supplierId: "sup-3",
    supplierName: "Kandy Royal Silks & Sarees",
    category: "sarees",
    categoryName: "Sarees & Silk",
    itemName: "Handloom Pure Silk Sarees with Zari Embroidery (40 Units)",
    quantity: 40,
    unitCost: 22500,
    subtotal: 900000,
    tax: 135000,
    total: 1035000,
    deliveryBranch: "Kandy Grand Showroom",
    orderDate: "2026-09-02T14:15:00Z",
    expectedDate: "2026-09-16",
    priority: "Standard",
    status: "In Production",
    invoiceId: "INV-SUP-8822",
    notes: "Bridal season Kanchipuram and Kandyan gold-woven silks."
  },
  {
    poId: "PO-SRI-2026-103",
    supplierId: "sup-4",
    supplierName: "Colombo Fashion Mills",
    category: "bridal",
    categoryName: "Bridal Studio",
    itemName: "Royal Velvet & Silk Thread Embroidered Lehengas (15 Sets)",
    quantity: 15,
    unitCost: 45000,
    subtotal: 675000,
    tax: 101250,
    total: 776250,
    deliveryBranch: "Kegalle Main Flagship Showroom",
    orderDate: "2026-08-28T09:00:00Z",
    expectedDate: "2026-09-05",
    priority: "Express Urgent",
    status: "Delivered",
    invoiceId: "INV-SUP-8819",
    notes: "Exclusive designer pieces for upcoming bridal expo showcase."
  },
  {
    poId: "PO-SRI-2026-104",
    supplierId: "sup-1",
    supplierName: "MAS Holdings Lanka",
    category: "women",
    categoryName: "Women's Wear",
    itemName: "Breathable Organic Cotton Floral Print Bundles (200 Units)",
    quantity: 200,
    unitCost: 2800,
    subtotal: 560000,
    tax: 84000,
    total: 644000,
    deliveryBranch: "Kurunegala Mega Showroom",
    orderDate: "2026-09-03T11:45:00Z",
    expectedDate: "2026-09-10",
    priority: "Standard",
    status: "Confirmed",
    invoiceId: "INV-SUP-8824",
    notes: "Summer casual frock & top replenishment."
  }
];

const DEFAULT_SUPPLIER_INVOICES = [
  {
    invoiceId: "INV-SUP-8819",
    poId: "PO-SRI-2026-103",
    supplierId: "sup-4",
    supplierName: "Colombo Fashion Mills",
    supplierEmail: "orders@colombofashionmills.com",
    supplierPhone: "+94 11 258 9900",
    supplierCity: "Colombo 03",
    supplierVat: "VAT-LK-40092817",
    itemName: "Royal Velvet & Silk Thread Embroidered Lehengas (15 Sets)",
    quantity: 15,
    unitCost: 45000,
    subtotal: 675000,
    tax: 101250,
    totalAmount: 776250,
    deliveryBranch: "Kegalle Main Flagship Showroom",
    issueDate: "2026-08-28",
    dueDate: "2026-09-10",
    paymentStatus: "Paid",
    paymentDate: "2026-09-02T16:30:00Z",
    paymentMethod: "Commercial Bank Corporate Direct Wire",
    paymentRef: "CB-WIRE-9920194",
    settledBy: "Finance Director (Admin Portal)"
  },
  {
    invoiceId: "INV-SUP-8821",
    poId: "PO-SRI-2026-101",
    supplierId: "sup-2",
    supplierName: "Brandix Textiles Ltd",
    supplierEmail: "orders@brandix.com",
    supplierPhone: "+94 11 472 7000",
    supplierCity: "Seethawaka",
    supplierVat: "VAT-LK-20048192",
    itemName: "Pure Irish Linen Rolls (100% Breathable Weave - 500m)",
    quantity: 50,
    unitCost: 12000,
    subtotal: 600000,
    tax: 90000,
    totalAmount: 690000,
    deliveryBranch: "Kegalle Central Warehouse (Flagship)",
    issueDate: "2026-09-01",
    dueDate: "2026-09-15",
    paymentStatus: "Pending",
    paymentDate: null,
    paymentMethod: null,
    paymentRef: null,
    settledBy: null
  },
  {
    invoiceId: "INV-SUP-8822",
    poId: "PO-SRI-2026-102",
    supplierId: "sup-3",
    supplierName: "Kandy Royal Silks & Sarees",
    supplierEmail: "sales@kandysilks.lk",
    supplierPhone: "+94 81 223 4455",
    supplierCity: "Kandy",
    supplierVat: "VAT-LK-30017283",
    itemName: "Handloom Pure Silk Sarees with Zari Embroidery (40 Units)",
    quantity: 40,
    unitCost: 22500,
    subtotal: 900000,
    tax: 135000,
    totalAmount: 1035000,
    deliveryBranch: "Kandy Grand Showroom",
    issueDate: "2026-09-02",
    dueDate: "2026-09-20",
    paymentStatus: "Pending",
    paymentDate: null,
    paymentMethod: null,
    paymentRef: null,
    settledBy: null
  },
  {
    invoiceId: "INV-SUP-8824",
    poId: "PO-SRI-2026-104",
    supplierId: "sup-1",
    supplierName: "MAS Holdings Lanka",
    supplierEmail: "procurement@masholdings.lk",
    supplierPhone: "+94 11 472 8000",
    supplierCity: "Colombo",
    supplierVat: "VAT-LK-10029384",
    itemName: "Breathable Organic Cotton Floral Print Bundles (200 Units)",
    quantity: 200,
    unitCost: 2800,
    subtotal: 560000,
    tax: 84000,
    totalAmount: 644000,
    deliveryBranch: "Kurunegala Mega Showroom",
    issueDate: "2026-09-03",
    dueDate: "2026-09-18",
    paymentStatus: "Pending",
    paymentDate: null,
    paymentMethod: null,
    paymentRef: null,
    settledBy: null
  }
];

function getSuppliers() {
  const stored = localStorage.getItem(STORAGE_KEY_SUPPLIERS);
  if (!stored) {
    localStorage.setItem(STORAGE_KEY_SUPPLIERS, JSON.stringify(DEFAULT_SUPPLIERS));
    return DEFAULT_SUPPLIERS;
  }
  try {
    return JSON.parse(stored);
  } catch (e) {
    return DEFAULT_SUPPLIERS;
  }
}

function getSupplierById(id) {
  const suppliers = getSuppliers();
  return suppliers.find(s => s.id === id) || null;
}

function getPurchaseOrders() {
  const stored = localStorage.getItem(STORAGE_KEY_PURCHASE_ORDERS);
  if (!stored) {
    localStorage.setItem(STORAGE_KEY_PURCHASE_ORDERS, JSON.stringify(DEFAULT_PURCHASE_ORDERS));
    return DEFAULT_PURCHASE_ORDERS;
  }
  try {
    return JSON.parse(stored);
  } catch (e) {
    return DEFAULT_PURCHASE_ORDERS;
  }
}

function savePurchaseOrders(orders) {
  localStorage.setItem(STORAGE_KEY_PURCHASE_ORDERS, JSON.stringify(orders));
}

function getSupplierInvoices() {
  const stored = localStorage.getItem(STORAGE_KEY_SUPPLIER_INVOICES);
  if (!stored) {
    localStorage.setItem(STORAGE_KEY_SUPPLIER_INVOICES, JSON.stringify(DEFAULT_SUPPLIER_INVOICES));
    return DEFAULT_SUPPLIER_INVOICES;
  }
  try {
    return JSON.parse(stored);
  } catch (e) {
    return DEFAULT_SUPPLIER_INVOICES;
  }
}

function saveSupplierInvoices(invoices) {
  localStorage.setItem(STORAGE_KEY_SUPPLIER_INVOICES, JSON.stringify(invoices));
}

function getSupplierInvoiceById(invoiceId) {
  const invoices = getSupplierInvoices();
  return invoices.find(inv => inv.invoiceId === invoiceId) || null;
}

function createPurchaseOrder(orderData) {
  const purchaseOrders = getPurchaseOrders();
  const invoices = getSupplierInvoices();
  const suppliers = getSuppliers();

  const supplier = suppliers.find(s => s.id === orderData.supplierId) || {
    name: orderData.supplierName || "Direct Garment Supplier",
    email: "sales@supplier.lk",
    phone: "+94 11 000 0000",
    city: "Colombo",
    vatNumber: "VAT-LK-000000"
  };

  const randomDigits = Math.floor(100 + Math.random() * 900);
  const poId = `PO-SRI-2026-${randomDigits}`;
  const invoiceId = `INV-SUP-${8800 + randomDigits}`;

  const quantity = Number(orderData.quantity) || 1;
  const unitCost = Number(orderData.unitCost) || 0;
  const subtotal = quantity * unitCost;
  const tax = Math.round(subtotal * 0.15); // 15% VAT
  const total = subtotal + tax;

  const now = new Date();
  const dueDate = new Date();
  dueDate.setDate(now.getDate() + 15);

  const newPO = {
    poId,
    supplierId: orderData.supplierId,
    supplierName: supplier.name,
    category: orderData.category,
    categoryName: orderData.categoryName || orderData.category.toUpperCase(),
    itemName: orderData.itemName,
    quantity,
    unitCost,
    subtotal,
    tax,
    total,
    deliveryBranch: orderData.deliveryBranch || "Kegalle Central Warehouse (Flagship)",
    orderDate: now.toISOString(),
    expectedDate: orderData.expectedDate || dueDate.toISOString().split('T')[0],
    priority: orderData.priority || "Standard",
    status: "Confirmed",
    invoiceId,
    notes: orderData.notes || "Official procurement order by Sriyani Dress Point Purchasing Dept."
  };

  const newInvoice = {
    invoiceId,
    poId,
    supplierId: supplier.id,
    supplierName: supplier.name,
    supplierEmail: supplier.email,
    supplierPhone: supplier.phone,
    supplierCity: supplier.city,
    supplierVat: supplier.vatNumber,
    itemName: orderData.itemName,
    quantity,
    unitCost,
    subtotal,
    tax,
    totalAmount: total,
    deliveryBranch: newPO.deliveryBranch,
    issueDate: now.toISOString().split('T')[0],
    dueDate: dueDate.toISOString().split('T')[0],
    paymentStatus: "Pending",
    paymentDate: null,
    paymentMethod: null,
    paymentRef: null,
    settledBy: null
  };

  purchaseOrders.unshift(newPO);
  invoices.unshift(newInvoice);

  savePurchaseOrders(purchaseOrders);
  saveSupplierInvoices(invoices);

  return { po: newPO, invoice: newInvoice };
}

function paySupplierInvoice(invoiceId, paymentMethod, paymentRef) {
  const invoices = getSupplierInvoices();
  const target = invoices.find(inv => inv.invoiceId === invoiceId);
  if (!target) return null;

  target.paymentStatus = "Paid";
  target.paymentDate = new Date().toISOString();
  target.paymentMethod = paymentMethod || "Commercial Bank Corporate Wire";
  target.paymentRef = paymentRef || `TXN-REF-${Math.floor(100000 + Math.random() * 900000)}`;
  target.settledBy = "Executive Admin (Procurement Dept)";

  saveSupplierInvoices(invoices);
  return target;
}

function deletePurchaseOrder(poId) {
  let pos = getPurchaseOrders();
  const target = pos.find(p => p.poId === poId);
  pos = pos.filter(p => p.poId !== poId);
  savePurchaseOrders(pos);

  if (target && target.invoiceId) {
    let invoices = getSupplierInvoices();
    invoices = invoices.filter(inv => inv.invoiceId !== target.invoiceId);
    saveSupplierInvoices(invoices);
  }
}

/* ==========================================================================
   VIRTUAL FITTING ROOM DATA & SIZE ALGORITHM
   ========================================================================== */
const FITTING_ROOM_MODELS = [
  {
    id: "fem-1",
    gender: "female",
    name: "Ananya",
    subtitle: "Classic Grace • Regular Silhouette",
    silhouette: "regular",
    heightCm: 165,
    bustIn: 34,
    waistIn: 28,
    hipIn: 38,
    skinTone: "Warm Golden Olive",
    image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80",
    fullSilhouette: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: "fem-2",
    gender: "female",
    name: "Dinithi",
    subtitle: "Tall & Slender • High Fashion",
    silhouette: "slim",
    heightCm: 174,
    bustIn: 32,
    waistIn: 25,
    hipIn: 35,
    skinTone: "Fair Wheatish",
    image: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=600&q=80",
    fullSilhouette: "https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: "fem-3",
    gender: "female",
    name: "Kavindi",
    subtitle: "Curvy Contour • Petite Elegance",
    silhouette: "curvy",
    heightCm: 158,
    bustIn: 38,
    waistIn: 32,
    hipIn: 42,
    skinTone: "Rich Bronze",
    image: "https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?auto=format&fit=crop&w=600&q=80",
    fullSilhouette: "https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: "male-1",
    gender: "male",
    name: "Kaveen",
    subtitle: "Athletic Build • Casual & Formal",
    silhouette: "athletic",
    heightCm: 180,
    bustIn: 40,
    waistIn: 32,
    hipIn: 39,
    skinTone: "Warm Golden",
    image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=600&q=80",
    fullSilhouette: "https://images.unsplash.com/photo-1617137984095-74e4e5e3613f?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: "male-2",
    gender: "male",
    name: "Malith",
    subtitle: "Executive Proportions • Tailored Suit",
    silhouette: "regular",
    heightCm: 173,
    bustIn: 42,
    waistIn: 36,
    hipIn: 42,
    skinTone: "Deep Amber",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80",
    fullSilhouette: "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&w=600&q=80"
  }
];

const FITTING_COLOR_PALETTES = [
  { name: "Original Royal", hex: "#8B133E", filter: "none" },
  { name: "Emerald Ceylon", hex: "#047857", filter: "hue-rotate(110deg) saturate(1.2)" },
  { name: "Sapphire Ocean", hex: "#1D4ED8", filter: "hue-rotate(200deg) saturate(1.3)" },
  { name: "Kandyan Gold", hex: "#D97706", filter: "hue-rotate(45deg) saturate(1.5) brightness(1.1)" },
  { name: "Sunset Coral", hex: "#E11D48", filter: "hue-rotate(340deg) saturate(1.1)" },
  { name: "Midnight Onyx", hex: "#1E293B", filter: "grayscale(100%) brightness(0.7) contrast(1.3)" }
];

const SIZE_CHART_MATRIX = {
  female: [
    { size: "XS", minChest: 30, maxChest: 32, minWaist: 23, maxWaist: 25, minHip: 33, maxHip: 35 },
    { size: "S", minChest: 32, maxChest: 34, minWaist: 25, maxWaist: 27, minHip: 35, maxHip: 37 },
    { size: "M", minChest: 34, maxChest: 37, minWaist: 27, maxWaist: 30, minHip: 37, maxHip: 40 },
    { size: "L", minChest: 37, maxChest: 40, minWaist: 30, maxWaist: 33, minHip: 40, maxHip: 43 },
    { size: "XL", minChest: 40, maxChest: 44, minWaist: 33, maxWaist: 37, minHip: 43, maxHip: 47 },
    { size: "XXL", minChest: 44, maxChest: 48, minWaist: 37, maxWaist: 42, minHip: 47, maxHip: 52 }
  ],
  male: [
    { size: "S", minChest: 36, maxChest: 38, minWaist: 28, maxWaist: 30, minHip: 36, maxHip: 38 },
    { size: "M", minChest: 38, maxChest: 41, minWaist: 30, maxWaist: 33, minHip: 38, maxHip: 41 },
    { size: "L", minChest: 41, maxChest: 44, minWaist: 33, maxWaist: 36, minHip: 41, maxHip: 44 },
    { size: "XL", minChest: 44, maxChest: 47, minWaist: 36, maxWaist: 39, minHip: 44, maxHip: 47 },
    { size: "XXL", minChest: 47, maxChest: 51, minWaist: 39, maxWaist: 44, minHip: 47, maxHip: 51 }
  ]
};

function getFittingModels(gender = 'all') {
  if (gender === 'all') return FITTING_ROOM_MODELS;
  return FITTING_ROOM_MODELS.filter(m => m.gender === gender);
}

function getFittingModelById(id) {
  return FITTING_ROOM_MODELS.find(m => m.id === id) || FITTING_ROOM_MODELS[0];
}

function calculateBestFitSize(gender, measurements) {
  const genderKey = gender === 'male' ? 'male' : 'female';
  const chart = SIZE_CHART_MATRIX[genderKey];

  const chest = Number(measurements.chest || measurements.bust) || (genderKey === 'male' ? 40 : 34);
  const waist = Number(measurements.waist) || (genderKey === 'male' ? 32 : 28);
  const hip = Number(measurements.hip) || (genderKey === 'male' ? 39 : 38);
  const height = Number(measurements.height) || 165;

  let bestSize = "M";
  let bestScore = 0;

  chart.forEach(bracket => {
    let score = 0;
    const midChest = (bracket.minChest + bracket.maxChest) / 2;
    const chestDiff = Math.abs(chest - midChest);
    score += Math.max(0, 40 - chestDiff * 6);

    const midWaist = (bracket.minWaist + bracket.maxWaist) / 2;
    const waistDiff = Math.abs(waist - midWaist);
    score += Math.max(0, 35 - waistDiff * 6);

    const midHip = (bracket.minHip + bracket.maxHip) / 2;
    const hipDiff = Math.abs(hip - midHip);
    score += Math.max(0, 25 - hipDiff * 5);

    if (score > bestScore) {
      bestScore = score;
      bestSize = bracket.size;
    }
  });

  const matchPercent = Math.min(99, Math.max(82, Math.round(bestScore)));

  let easeComment = "Comfort tailored drape with standard 1.5 inch ease.";
  if (chest > 38 && genderKey === 'female') {
    easeComment = "Relaxed bust contour; ideal for festive sarees and flared lehengas.";
  } else if (height > 172) {
    easeComment = "Full-length floor drop; recommended for tall bridal silhouettes.";
  } else if (waist < 27) {
    easeComment = "Snug silhouette accentuating waistline taper with breathable give.";
  }

  return {
    recommendedSize: bestSize,
    matchPercent: matchPercent,
    comment: easeComment,
    chestScore: "True to Standard",
    waistScore: "Comfort Fit",
    lengthScore: height > 170 ? "Graceful Floor Length" : "Standard Hem Line"
  };
}


