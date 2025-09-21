protectPage("home", ["index"], true);

document.addEventListener('DOMContentLoaded', () => {

  const productsList = document.getElementById('products-list');
  const cartBtn = document.getElementById('cart-btn');
  const cartModal = document.querySelector('.cart-modal');
  const goToPaymentBtn = document.getElementById('go-to-payment-btn');
  const paymentPage = document.getElementById('payment-page');
  const backToCartBtn = document.getElementById('back-to-cart-btn');
  const closeCartBtn = document.getElementById('close-cart-btn');
  const cartItemCount = document.getElementById('cart-item-count');
  const cartBtnFooter = document.getElementById('cart-btn-footer');
  const filterBtn = document.querySelector('.footer-btn img[alt="Filter"]')?.closest('.footer-btn');
const filterModal = document.querySelector('.filter-modal');
const Modal = document.querySelector('.modal-overlay');
const filterOptions = document.getElementById('filter-options');
const applyFilterBtn = document.getElementById('apply-filter-btn');
const closeFilterBtn = document.getElementById('close-filter-btn');
const searchPopup = document.getElementById('search-popup');
  const searchInput = document.getElementById('search-input');
  const executeSearchBtn = document.getElementById('execute-search-btn');
  const clearSearchBtn = document.getElementById('clear-search-btn');
  const footerSearchBtn = document.getElementById('footer-search-btn');
  const resetBtn = document.getElementById('reset-filters-btn');
const resetPopup = document.getElementById('reset-popup');
const confirmResetBtn = document.getElementById('confirm-reset-btn');
const cancelResetBtn = document.getElementById('cancel-reset-btn');
const cartList = document.querySelector('.cart-item-list');
  const cartTotal = document.querySelector('.cart-total');
  const cartEmpty = document.querySelector('.cart-empty');
  const goToCartBtn = document.getElementById('open-cart-btn');
let selectedCategories = new Set();  // To remember last filters
let allSelected = false;             // For the toggle button
let lastSelectedCategory = 'All';  // default: All products


  let cart = JSON.parse(localStorage.getItem('cart')) || {};
  
  let products = [];
  
    // Call loadConfig and then fetch products
const range = "Sheet2!A1:F"; // Only first row, columns A–E

  loadConfig()
    .then(() => {
      return fetchProductsFromSheet(sheetId, range, apiKey);
    })
    .then(data => {
      products = data;
      MyFramework.log('Products loaded from Google Sheet');
      renderCategories();
      renderProducts();
      updateCartUI();
    })
    .catch(err => {
      console.error('Error initializing config file', err);
    });

 /*   fetch('products.json')
    .then(res => res.json())
    .then(data => {
      products = data;
MyFramework.log('Products loaded');
renderCategories(); // Add this!
renderProducts();    // Safe now with default param
updateCartUI();


    })
    .catch(err => {
      console.error("Error loading products.json", err);
      MyFramework.log('Failed to load products');
    });  */

let categories = ['மத்தாப்பு & சாட்டை', 'வெடி வகைகள்', 'சக்கரம் & பூச்சட்டி', 'பேன்சி வெடி வகைகள்', 'வான வெடிகள்', 'பைப் ரக வான வெடிகள்', 'All'];

function renderCategories() {
  const container = document.getElementById('category-filters');
  container.innerHTML = '';

  categories.forEach(cat => {
    const btn = document.createElement('button');
    btn.textContent = cat;
    btn.className = 'category-btn';
    btn.dataset.category = cat;
    btn.addEventListener('click', () => filterProducts(cat));
    container.appendChild(btn);
  });
}

function bindResetButton() {
  const filterBtn = document.querySelector('.footer-btn img[alt="Filter"]')?.closest('.footer-btn');
  if (filterBtn) {
    filterBtn.addEventListener('click', () => {
      showFilterOptions();
      filterModal.style.display = 'flex';  
      MyFramework.log('Opened filter modal');
    });
  }
  const footerSearchBtn = document.getElementById('footer-search-btn');
  if (footerSearchBtn) {
    footerSearchBtn.addEventListener('click', () => {
      searchPopup.classList.toggle('show');
      MyFramework.log('opened Search Modal')
    });
  }
  const resetBtn = document.getElementById('reset-filters-btn');
  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
    showCustomAlert(
  "Are you sure?",
  "Do you want to reset all the filters applied?",
  "Confirm",
  () => {
    renderProducts();
    MyFramework.log("Filter Reset Successfully");
  }
);
          
    /*  resetPopup.style.display = 'flex';  */
    });
  }
}

