// app.js

document.addEventListener('DOMContentLoaded', () => {
  MyFramework.onClick('.my-button', (e) => {
    alert('Button clicked!');
  });

  MyFramework.log('App Initialized');


  const sidebar = document.getElementById('sidebar');
  const closeSidebarBtn = document.getElementById('close-sidebar-btn');
  const menuBtn = document.getElementById('menu-btn');
  const homeBtn = document.getElementById('home-btn');
  const logoutBtn = document.getElementById('logout-btn');
  const yourOrdersBtn = document.querySelector('a[href="#"] img[alt="Orders"]')?.parentElement;
  const settingsBtn = document.querySelector('a[href="#"] img[alt="Settings"]')?.parentElement;
  const ContactUsBtn = document.querySelector('a[href="#"] img[alt="Contact"]')?.parentElement;
  const profileBtn = document.getElementById('profile-btn');

  const settingsSection = document.getElementById("settings-section");
  const profileSection = document.getElementById("profile-section");
  const productsList = document.getElementById("products-list");
  const ContactSection = document.getElementById("contactSection");
  const productStatus = document.getElementById('product-status');
  const ordersSection = document.getElementById("orders-section");

  const nameInput = document.getElementById('profile-name');
  const mobileInput = document.getElementById('profile-mobile');
  const emailInput = document.getElementById('profile-email');
  const editBtn = document.getElementById('edit-profile-btn');
  const saveBtn = document.getElementById('save-profile-btn');

  const addressList = document.getElementById('address-list');
  const addAddressBtn = document.getElementById('add-address-btn');
  const addressModal = document.querySelector('.address-modal');
  const saveAddressBtn = document.getElementById('save-address-btn');
  const cancelAddressBtn = document.getElementById('cancel-address-btn');
  const cartSection = document.getElementById('cart-section');
  const statusElem = document.getElementById('product-status');

  const addrFields = ['door', 'street', 'city', 'district', 'state', 'pincode', 'landmark'];

// Load profile and addresses initially
  loadProfile();
  loadAddresses();

  closeSidebarBtn?.addEventListener('click', () => {
    sidebar.classList.remove('active');
    MyFramework.log('Sidebar closed');
  });

  menuBtn?.addEventListener('click', () => {
    sidebar.classList.toggle('active');
    MyFramework.log('sidebar is active');
  });

  document.addEventListener('click', (e) => {
    if (sidebar.classList.contains('active') &&
        !sidebar.contains(e.target) &&
        !menuBtn.contains(e.target)) {
      sidebar.classList.remove('active');
      MyFramework.log('Sidebar closed by clicking outside');
    }
  });

  document.querySelectorAll('#sidebar a').forEach(link => {
    link.addEventListener('click', () => {
      sidebar.classList.remove('active');
      MyFramework.log('Sidebar closed after link click');
    });
  });

  homeBtn?.addEventListener('click', (e) => {
    e.preventDefault();
    navigateToHomePage();
    MyFramework.log('Navigate to home page');
  });

  logoutBtn?.addEventListener('click', (e) => {
    e.preventDefault();
    navigateToLoginPage();
    MyFramework.log('Navigate to login page');
  });

  profileBtn?.addEventListener('click', () => {
    document.querySelectorAll('main > *').forEach(el => el.classList.add('hidden'));
   window.location.href = "home.html#profile"; profileSection.classList.remove('hidden');
    loadProfile();
    loadAddresses();
    if (productStatus) productStatus.style.display = 'none';
    statusElem?.classList.add("hidden")
    ContactSection?.classList.add("hidden");
    settingsSection?.classList.add("hidden");
    cartSection?.classList.add("hidden");
    ordersSection?.classList.add("hidden");
    MyFramework.log('Profile section shown');
  });

  editBtn?.addEventListener('click', () => {
    [nameInput, mobileInput, emailInput].forEach(i => i.disabled = false);
    saveBtn.classList.remove('hidden');
    MyFramework.log('Profile edit mode enabled');
  });

  saveBtn?.addEventListener('click', () => {
    const profile = {
      name: nameInput.value,
      mobile: mobileInput.value,
      email: emailInput.value
    };
    localStorage.setItem('profile', JSON.stringify(profile));
    [nameInput, mobileInput, emailInput].forEach(i => i.disabled = true);
    saveBtn.classList.add('hidden');
    MyFramework.log('Profile saved');
  });

  addAddressBtn?.addEventListener('click', () => {
    addrFields.forEach(id => document.getElementById(id).value = '');
    addressModal.style.display = 'flex';
    MyFramework.log('Address modal opened');
  });

  saveAddressBtn?.addEventListener('click', () => {
    const newAddress = {};
    addrFields.forEach(id => newAddress[id.replace('-', '')] = document.getElementById(id).value.trim());
    const addresses = JSON.parse(localStorage.getItem('addresses')) || [];
    addresses.push(newAddress);
    localStorage.setItem('addresses', JSON.stringify(addresses));
    localStorage.setItem('activeAddress', addresses.length - 1);
    addressModal.style.display = 'none';
    loadAddresses();
    MyFramework.log('New address saved and activated');
  });

  cancelAddressBtn?.addEventListener('click', () => {
    addressModal.style.display = 'none';
    MyFramework.log('Address modal closed by Cancel button');
  });

  const toggleBtn = document.getElementById('themeToggle');
  toggleBtn?.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
    localStorage.setItem('theme', document.body.classList.contains('dark-mode') ? 'dark' : 'light');
  });

  const storedTheme = localStorage.getItem('theme');
  if (storedTheme === 'dark') document.body.classList.add('dark-mode');
  
  function loadSettingsTheme() {
  const themeRadios = document.querySelectorAll('input[name="theme"]');

  // Fetch saved theme from localStorage, default to "light"
  const savedTheme = localStorage.getItem("theme") || "light";

  themeRadios.forEach(radio => {
    radio.checked = radio.value === savedTheme;

    // Add change listener to update theme
    radio.addEventListener('change', () => {
      if (radio.checked) {
        localStorage.setItem("theme", radio.value);
        document.documentElement.setAttribute("data-theme", radio.value); // optional
        console.log("Theme updated to:", radio.value);
      }
    });
  });
}
  
  yourOrdersBtn?.addEventListener("click", e => {
      e.preventDefault();
      loadOrders();
      statusElem?.classList.add("hidden")
    profileSection?.classList.add("hidden");
    productsList?.classList.add("hidden");
    ContactSection?.classList.add("hidden");
    cartSection?.classList.add("hidden");
    if (productStatus) productStatus.style.display = 'none';
   ContactSection.classList.add("hidden"); settingsSection.classList.add("hidden");
    sidebar?.classList.remove("open");
     
    });

  settingsBtn?.addEventListener("click", (e) => {
    e.preventDefault();
    statusElem?.classList.add("hidden")
    profileSection?.classList.add("hidden");
    productsList?.classList.add("hidden");
    ContactSection?.classList.add("hidden");
    cartSection?.classList.add("hidden");
    ordersSection?.classList.add("hidden");
    if (productStatus) productStatus.style.display = 'none';
    settingsSection.classList.remove("hidden");
    sidebar?.classList.remove("open");
    loadSettingsTheme();
  });

  ContactUsBtn?.addEventListener("click", (e) => {
    e.preventDefault();
    statusElem?.classList.add("hidden")
    profileSection?.classList.add("hidden");
    productsList?.classList.add("hidden");
    settingsSection?.classList.add("hidden");
    cartSection?.classList.add("hidden");
    ordersSection?.classList.add("hidden");
    if (productStatus) productStatus.style.display = 'none';
    ContactSection.classList.remove("hidden");
    sidebar?.classList.remove("open");
  });

  function loadProfile() {
    const profile = JSON.parse(localStorage.getItem('profile')) || {};
    nameInput.value = profile.name || '';
    mobileInput.value = profile.mobile || '';
    emailInput.value = profile.email || '';
    MyFramework.log('Profile loaded');
  }

  function loadAddresses() {
    const addresses = JSON.parse(localStorage.getItem('addresses')) || [];
    const activeIndex = localStorage.getItem('activeAddress') || 0;
    const noAddressMsg = document.getElementById('no-address-message');

    addressList.innerHTML = '';
    if (addresses.length === 0) {
      noAddressMsg.style.display = 'block';
      return;
    } else {
      noAddressMsg.style.display = 'none';
    }

    addresses.forEach((addr, index) => {
      const div = document.createElement('div');
      const isActive = index == activeIndex;
      div.className = `address-item ${isActive ? 'active-address' : ''}`;
      div.innerHTML = `
        <div class="address-content">
          <div class="address-info">
            <p>${addr.door}, ${addr.street}, ${addr.city}</p>
            <p>${addr.district}, ${addr.state}, ${addr.pincode}</p>
            <p>Landmark: ${addr.landmark}</p>
          </div>
          <div class="address-icons">
            <span class="active-icon" style="visibility: ${isActive ? 'visible' : 'hidden'}">&#10003;</span>
            <button class="delete-address-btn" data-index="${index}" title="Delete">
              <img src="icons/delete.png" alt="Delete" />
            </button>
          </div>
        </div>
      `;
      addressList.appendChild(div);
    });

    attachAddressActionHandlers();
    MyFramework.log('Addresses loaded');
  }

  function attachAddressActionHandlers() {
    document.querySelectorAll('.address-item').forEach((item, index) => {
      item.addEventListener('click', () => {
        localStorage.setItem('activeAddress', index);
        MyFramework.log(`Address at index ${index} set as active`);
        loadAddresses();
      });
    });

    document.querySelectorAll('.delete-address-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const index = e.currentTarget.dataset.index;
        let addresses = JSON.parse(localStorage.getItem('addresses')) || [];
        addresses.splice(index, 1);
        localStorage.setItem('addresses', JSON.stringify(addresses));
        if (index == localStorage.getItem('activeAddress')) {
          localStorage.setItem('activeAddress', 0);
        }
        MyFramework.log(`Deleted address at index ${index}`);
        loadAddresses();
      });
    });
  }
  
 const settingsUserNameInput = document.getElementById("name");
  const settingsPasswordInput = document.getElementById("email");
  const themeRadios = document.querySelectorAll('input[name="theme"]');

  // Load saved credentials
  const savedUsername = localStorage.getItem("savedUsername");
  const savedPassword = localStorage.getItem("savedPassword");
  if (savedUsername) settingsUserNameInput.value = savedUsername;
  if (savedPassword) settingsPasswordInput.value = savedPassword;

  // Load saved theme
  const savedTheme = localStorage.getItem("theme") || "light";
  themeRadios.forEach(radio => {
  radio.addEventListener("change", () => {
    if (radio.checked) {
      const selectedTheme = radio.value;
      document.body.classList.toggle("dark-mode", selectedTheme === "dark");
      document.body.classList.toggle("light-mode", selectedTheme === "light"); // Optional
      localStorage.setItem("theme", selectedTheme);
    }
  });
});

  // Restricted feature alert
  function showRestrictedAlert() {
    showCustomAlert("This feature is not accessible to you. Please contact Admin at jeyakrishnanofficial@gmail.com");
  }

  document.getElementById("change-password-btn").addEventListener("click", showRestrictedAlert);
  document.getElementById("delete-account-btn").addEventListener("click", showRestrictedAlert);

  // Optional: Save updated username and password when they change
  settingsUserNameInput.addEventListener("input", () => {
    localStorage.setItem("username", settingsUserNameInput.value);
  });
  settingsPasswordInput.addEventListener("input", () => {
    localStorage.setItem("password", settingsPasswordInput.value);
  });


 // Only run this if we're on home.html
  if (!window.location.pathname.endsWith("home.html")) {
    document.body.classList.add('loaded');
    return; // exit safely on other pages
  }

  const sectionMap = {
    "#home": "products-list",
    "#profile": "profile-section",
    "#orders": "orders-section",   // adjust to your actual orders section
    "#contact": "contactSection",
    "#settings": "settings-section"
  };

  function showSectionFromHash() {
    const hash = window.location.hash || "#home";

    // Hide all main sections first
    document.querySelectorAll("#products-list, #profile-section, #orders-section, #contactSection, #settings-section")
      .forEach(el => el.classList.add("hidden"));

    // Hide product-status-wrapper by default
    const statusWrapper = document.querySelector(".product-status-wrapper");
    if (statusWrapper) statusWrapper.style.display = "none";

    // Show the matched section
    if (sectionMap[hash]) {
      const target = document.getElementById(sectionMap[hash]);
      if (target) {
        target.classList.remove("hidden");

        // Only show product-status-wrapper on Home
        if (hash === "#home" && statusWrapper) {
          statusWrapper.style.display = "block";
        }
        if (hash === "#settings" && statusWrapper) {
          loadSettingsTheme();
        }

// Load orders when we land on #orders
      if (hash === "#orders") {
        loadOrders();
      }
        MyFramework.log(`Navigated to ${hash} section`);
      }
    }
  }

  // Run on load
  showSectionFromHash();

  // Also run when hash changes
  window.addEventListener("hashchange", showSectionFromHash);
  
  document.body.classList.add('loaded');

});

