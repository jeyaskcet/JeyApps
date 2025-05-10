// app.js
document.addEventListener('DOMContentLoaded', () => {
  MyFramework.onClick('.my-button', (e) => {
    alert('Button clicked!');
  });

  MyFramework.log('App Initialized');
});

const closeSidebarBtn = document.getElementById('close-sidebar-btn');

closeSidebarBtn.addEventListener('click', () => {
  sidebar.classList.remove('active');
  MyFramework.log('Sidebar closed');
});

const menuBtn = document.getElementById('menu-btn');
const sidebar = document.getElementById('sidebar');

// Toggle sidebar on menu button click
menuBtn.addEventListener('click', () => {
  sidebar.classList.toggle('active');
  MyFramework.log(`Sidebar ${sidebar.classList.contains('active') ? 'opened' : 'closed'} by toggle`);
});

// Close when clicking outside the sidebar
document.addEventListener('click', (e) => {
  if (sidebar.classList.contains('active')) {
    if (!sidebar.contains(e.target) && !menuBtn.contains(e.target)) {
      sidebar.classList.remove('active');
      MyFramework.log('Sidebar closed by clicking outside');
    }
  }
});

// Close when clicking any link inside sidebar
document.querySelectorAll('#sidebar a').forEach(link => {
  link.addEventListener('click', () => {
    sidebar.classList.remove('active');
    MyFramework.log('Sidebar closed after link click');
  });
});


document.addEventListener('DOMContentLoaded', () => {
  const homeBtn = document.getElementById('home-btn');
  const logoutBtn = document.getElementById('logout-btn');

  if (homeBtn) {
    homeBtn.addEventListener('click', (e) => {
      e.preventDefault();  // Prevent default link behavior
      showLoading();
      window.location.href = 'home.html';
      MyFramework.log('Navigate to home page');
    });
  }

  if (logoutBtn) {
    logoutBtn.addEventListener('click', (e) => {
      e.preventDefault();  // Prevent default link behavior
      showLoading();
      window.location.href = 'index.html';
      MyFramework.log('Navigate to login page');
    });
  }
});

function showLoading() {
  var loadingOverlay = document.getElementById("loadingOverlay");
  if (loadingOverlay) {
    loadingOverlay.style.display = "flex"; // Show the loading overlay
  }
}
 