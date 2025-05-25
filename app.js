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
  const settingsBtn = document.querySelector('a[href="#"] img[alt="Settings"]')?.parentElement;
  const ContactUsBtn = document.querySelector('a[href="#"] img[alt="Contact"]')?.parentElement;
  const profileBtn = document.getElementById('profile-btn');

  const settingsSection = document.getElementById("settings-section");
  const profileSection = document.getElementById("profile-section");
  const productsList = document.getElementById("products-list");
  const ContactSection = document.getElementById("contactSection");
  const productStatus = document.getElementById('product-status');

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
    profileSection.classList.remove('hidden');
    loadProfile();
    loadAddresses();
    if (productStatus) productStatus.style.display = 'none';
    ContactSection?.classList.add("hidden");
    settingsSection?.classList.add("hidden");
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

  settingsBtn?.addEventListener("click", (e) => {
    e.preventDefault();
    profileSection?.classList.add("hidden");
    productsList?.classList.add("hidden");
    ContactSection?.classList.add("hidden");
    if (productStatus) productStatus.style.display = 'none';
    settingsSection.classList.remove("hidden");
    sidebar?.classList.remove("open");
  });

  ContactUsBtn?.addEventListener("click", (e) => {
    e.preventDefault();
    profileSection?.classList.add("hidden");
    productsList?.classList.add("hidden");
    settingsSection?.classList.add("hidden");
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

});

function showLoading() {
    const loadingOverlay = document.getElementById("loadingOverlay");
    if (loadingOverlay) loadingOverlay.style.display = "flex";
  }

  function navigateToLoginPage() {
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