function showLoading() {
    const loadingOverlay = document.getElementById("loadingOverlay");
    if (loadingOverlay) loadingOverlay.style.display = "flex";
  }

  function navigateToLoginPage() {
    clearLoginData();
    showLoading();
    setTimeout(() => window.location.href = "index.html", 2000);
  }

  function navigateToHomePage() {
    showLoading();
    setTimeout(() => window.location.href = "home.html", 2000);
  }

  function navigateToCartPage() {
    showLoading();
    setTimeout(() => window.location.href = "cart.html", 2000);
  }

  function refreshPage() {
    showLoading();
    setTimeout(() => {
      window.location.href = window.location.href;
    }, 2000);
  }
  
  document.querySelectorAll('.modal-close').forEach(btn => {
  btn.addEventListener('click', () => {
  btn.closest('.modal-overlay').style.display = 'none';
    MyFramework.log('Closed modal');
  });
});
  
  function showCustomAlert(title, message, okText = "OK", onConfirm = null, showCancel = false, onCancel = null) {
  MyFramework.log('INFO', '[Alert] showCustomAlert called with title: "' + title + '"');

  const alertBox = document.getElementById('custom-alert');
  const alertTitle = document.getElementById('alert-title');
  const alertMessage = document.getElementById('alert-message');
  const alertOkBtn = document.getElementById('alert-ok-btn');
  const alertCancelBtn = document.getElementById('alert-cancel-btn');
  const alertCloseBtn = document.getElementById('alert-close');

  if (!alertBox || !alertTitle || !alertMessage || !alertOkBtn || !alertCancelBtn || !alertCloseBtn) {
    MyFramework.log('ERROR', '[Alert] One or more alert DOM elements not found.');
    return;
  }

  // Set content
  alertTitle.textContent = title;
  alertMessage.textContent = message;
  alertOkBtn.textContent = okText;

  // Toggle cancel button visibility
  if (showCancel) {
    alertCancelBtn.classList.remove('hidden');
    MyFramework.log('DEBUG', '[Alert] Cancel button displayed.');
  } else {
    alertCancelBtn.classList.add('hidden');
    MyFramework.log('DEBUG', '[Alert] Cancel button hidden.');
  }

  // Show alert box
  alertBox.classList.remove('hidden');
  MyFramework.log('INFO', '[Alert] Custom alert displayed on screen.');

  // OK button logic
  alertOkBtn.onclick = () => {
    MyFramework.log('INFO', '[Alert] OK button clicked.');
    alertBox.classList.add('hidden');
    if (typeof onConfirm === 'function') {
      MyFramework.log('DEBUG', '[Alert] onConfirm callback executed.');
      onConfirm();
    } else {
      MyFramework.log('DEBUG', '[Alert] No onConfirm callback provided.');
    }
  };

  // Cancel button logic
  alertCancelBtn.onclick = () => {
    MyFramework.log('INFO', '[Alert] Cancel button clicked.');
    alertBox.classList.add('hidden');
    if (typeof onCancel === 'function') {
      MyFramework.log('DEBUG', '[Alert] onCancel callback executed.');
      onCancel();
    } else {
      MyFramework.log('DEBUG', '[Alert] No onCancel callback provided.');
    }
  };

  // Close (X) button logic
  alertCloseBtn.onclick = () => {
    MyFramework.log('INFO', '[Alert] Close (X) button clicked. Alert dismissed.');
    alertBox.classList.add('hidden');
  };
}
  document.getElementById('alert-close').addEventListener('click', () => {
    document.getElementById('custom-alert').classList.add('hidden');
    MyFramework.log("Custom alert closed via close icon");
  });


