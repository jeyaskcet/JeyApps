// app.js

document.addEventListener('DOMContentLoaded', () => { 
MyFramework.onClick('.my-button', (e) => { 
alert('Button clicked!'); 
});

MyFramework.log('App Initialized');

// Load profile and addresses initially
loadProfile(); 
loadAddresses(); });

const sidebar = document.getElementById('sidebar');
const closeSidebarBtn = document.getElementById('close-sidebar-btn');
const menuBtn = document.getElementById('menu-btn');

closeSidebarBtn?.addEventListener('click', () => {
sidebar.classList.remove('active');
MyFramework.log('Sidebar closed');
});

menuBtn?.addEventListener('click', () => {
sidebar.classList.toggle('active');
MyFramework.log('sidebar is active');
});

document.addEventListener('click', (e) => {
if (sidebar.classList.contains('active')) {
if (!sidebar.contains(e.target) && !menuBtn.contains(e.target)) { sidebar.classList.remove('active');
MyFramework.log('Sidebar closed by clicking outside');
}
}
});

document.querySelectorAll('#sidebar a').forEach(link => {
link.addEventListener('click', () => {
sidebar.classList.remove('active');
MyFramework.log('Sidebar closed after link click');
});
});

document.addEventListener('DOMContentLoaded', () => {
const homeBtn = document.getElementById('home-btn');
const logoutBtn = document.getElementById('logout-btn');

homeBtn?.addEventListener('click', (e) => {
e.preventDefault(); 
navigateToHomePage();
MyFramework.log('Navigate to home page'); });

logoutBtn?.addEventListener('click', (e) => {
e.preventDefault(); 
navigateToLoginPage();
MyFramework.log('Navigate to login page');
});
});

function showLoading() { 
const loadingOverlay = document.getElementById("loadingOverlay"); 
if (loadingOverlay){ 
loadingOverlay.style.display = "flex"; 
} 
}

function navigateToLoginPage() {
  showLoading();
  setTimeout(function() {
    window.location.href = "index.html"; // Replace with the actual home page URL
  }, 2000); // 3000 milliseconds = 3 seconds
}

function navigateToHomePage() {
  showLoading();
  setTimeout(function() {
    window.location.href = "home.html"; // Replace with the actual home page URL
  }, 2000); // 3000 milliseconds = 3 seconds
}

function navigateToCartPage() {
  showLoading();
  setTimeout(function() {
    window.location.href = "Cart.html"; // Replace with the actual home page URL
  }, 2000); // 3000 milliseconds = 3 seconds
}

function refreshPage() {
  showLoading();
  setTimeout(function() {
    var currentUrl = window.location.href;
    window.location.href = currentUrl;
  }, 2000); 
    
   }

// Profile Elements
const profileSection = document.getElementById('profile-section');
// const profileBtn = document.querySelector('a[href="#"] img[alt="Profile"]')?.parentElement;
const profileBtn = document.getElementById('profile-btn');
const nameInput = document.getElementById('profile-name');
const mobileInput = document.getElementById('profile-mobile');
const emailInput = document.getElementById('profile-email');
const editBtn = document.getElementById('edit-profile-btn');
const saveBtn = document.getElementById('save-profile-btn');

// Address Elements
const addressList = document.getElementById('address-list');
const addAddressBtn = document.getElementById('add-address-btn');
const addressModal = document.querySelector('.address-modal');
const saveAddressBtn = document.getElementById('save-address-btn');
const cancelAddressBtn = document.getElementById('cancel-address-btn');

// Address form fields
const addrFields = ['door', 'street', 'city', 'district', 'state', 'pincode', 'landmark'];

// Show Profile Section
profileBtn?.addEventListener('click', () => {
document.querySelectorAll('main > *').forEach(el =>
    el.classList.add('hidden'));
   profileSection.classList.remove('hidden');
   loadProfile(); 
   loadAddresses();
   const productStatus = document.getElementById('product-status');
if (productStatus) productStatus.style.display = 'none';
   MyFramework.log('Profile section shown');
   });