function filterProducts(category) {
  lastSelectedCategory = category;
  
  if (category === 'All') {
    selectedCategories = new Set();  // no filter
    renderProducts();
  } else {
    selectedCategories = new Set([category]);  // overwrite multi-selection
    const filtered = products.filter(p => p.category === category);
    renderProducts(filtered);
    updateCartCount();
  }
}

  function renderProducts(filtered = products, totalCount = products.length) {
  productsList.innerHTML = '';

  const statusElem = document.getElementById('product-status');
  if (filtered.length === totalCount) {
    statusElem.innerHTML = `All Products (<span class="total-count">${totalCount}</span>)
    <button class="footer-btn">
      <img src="icons/filter.png" alt="Filter" />
     </button>
     <button id="footer-search-btn" class="footer-btn">
      <img src="icons/search.png" alt="Search" />
    </button>
    <button id="reset-filters-btn" class="footer-btn" title="Reset Filters">
        <img src="icons/reset.png" alt="Reset" />
    </button>`;
  } else {
    statusElem.innerHTML = `Filtered (<span class="filtered-count">${filtered.length}</span>/<span class="total-count">${totalCount}</span>)
  <button class="footer-btn">
      <img src="icons/filter.png" alt="Filter" />
     </button>
     <button id="footer-search-btn" class="footer-btn">
      <img src="icons/search.png" alt="Search" />
    </button>
    <button id="reset-filters-btn" class="footer-btn" title="Reset Filters">
        <img src="icons/reset.png" alt="Reset" />
    </button>`;
  }

  filtered.forEach(product => {
    const card = document.createElement('div');
    card.className = 'product-card';

     const imagesHtml = product.images.map((img, idx) => `  
       <img src="${img}" class="carousel-image${idx === 0 ? ' active' : ''}" />.   
      `).join('');    

    const dotsHtml = product.images.map((_, idx) => `
      <span class="carousel-dot${idx === 0 ? ' active' : ''}" data-idx="${idx}"></span>
    `).join('');

    const inCart = cart[product.id];
    const quantity = inCart || 1;
    const totalPrice = (product.price * quantity).toFixed(2);
    const discount = Math.round(((product.mrp - product.price) / product.mrp) * 100);

    card.innerHTML = `
  <div class="carousel-wrapper">
      <div class="ribbon-wrapper">
    <span class="ribbon-text">${discount}% <br>OFF</span>
    <img src="icons/ribbon.png" alt="Offer Ribbon" class="ribbon-image">
  </div>
    <div class="carousel" data-id="${product.id}">
      ${imagesHtml}
      <div class="carousel-dots">${dotsHtml}</div>
    </div>

    ${inCart
      ? `
      <div class="floating-controls">
        <div class="quantity-controls" style="display:flex;">
          <button class="decrease-btn" data-id="${product.id}">-</button>
          <span class="quantity">${quantity}</span>
          <button class="increase-btn" data-id="${product.id}">+</button>
        </div>
      </div>`
      : `
      <div class="floating-controls">
        <button class="add-btn" data-id="${product.id}">
          <img src="icons/add.png" alt="Add Icon" class="btn-icon">
        </button>
      </div>`
    }
  </div>

 <h3>
  <span class="product-name">${product.name}</span>
  <span class="product-price">
    <span class="mrp">₹${product.mrp}</span>
    <span class="price">₹${product.price}</span>
  </span>
</h3>
  <div class="product-total" style="display:${inCart ? 'block' : 'none'};">₹${totalPrice}</div>
`;

    if (inCart) {
      card.classList.add('active');
    }

    productsList.appendChild(card);
  });

  bindAddButtons();
  initCarousels();
  bindResetButton();
  updateCartUI();
}

function insertAddButton(card, product) {
  const controls = card.querySelector('.floating-controls');
  controls.innerHTML = ''; // Clear old controls

  const addBtn = document.createElement('button');
  addBtn.className = 'add-btn';
  addBtn.dataset.id = product.id;
  addBtn.innerHTML = `<img src="icons/add.png" alt="Add Icon" class="btn-icon">`;

  controls.appendChild(addBtn);
}