/* ================================
   Load Orders Module
   ================================ */
function loadOrders() {
  MyFramework.log("INFO", "[Orders] Loading orders...");

  const ordersContainer = document.getElementById("orders-section");
  if (!ordersContainer) {
    MyFramework.log("ERROR", "[Orders] #orders-section not found in DOM.");
    return;
  }

  // Reset content
  ordersContainer.innerHTML = "";

  const title = document.createElement("h2");
  title.className = "orders-title";
  title.textContent = "Your Orders";
  ordersContainer.appendChild(title);

  let orders = JSON.parse(localStorage.getItem("orders")) || [];
  orders.sort((a, b) => new Date(b.date) - new Date(a.date));

  if (orders.length === 0) {
    ordersContainer.innerHTML += `<p class="no-orders">No orders found.</p>`;
    ordersContainer.classList.remove("hidden");
    return;
  }

  orders.forEach(order => {
    const orderCard = document.createElement("div");
    orderCard.className = "order-card";

    // Default status immediately
    const defaultStatus = `<span class="status-badge status-pending">Pending Payment</span>`;

    orderCard.innerHTML = `
      <div class="order-card-header">
        <h3>${order.id}</h3>
        <span class="order-date">${new Date(order.date).toLocaleString()}</span>
      </div>
      <div class="order-summary">
        <p><strong>Total:</strong> ${order.total}</p>
        <p><strong>Status:</strong> <span class="order-status">${defaultStatus}</span></p>
      </div>
      <div class="order-actions">
        <button class="view-order-btn">View Details</button>
        <button class="delete-order-btn">Delete</button>
      </div>
    `;

    // Delete button
    orderCard.querySelector(".delete-order-btn").addEventListener("click", () => {
      showCustomAlert(
        "Delete Order",
        `Are you sure you want to delete order ${order.id}?`,
        "Delete",
        () => {
          let updatedOrders = JSON.parse(localStorage.getItem("orders")) || [];
          updatedOrders = updatedOrders.filter(o => o.id !== order.id);
          localStorage.setItem("orders", JSON.stringify(updatedOrders));
          loadOrders();
        },
        true
      );
    });

    // View details button
    orderCard.querySelector(".view-order-btn").addEventListener("click", () => {
      openOrderModal(order);
    });

    ordersContainer.appendChild(orderCard);

    // Fetch external status
    fetch("orders-status.json")
      .then(res => res.json())
      .then(statusData => {
        let statusObj;
        if (Array.isArray(statusData)) {
          statusObj = statusData.find(o => o.OrderID === order.id);
        } else if (statusData.OrderID === order.id) {
          statusObj = statusData;
        }

        const statusSpan = orderCard.querySelector(".order-status");

        if (statusObj && statusObj.status) {
          const statusText = statusObj.status;
          let statusClass = "status-pending";
          const lowerStatus = statusText.toLowerCase();
          if (lowerStatus.includes("shipped")) statusClass = "status-shipped";
          else if (lowerStatus.includes("delivered")) statusClass = "status-delivered";
          else if (lowerStatus.includes("placed")) statusClass = "status-placed";
          else if (lowerStatus.includes("cancel")) statusClass = "status-cancelled";

          statusSpan.innerHTML = `<span class="status-badge ${statusClass}">${statusText}</span>`;
        }
      })
      .catch(err => {
        MyFramework.log("ERROR", "[Orders] Could not fetch order status", err);
      });
  });

  ordersContainer.classList.remove("hidden");
}
/* ================================
   Open Order Modal (uses static HTML)
   ================================ */
