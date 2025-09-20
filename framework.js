window.MyFramework = (() => {
  const logs = [];

  function log(name, action) {
  const time = new Date().toISOString();
  const logEntry = {
    time: time,
    name: name,
    action: action
  };

  const logs = getData('logs') || []; // Retrieve existing logs, or initialize as an empty array.
  logs.push(logEntry);               // Add the new log.
  saveData('logs', logs);            // Save back to localStorage.

  console.log(`[${time}] ${name}: ${action}`); // Optionally log to the console as well.
}



  function onClick(selector, name, callback) {
  document.querySelectorAll(selector).forEach(btn => {
    btn.addEventListener('click', (e) => {
      log(name, 'clicked');
      callback(e);
    });
  });
}

function onInput(selector, name) {
  document.querySelectorAll(selector).forEach(input => {
    input.addEventListener('input', () => {
      log(name, 'entered value');
    });
  });
}

  function getLogs() {
    return logs;
  }

  function downloadLogs(filename = 'logs.json') {
    const blob = new Blob([JSON.stringify(logs, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }
  
  function saveLogs() {
  localStorage.setItem('myFrameworkLogs', JSON.stringify(logs));
}

function loadLogs() {
  const saved = localStorage.getItem('myFrameworkLogs');
  return saved ? JSON.parse(saved) : [];
}

function displayLogs() {
  const logs = getData('logs');
  if (logs && logs.length) {
    logs.forEach(log => {
      console.log(`[${log.time}] ${log.name}: ${log.action}`);
    });
  } else {
    console.log('No logs found.');
  }
}

function saveData(key, data) {
  localStorage.setItem(key, JSON.stringify(data));
}

function getData(key) {
  const data = localStorage.getItem(key);
  return data ? JSON.parse(data) : null;
}


  return {
    log,
    onClick,
    getLogs,
    saveLogs,
    downloadLogs
  };
})();

window.protectPage = function(currentPage, allowedFromPages = [], requiresAuth = false, redirectTo = "index.html") {
  const user = localStorage.getItem("user");
  const lastPage = localStorage.getItem("lastPage");
  const loginTime = localStorage.getItem("loginTime");
  const isAuthenticated = !!user;

  // 1️⃣ Session expiry (30 mins)
  if (isAuthenticated && loginTime) {
    const elapsedMinutes = (Date.now() - parseInt(loginTime, 10)) / (1000 * 60);
    if (elapsedMinutes > 30) {
      sessionStorage.clear();
      window.location.href = "index.html";
      return;
    }
  }

  // 2️⃣ Require authentication
  if (requiresAuth && !isAuthenticated) {
    window.location.href = redirectTo;
    return;
  }

  // 3️⃣ Allowed page flow
  if (allowedFromPages.length > 0) {
    if (!lastPage && !isAuthenticated) {
      // First visit, not authenticated → redirect
      window.location.href = redirectTo;
      return;
    }

    if (lastPage && !allowedFromPages.includes(lastPage)) {
      // Special case: cart / summary pages → redirect to home if authenticated
      if ((currentPage === "cart" || currentPage === "summary") && isAuthenticated) {
        window.location.href = "home.html";
        return;
      }
      // Other cases → redirect to index
      if (!isAuthenticated || currentPage === "index") {
        window.location.href = redirectTo;
        return;
      }
    }
  }

  // ✅ Passed all checks → save current page as lastPage
  localStorage.setItem("lastPage", currentPage);
};

function setAuthenticated(username, currentPage) {
  localStorage.setItem("user", JSON.stringify({ username }));
  localStorage.setItem("isAuthenticated", "true");
  localStorage.setItem("loginTime", Date.now());
  localStorage.setItem("lastPage", currentPage);
}

/**
 * Logs out the user and clears all authentication-related data.
 * Use this function on logout buttons or when the user navigates to the login page.
 */
function clearLoginData() {
  // Clear authentication and navigation info
  localStorage.removeItem("user");
  localStorage.removeItem("loginTime");
  localStorage.removeItem("lastPage");
  localStorage.removeItem("savedUsername");
  localStorage.removeItem("savedPassword");
  localStorage.removeItem("isAuthenticated");

  // Optionally clear other session info if needed
  sessionStorage.clear();
}

/**
 * Call this on index.html load to ensure unauthorized access is blocked
 */
function checkLoginPageAccess() {
  const user = localStorage.getItem("user");
  const loginTime = localStorage.getItem("loginTime");

  // If user is already logged in and session not expired, redirect to home
  if (user && loginTime) {
    const elapsedMinutes = (Date.now() - parseInt(loginTime, 10)) / (1000 * 60);
    if (elapsedMinutes <= 30) {
      window.location.href = "home.html";
      return;
    }
  }

  // If user is coming to login page accidentally or after expiry, clear everything
  logoutUser();
}