// Cancel button hides the popup
cancelResetBtn.addEventListener('click', () => {
    resetPopup.style.display = 'none';
});

// Confirm button resets filters and closes popup
confirmResetBtn.addEventListener('click', () => {
    renderProducts(); // Call your existing function to reload everything
    resetPopup.style.display = 'none';
});

function applySavedFilters() {
  if (selectedCategories.size === 0) {
    renderProducts();  // no filters applied = show all
    MyFramework.log('Restored filter: All categories');
  } else {
    const filtered = products.filter(p => selectedCategories.has(p.category));
    renderProducts(filtered, products.length);
    MyFramework.log(`Restored filter: ${Array.from(selectedCategories).join(', ')}`);
  }
}

function handleSearchResults(results, searchKey) {
    const productContainer = document.getElementById('products-list'); 
    productContainer.innerHTML = ''; 

    if (results.length === 0) {
        showNoResults(searchKey);
    } else {
        hideNoResults();
        renderProducts(results, products.length);  // just render them!
    }
}


document.getElementById('back-to-products-btn').addEventListener('click', () => {
  hideNoResults();
  applySavedFilters();  // <-- restore the last filters (multi-category works)
});


if (filterBtn) {
  filterBtn.addEventListener('click', () => {
    showFilterOptions();
    filterModal.style.display = 'flex';  
    MyFramework.log('Opened filter modal');
  });
}

if (cartBtnFooter) {
  cartBtnFooter.addEventListener('click', () => {
    saveSelectedProductsToStorage()
    navigateToCartPage();
    MyFramework.log('Opened Cart Page');
  });
}


  applyFilterBtn.addEventListener('click', () => {
  const selected = Array.from(filterOptions.querySelectorAll('input[type="checkbox"]:checked'))
    .map(cb => cb.value);

  selectedCategories = new Set(selected);  // Save selection for next time

  if (selected.length === 0) {
    renderProducts(); // No filters = show all
    MyFramework.log('Applied filter: All categories');
  } else {
    const filtered = products.filter(p => selected.includes(p.category));
    renderProducts(filtered, products.length);
    MyFramework.log(`Applied filter: ${selected.join(', ')}`);
  }

  // Update allSelected state
  allSelected = (selected.length === (categories.length - 1));
  filterModal.style.display = 'none';
});

function showFilterOptions() {
  filterOptions.innerHTML = '';
categories.slice(0, -1).forEach(cat => { // skip 'All'
  const label = document.createElement('label');
  label.innerHTML = `
    <input type="checkbox" value="${cat}" ${selectedCategories.has(cat) ? 'checked' : ''}> ${cat}
  `;
  filterOptions.appendChild(label);
});


  // Set the initial state of Select All button based on selectedCategories
  const totalCats = categories.length - 1;
  allSelected = (selectedCategories.size === totalCats);
  updateSelectAllButton();
}

const selectAllBtn = document.getElementById('select-all-btn');

selectAllBtn.addEventListener('click', () => {
  const checkboxes = filterOptions.querySelectorAll('input[type="checkbox"]');

  if (!allSelected) {
    checkboxes.forEach(cb => cb.checked = true);
    allSelected = true;
    MyFramework.log('Selected all categories');
  } else {
    checkboxes.forEach(cb => cb.checked = false);
    allSelected = false;
    MyFramework.log('Unselected all categories');
  }
  updateSelectAllButton();
});

function updateSelectAllButton() {
  selectAllBtn.textContent = allSelected ? 'Unselect All' : 'Select All';
}

 // Toggle search popup
/*    footerSearchBtn.addEventListener('click', () => {
    searchPopup.classList.toggle('show');
  });   */

  if (executeSearchBtn) {
  executeSearchBtn.addEventListener('click', () => {
    const searchTerm = searchInput.value.trim();
    if (searchTerm === '') {
      alert('Please enter a search term.');
      return;
    }

if (searchInput) {
    const results = performSearch(searchTerm); // your search logic here
    document.getElementById('search-popup').classList.remove('show'); // HIDE the popup
  //  handleSearchResults(results, searchTerm);
    searchPopup.classList.remove('show');
  }
  });
}

// Show or hide the clear button based on input
searchInput.addEventListener('input', () => {
  if (searchInput.value.trim() !== '') {
    clearSearchBtn.style.display = 'flex';
  } else {
    clearSearchBtn.style.display = 'none';
  }
});