function openOrderModal(order) {
  const modalOverlay = document.getElementById("order-details-modal");
  const modalTitle = document.getElementById("order-details-title");
  const modalBody = document.getElementById("order-details-body");

  if (!modalOverlay || !modalTitle || !modalBody) {
    MyFramework.log("ERROR", "[Orders] Modal elements not found.");
    return;
  }

  // Set title
  modalTitle.textContent = `Order Details - ${order.id}`;

  // Fill body with order details
  modalBody.innerHTML = `
    <div class="order-section">
      <h3>Contact Details</h3>
      <div class="detail-row"><span>Name:</span><span>${order.name}</span></div>
      <div class="detail-row"><span>Mobile:</span><span>${order.mobile}</span></div>
      <div class="detail-row"><span>Email:</span><span>${order.email || "N/A"}</span></div>
    </div>

    <div class="order-section">
      <h3>Delivery Address</h3>
      <p>${order.address}</p>
    </div>

    <div class="order-section">
      <h3>Order Summary</h3>
      <div class="detail-row"><span>Subtotal:</span><span>${order.subtotal}</span></div>
      <div class="detail-row"><span>Platform Fee:</span><span>${order.platform}</span></div>
      <div class="detail-row"><span>Delivery Fee:</span><span>${order.delivery}</span></div>
      <div class="detail-row"><span>Discount${order.couponCode}:</span><span>${order.discount}</span></div>
      <div class="detail-row total"><span>Total:</span><span>${order.total}</span></div>
    </div>

    <div class="order-section">
      <h3>Items</h3>
      <div class="items-list">${order.items}</div>
    </div>

    <div class="order-section">
      <h3>Payment Details</h3>
      <div id="payment-info" class="payment-box">Loading...</div>
    </div>

    <div class="order-section">
      <h3>Comments</h3>
      <div id="order-comments" class="comments-box">Loading...</div>
    </div>

    <div class="order-section">
      <h3>Courier Details</h3>
      <p id="courier-info">Loading...</p>
    </div>

    <div class="order-section">
  <h3>Order Progress</h3>
  <div class="progress-bar-vertical">
    <div class="progress-step" data-label="Placed">
      <img src="img/placed.png" alt="Placed" />
      <span class="tick">&#10003;</span>
      <div class="step-label">Placed</div>
    </div>
    <div class="progress-step" data-label="Payment">
      <img src="img/payment.png" alt="Payment" />
      <span class="tick">&#10003;</span>
      <div class="step-label">Payment</div>
    </div>
    <div class="progress-step" data-label="Shipped">
      <img src="img/shipped.png" alt="Shipped" />
      <span class="tick">&#10003;</span>
      <div class="step-label">Shipped</div>
    </div>
    <div class="progress-step" data-label="On the way">
      <img src="img/ontheway.png" alt="On the way" />
      <span class="tick">&#10003;</span>
      <div class="step-label">On the way</div>
    </div>
    <div class="progress-step" data-label="Delivered">
      <img src="img/delivered.png" alt="Delivered" />
      <span class="tick">&#10003;</span>
      <div class="step-label">Delivered</div>
    </div>
  </div>
</div>
  `;

  // Show modal
  modalOverlay.classList.remove("hidden");
  modalOverlay.style.display = "flex";

  // Close button
  modalOverlay.querySelector(".order-close-btn").addEventListener("click", () => {
    modalOverlay.classList.add("hidden");
  });

  fetch("orders-status.json")
  .then(res => res.json())
  .then(statusData => {
    let statusObj;
    if (Array.isArray(statusData)) {
      statusObj = statusData.find(o => o.OrderID === order.id);
    } else if (statusData.OrderID === order.id) {
      statusObj = statusData;
    }

    // ✅ Put it here
    if (statusObj) {
      updateVerticalProgressBar(modalOverlay, statusObj.status);

      document.getElementById("courier-info").textContent =
        `Courier ID: ${statusObj.courierId || "N/A"}`;

      document.getElementById("order-comments").textContent =
        statusObj.comments || "No comments";

      if (statusObj.payment) {
        document.getElementById("payment-info").innerHTML = `
          <div class="detail-row"><span>Payment Mode:</span><span>${statusObj.payment.mode || "N/A"}</span></div>
          <div class="detail-row"><span>Payment ID:</span><span>${statusObj.payment.id || "N/A"}</span></div>
          <div class="detail-row"><span>Date of Payment:</span><span>${statusObj.payment.date ? new Date(statusObj.payment.date).toLocaleString() : "N/A"}</span></div>
          <div class="detail-row"><span>Payment Amount:</span><span>${statusObj.payment.amount || "N/A"}</span></div>
          <div class="detail-row"><span>Remaining Amount:</span><span>${statusObj.payment.remaining || "N/A"}</span></div>
        `;
      }
    } else {
      // ✅ Default: show progress bar as "Placed" (pending payment)
      updateVerticalProgressBar(modalOverlay, "Placed");
    }
  })
  .catch(err => {
    MyFramework.log("ERROR", "[Orders] Could not fetch order details", err);
    // If fetch fails, still show default
    updateVerticalProgressBar(modalOverlay, "Placed");
  });
  
  }