function loadProfile() { 
const profile = JSON.parse(localStorage.getItem('profile')) || {}; 
nameInput.value = profile.name || '';
mobileInput.value = profile.mobile || '';
emailInput.value = profile.email || '';
MyFramework.log('Profile loaded'); }

saveBtn?.addEventListener('click', () => { 
const profile = { name: nameInput.value, mobile: mobileInput.value, email: emailInput.value };
localStorage.setItem('profile', JSON.stringify(profile)); 
[nameInput, mobileInput, emailInput].forEach(i => i.disabled = true);
saveBtn.classList.add('hidden');
MyFramework.log('Profile saved'); });

editBtn?.addEventListener('click', () => {
[nameInput, mobileInput, emailInput].forEach(i => i.disabled = false);
saveBtn.classList.remove('hidden');
MyFramework.log('Profile edit mode enabled');
});

function loadAddresses() {
  const addresses = JSON.parse(localStorage.getItem('addresses')) || [];
  const activeIndex = localStorage.getItem('activeAddress') || 0;
  const noAddressMsg = document.getElementById('no-address-message');

  addressList.innerHTML = ''; // clear address cards

  if (addresses.length === 0) {
    noAddressMsg.style.display = 'block';
    return;
  } else {
    noAddressMsg.style.display = 'none';
  }

addressList.innerHTML = '';

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
attachAddressActionHandlers();
});

addressList.querySelectorAll('input[type="radio"]').forEach(radio => {
radio.addEventListener('change', (e) => {
localStorage.setItem('activeAddress', e.target.dataset.index);
MyFramework.log('Address #${e.target.dataset.index} set as active');
});
});

addressList.querySelectorAll('.activate-address-btn').forEach(btn => {
btn.addEventListener('click', (e) => {
const index = e.target.dataset.index;
localStorage.setItem('activeAddress', index);
MyFramework.log('Address #${index} explicitly activated');
loadAddresses();
});
});

MyFramework.log('Addresses loaded');
}

addAddressBtn?.addEventListener('click', () => {
addrFields.forEach(id =>
    document.getElementById(id).value = '');
    addressModal.style.display = 'flex';
    MyFramework.log('Address modal opened');
    });

saveAddressBtn?.addEventListener('click', () => {
const newAddress = {}; addrFields.forEach(id => newAddress[id.replace('-', '')] =
    document.getElementById(id).value.trim());

const addresses = JSON.parse(localStorage.getItem('addresses')) || []; 
addresses.push(newAddress); localStorage.setItem('addresses', JSON.stringify(addresses));
localStorage.setItem('activeAddress', addresses.length - 1);

addressModal.style.display = 'none'; loadAddresses(); 
MyFramework.log('New address saved and activated'); 
});

cancelAddressBtn?.addEventListener('click', () => { 
addressModal.style.display = 'none';
MyFramework.log('Address modal closed by Cancel button'); 
});

function attachAddressActionHandlers() {
  document.querySelectorAll('.address-item').forEach((item, index) => {
    item.addEventListener('click', () => {
      localStorage.setItem('activeAddress', index);
      MyFramework.log(`Address at index ${index} set as active`);
      loadAddresses(); // re-render to show tick
    });
  });

  document.querySelectorAll('.delete-address-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation(); // prevent triggering active address change
      const index = e.currentTarget.dataset.index;
      let addresses = JSON.parse(localStorage.getItem('addresses')) || [];
      addresses.splice(index, 1);
      localStorage.setItem('addresses', JSON.stringify(addresses));

      // If deleting the active address, reset active index
      if (index == localStorage.getItem('activeAddress')) {
        localStorage.setItem('activeAddress', 0);
      }

      MyFramework.log(`Deleted address at index ${index}`);
      loadAddresses();
    });
  });
}