// Clear input and hide clear button when X is clicked
clearSearchBtn.addEventListener('click', () => {
  searchInput.value = '';
  clearSearchBtn.style.display = 'none';
});

  function performSearch(searchTerm) {
    console.log('Searching for:', searchTerm);

    const productCards = Array.from(document.querySelectorAll('.product-card'));
    let matched = 0;

    productCards.forEach(productCard => {
        const name = productCard.querySelector('h3')?.innerText.toLowerCase() || '';
        if (name.includes(searchTerm.toLowerCase())) {
            productCard.style.display = 'block';
            matched++;
        } else {
            productCard.style.display = 'none';
        }
    });

    if (matched === 0) {
        showNoResults(searchTerm);
    } else {
        hideNoResults();
    }
}

function bindAddButtons() {
  document.querySelectorAll('.add-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = btn.dataset.id;
      const product = products.find(p => p.id === id);
      if (!product) return;

      cart[id] = 1;
      localStorage.setItem('cart', JSON.stringify(cart));

      const card = btn.closest('.product-card');
      const qtyControlsHTML = `
        <div class="quantity-controls" style="display:flex;">
          <button class="decrease-btn" data-id="${product.id}">-</button>
          <span class="quantity">1</span>
          <button class="increase-btn" data-id="${product.id}">+</button>
        </div>
      `;

      const totalElemHTML = `<div class="product-total">₹${product.price.toFixed(2)}</div>`;

      // Replace the floating-controls area
      const floatingControls = card.querySelector('.floating-controls');
      floatingControls.innerHTML = qtyControlsHTML;

      // Append or update the total price element
      let totalElem = card.querySelector('.product-total');
      if (!totalElem) {
        const newTotalElem = document.createElement('div');
        newTotalElem.className = 'product-total';
        newTotalElem.style.display = 'block';
        newTotalElem.textContent = `₹${product.price.toFixed(2)}`;
        card.appendChild(newTotalElem);
      } else {
        totalElem.textContent = `₹${product.price.toFixed(2)}`;
        totalElem.style.display = 'block';
      }

      card.classList.add('active');
      MyFramework.log(`Added 1 ${product.name} to cart`);
      updateCartUI();
    });
  });
}

  
  productsList.addEventListener('click', (e) => {
  const target = e.target;
  const button = target.closest('button');
  if (!button) return;

  const card = target.closest('.product-card');
  if (!card) return;

  // ADD button handler
  if (button.classList.contains('add-btn')) {
    const id = button.dataset.id;
    const product = products.find(p => p.id === id);
    if (!product) return;

    cart[id] = 1;

    const controls = card.querySelector('.floating-controls');

    controls.innerHTML = `
      <div class="quantity-controls" style="display:flex;">
        <button class="decrease-btn" data-id="${product.id}">-</button>
        <span class="quantity">1</span>
        <button class="increase-btn" data-id="${product.id}">+</button>
      </div>
    `;

    card.querySelector('.product-total').style.display = 'block';
    card.querySelector('.product-total').textContent = `₹${product.price.toFixed(2)}`;
    card.classList.add('active');

    MyFramework.log(`Added ${product.name} to cart`);
    updateCartUI();
    return;
  }

  // INCREASE button handler
  if (target.classList.contains('increase-btn')) {
    const id = target.dataset.id;
    const product = products.find(p => p.id === id);
    if (!product) return;

    cart[id]++;
    const card = target.closest('.product-card');
    card.querySelector('.quantity').textContent = cart[id];
    card.querySelector('.product-total').textContent = `₹${(product.price * cart[id]).toFixed(2)}`;
    MyFramework.log(`Increased ${product.name} to ${cart[id]}`);
    updateCartUI();
  }

  // DECREASE button handler
  if (target.classList.contains('decrease-btn')) {
    const id = target.dataset.id;
    const product = products.find(p => p.id === id);
    if (!product) return;

    cart[id]--;
    const card = target.closest('.product-card');

    if (cart[id] <= 0) {
      delete cart[id];

      const controls = card.querySelector('.floating-controls');
      controls.innerHTML = `
        <button class="add-btn" data-id="${product.id}">
          <img src="icons/add.png" alt="Add Icon" class="btn-icon">
        </button>
      `;

      card.querySelector('.product-total').style.display = 'none';
      card.classList.remove('active');

      MyFramework.log(`Removed ${product.name} from cart`);
    } else {
      card.querySelector('.quantity').textContent = cart[id];
      card.querySelector('.product-total').textContent = `₹${(product.price * cart[id]).toFixed(2)}`;
      MyFramework.log(`Decreased ${product.name} to ${cart[id]}`);
    }

    updateCartUI();
  }
});

  function updateCartCount() {
  const cartItems = JSON.parse(localStorage.getItem('cart')) || {};
  const cartCount = Object.values(cartItems).reduce((sum, qty) => sum + qty, 0); // total item quantities
  const countEl = document.getElementById('cart-item-count');

  if (cartCount > 0) {
    countEl.textContent = cartCount;
    countEl.style.display = 'inline-block';
  } else {
    countEl.style.display = 'none';
  }
}
  function updateCartUI() {
  const cartItemsCount = Object.keys(cart).length;
  cartItemCount.textContent = cartItemsCount;

  if (cartList && cartTotal) {
    cartList.innerHTML = '';
    let totalAmount = 0;

    if (cartItemsCount === 0) {
      // Show empty cart message
      cartEmpty.style.display = 'block';
      cartTotal.style.display = 'none';
      if (goToCartBtn) goToCartBtn.style.display = 'none';
    } else {
      // Show cart items and total
      cartEmpty.style.display = 'none';
      cartTotal.style.display = 'block';
      if (goToCartBtn) goToCartBtn.style.display = 'inline-block';

      Object.keys(cart).forEach(productId => {
        const product = products.find(p => p.id === productId);
        const quantity = cart[productId];
        
        if (product) {
  const item = document.createElement('div');
  item.className = 'cart-item';
  item.innerHTML = `
    <div class="item-name">${product.name}</div>
    <div class="item-qty">x${quantity}</div>
    <div class="item-price">₹${(product.price * quantity).toFixed(2)}</div>
  `;
  cartList.appendChild(item);
  totalAmount += product.price * quantity;
}
      });

      cartTotal.textContent = `Total: ₹${totalAmount.toFixed(2)}`;
cartTotal.style.fontWeight = 'bold';
cartTotal.style.color = '#1d3557';
    }
  }

  localStorage.setItem('cart', JSON.stringify(cart));
  updateCartCount();
}


  function initCarousels() {
    document.querySelectorAll('.carousel').forEach(carousel => {
      let currentIndex = 0;
      const images = carousel.querySelectorAll('.carousel-image');
      const dots = carousel.querySelectorAll('.carousel-dot');

      const showImage = (index) => {
        images.forEach(img => img.classList.remove('active'));
        dots.forEach(dot => dot.classList.remove('active'));
        images[index].classList.add('active');
        dots[index].classList.add('active');
      };

      dots.forEach(dot => {
        dot.addEventListener('click', () => {
          currentIndex = parseInt(dot.dataset.idx);
          showImage(currentIndex);
          MyFramework.log(`Switched image on ${carousel.dataset.id} to index ${currentIndex}`);
        });
      });

      let startX;
      carousel.addEventListener('touchstart', e => startX = e.touches[0].clientX);
      carousel.addEventListener('touchend', e => {
        const dx = e.changedTouches[0].clientX - startX;
        if (dx > 30) currentIndex = (currentIndex - 1 + images.length) % images.length;
        else if (dx < -30) currentIndex = (currentIndex + 1) % images.length;
        showImage(currentIndex);
      });
    });
  }

  cartBtn.addEventListener('click', () => {
  cartModal.style.display = 'flex';
  MyFramework.log('Cart opened');

  // Prepare full product data for selected items
  const selectedProducts = Object.entries(cart).map(([id, quantity]) => {
    const product = products.find(p => p.id === id);
    if (!product) return null;
    return {
      id: product.id,
      name: product.name,
      price: product.price,
      quantity,
      total: (product.price * quantity).toFixed(2),
    //  image: product.images[0] || ''
    };
  }).filter(Boolean); // Remove any null entries

  // Save to localStorage for use on cart.html
  localStorage.setItem('selectedProducts', JSON.stringify(selectedProducts));
  
});

  
  
  function saveSelectedProductsToStorage() {
  const selectedProducts = Object.entries(cart).map(([id, quantity]) => {
    const product = products.find(p => p.id === id);
    if (!product) return null;
    return {
      id: product.id,
      name: product.name,
      price: product.price,
      quantity,
      total: (product.price * quantity).toFixed(2),
      image: product.images[0] || ''
    };
  }).filter(Boolean);

  localStorage.setItem('selectedProducts', JSON.stringify(selectedProducts));
}
  //document.getElementById('open-cart-btn')?.addEventListener('click', toggleCartModal);
  
   document.getElementById('open-cart-btn').addEventListener('click', function () {
  navigateToCartPage()
  MyFramework.log('Navigate to Cart Page footer button')
});

  document.getElementById('close-cart-btn')?.addEventListener('click', toggleCartModal);

  function toggleCartModal() {
  const modal = document.querySelector('.cart-modal');
  if (modal) {
    modal.classList.toggle('show');
  }
}
});