function updateVerticalProgressBar1(modalOverlay, status) {
  const stepsData = [
    { name: "Placed", img: "img/placed.png", gif: "gif/placed.gif" },
    { name: "Payment", img: "img/payment.png", gif: "gif/payment.gif" },
    { name: "Shipped", img: "img/shipped.png", gif: "gif/shipped.gif" },
    { name: "On the way", img: "img/ontheway.png", gif: "gif/ontheway.gif" },
    { name: "Delivered", img: "img/delivered.png", gif: "gif/delivered.gif" }
  ];

  const container = modalOverlay.querySelector(".progress-bar-vertical");
  if (!container) return;

  container.innerHTML = `
    <div class="progress-line-vertical"></div>
    <div class="progress-line-fill-vertical"></div>
    <div class="progress-steps-vertical"></div>
  `;

  const stepsContainer = container.querySelector(".progress-steps-vertical");

  // Append steps
  stepsData.forEach(step => {
    const stepEl = document.createElement("div");
    stepEl.className = "progress-step pending";
    stepEl.dataset.label = step.name;
    stepEl.innerHTML = `
      <img src="${step.img}" alt="${step.name}" />
      <span class="tick">&#10003;</span>
      <div class="step-label">${step.name}</div>
    `;
    stepsContainer.appendChild(stepEl);
  });

  // Determine current step based on status and payment
  let currentIndex = 1; // default to Placed
  const statusLower = (status || "").toLowerCase();
  if (statusLower.includes("payment")) currentIndex = 1;
  else if (statusLower.includes("shipped")) currentIndex = 2;
  else if (statusLower.includes("on the way")) currentIndex = 3;
  else if (statusLower.includes("delivered")) currentIndex = 4;

  const stepEls = Array.from(stepsContainer.children);
  stepEls.forEach((stepEl, index) => {
    const label = stepEl.querySelector(".step-label");
    const img = stepEl.querySelector("img");
    const tick = stepEl.querySelector(".tick");

    stepEl.classList.remove("completed", "active", "pending");
    tick.style.display = "none";
    img.classList.remove("active-step-gif");

    if (index < currentIndex) {
      stepEl.classList.add("completed");
      tick.style.display = "flex";
      label.textContent = `${stepsData[index].name} (Completed)`;
      label.style.color = "#059669";
      img.src = stepsData[index].img;
    } else if (index === currentIndex) {
      stepEl.classList.add("active");
      img.src = stepsData[index].gif;
      img.classList.add("active-step-gif"); // animate only the GIF
      label.textContent = `${stepsData[index].name} (In Progress)`;
      label.style.color = "#f59e0b";
    } else {
      stepEl.classList.add("pending");
      img.src = stepsData[index].img;
      label.textContent = stepsData[index].name;
      label.style.color = "#64748b";
    }
  });

  // Vertical line fill
  const lineFill = container.querySelector(".progress-line-fill-vertical");
  const totalHeight = container.offsetHeight - 60*2; // top and bottom offset
  lineFill.style.top = "60px";
  lineFill.style.height = `${(currentIndex / (stepsData.length - 1)) * totalHeight}px`;

  // Update order status badge
  const statusLabel = modalOverlay.querySelector(".order-status");
  if (statusLabel) {
    let badgeClass = "status-pending";
    if (currentIndex === 0) badgeClass = "status-placed";
    else if (currentIndex === 1) badgeClass = "status-pending";
    else badgeClass = `status-${stepsData[currentIndex].name.toLowerCase().replace(/\s+/g,'')}`;
    statusLabel.innerHTML = `<span class="status-badge ${badgeClass}">${stepsData[currentIndex].name}</span>`;
  }
}