document.getElementById('close-filter-btn')?.addEventListener('click', toggleFilterModal);

function toggleFilterModal() {
  const modal = document.querySelector('#filter-modal');
  if (modal) {
    modal.style.display = 'none';
  }
}

function showNoResults(searchedKey) {
  document.getElementById('no-results').style.display = 'block';
  document.getElementById('searched-key').textContent = searchedKey;
}

function hideNoResults() {
  document.getElementById('no-results').style.display = 'none';
}
  document.addEventListener("DOMContentLoaded", function () {
    const offersBtn = document.querySelector(".footer-btn img[alt='Offers']").parentElement;
    const modal = document.querySelector(".modal-overlay.offers-modal");
    const closeModal = document.querySelector(".offers-modal-close");
    const offersList = document.getElementById("offers-list");

    offersBtn.addEventListener("click", () => {
      fetch("offers.json")
        .then(res => res.json())
        .then(data => {
          offersList.innerHTML = '';
          const publicOffers = data.filter(o => o.type === "public");
          publicOffers.forEach(offer => {
            const card = document.createElement("div");
            card.className = "offer-card";

            card.innerHTML = `
              <div class="offer-code">Code: ${offer.code}</div>
              <div class="offer-description">${offer.description}</div>
              <button class="copy-btn" data-code="${offer.code}">Copy Code</button>
            `;

            offersList.appendChild(card);
          });

          modal.style.display = "flex";
        });
    });

    closeModal.addEventListener("click", () => {
      modal.style.display = "none";
    });

    window.addEventListener("click", (e) => {
      if (e.target === modal) modal.style.display = "none";
    });

    document.addEventListener("click", (e) => {
      if (e.target.classList.contains("copy-btn")) {
        const code = e.target.getAttribute("data-code");
        navigator.clipboard.writeText(code);
        e.target.textContent = "Copied!";
        setTimeout(() => e.target.textContent = "Copy Code", 1000);
      }
    });
  });
  
  
/**
 * Fetch products from Google Sheets and convert to JSON
 * @param {string} sheetId - Google Sheet ID
 * @param {string} range - Range in A1 notation, e.g., "Sheet1!A2:F"
 * @param {string} apiKey - Google API key
 * @returns {Promise<Array>} - Array of product objects
 */
async function fetchProductsFromSheet(sheetId, range, apiKey) {

if (!sheetId || !apiKey) {
    console.error("Missing Sheet ID or API Key");
    return;
  }

  try {
    const url = `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/${range}?key=${apiKey}`;
    const res = await fetch(url);
    const data = await res.json();

    if (!data.values || data.values.length === 0) {
      console.warn("No data found in sheet");
      return [];
    }

    const headers = data.values[0];       // First row as headers
    const rows = data.values.slice(1);    // Remaining rows as data

    // Convert each row to object with keys from headers
    const products = rows.map(row => {
      const obj = {};
      headers.forEach((header, i) => {
        obj[header] = row[i] || null; // Assign null if cell empty
      });

      // Optional: Convert numeric fields
      if (obj.price) obj.price = parseFloat(obj.price);
      if (obj.mrp) obj.mrp = parseFloat(obj.mrp);
      if (obj.images) obj.images = obj.images.split(','); // Assuming comma-separated
      return obj;
    });

    return products;

  } catch (err) {
    console.error("Failed to fetch products from sheet:", err);
    return [];
  }
}