function updateVerticalProgressBar(modalOverlay, status) {
  const stepsData = [
    { name: "Placed", img: "icons/placed.png", gif: "icons/placed.gif" },
    { name: "Payment", img: "icons/payment.png", gif: "icons/payment.gif" },
    { name: "Shipped", img: "icons/shipped.png", gif: "icons/shipped.gif" },
    { name: "On the way", img: "icons/ontheway.png", gif: "icons/ontheway.gif" },
    { name: "Delivered", img: "icons/delivered.png", gif: "icons/delivered.gif" }
  ];

  const container = modalOverlay.querySelector(".progress-bar-vertical");
  if (!container) return;

  // Reset container
  container.innerHTML = `
    <div class="progress-line-vertical"></div>
    <div class="progress-line-fill-vertical"></div>
    <div class="progress-steps-vertical"></div>
  `;
  const stepsContainer = container.querySelector(".progress-steps-vertical");

  // Append steps
  stepsData.forEach(step => {
    const stepEl = document.createElement("div");
    stepEl.className = "progress-step pending";
    stepEl.dataset.label = step.name;
    stepEl.innerHTML = `
      <img src="${step.img}" alt="${step.name}" />
      <span class="tick">&#10003;</span>
      <div class="step-label">${step.name}</div>
    `;
    stepsContainer.appendChild(stepEl);
  });

  // Determine current step based on status
  let currentIndex = 1; // default Placed
  const statusLower = (status || "").toLowerCase();
  if (statusLower.includes("payment")) currentIndex = 1;
  else if (statusLower.includes("shipped")) currentIndex = 2;
  else if (statusLower.includes("on the way")) currentIndex = 3;
  else if (statusLower.includes("delivered")) currentIndex = 4;

  const stepEls = Array.from(stepsContainer.children);

  // Update step states
  stepEls.forEach((stepEl, index) => {
    const label = stepEl.querySelector(".step-label");
    const img = stepEl.querySelector("img");
    const tick = stepEl.querySelector(".tick");

    stepEl.classList.remove("completed", "active", "pending");
    tick.style.display = "none";
    img.classList.remove("active-step-gif");

    if (index < currentIndex) {
      stepEl.classList.add("completed");
      tick.style.display = "flex";
      img.src = stepsData[index].img;
      label.textContent = `${stepsData[index].name} (Completed)`;
      label.style.color = "#059669";
    } else if (index === currentIndex) {
      stepEl.classList.add("active");
      img.src = stepsData[index].gif;
      img.classList.add("active-step-gif");
      label.textContent = `${stepsData[index].name} (In Progress)`;
      label.style.color = "#f59e0b";
    } else {
      stepEl.classList.add("pending");
      img.src = stepsData[index].img;
      label.textContent = stepsData[index].name;
      label.style.color = "#64748b";
    }
  });

  // Animate vertical line **after DOM is painted**
  requestAnimationFrame(() => {
    const lineFill = container.querySelector(".progress-line-fill-vertical");
    const totalHeight = container.offsetHeight - 60 * 2; // top/bottom offset
    const targetHeight = currentIndex === 0
      ? 0
      : (currentIndex / (stepsData.length - 1)) * totalHeight;

    lineFill.style.top = "60px";
    lineFill.style.height = "0px"; // start from 0

    // Trigger smooth animation
    setTimeout(() => {
      lineFill.style.transition = "height 0.8s ease";
      lineFill.style.height = targetHeight + "px";
    }, 50);
  });

  // Update modal status badge
  const statusLabel = modalOverlay.querySelector(".order-status");
  if (statusLabel) {
    let badgeClass = "status-pending";
    if (currentIndex === 0) badgeClass = "status-placed";
    else if (currentIndex === 1) badgeClass = "status-pending";
    else badgeClass = `status-${stepsData[currentIndex].name.toLowerCase().replace(/\s+/g,'')}`;

    statusLabel.innerHTML = `<span class="status-badge ${badgeClass}">${stepsData[currentIndex].name}</span>`;
  }
}