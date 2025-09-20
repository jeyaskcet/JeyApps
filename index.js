checkLoginPageAccess();

document.addEventListener("DOMContentLoaded", function() {
    document.getElementById("loginForm").addEventListener("submit", function(event) {
        event.preventDefault();
        var username = document.getElementById("username").value;
        
        var password = document.getElementById("password").value;
        
        if (username.trim() === "" || password.trim() === "") {
            alert("Please enter both username and password.");
            return;
        }

        // Check username and password (this is a basic example)
        var validCredentials = [
            { username: "Jey", password: "jey" },
            { username: "Krishna", password: "krishna" },
             { username: "Apoorva", password: "apoorva" }
        ];

        var validUser = false;
        var validPassword = false;

        for (var i = 0; i < validCredentials.length; i++) {
            if (username === validCredentials[i].username) {
                validUser = true;
                if (password === validCredentials[i].password) {
                    validPassword = true;
                    break;
                }
            }
        }

        if (validUser) {
            if (validPassword) {
                localStorage.setItem("username", username);
                
setAuthenticated(username, "home.html");
                navigateToHome();
                localStorage.setItem("savedUsername", username);
  localStorage.setItem("savedPassword", password); // NOT secure!
  
            } else {
                alert("Incorrect password. Please try again.");
            }
        } else {
            alert("Username not found. Please try again.");
        }
    });
});
function createFirework(x, y) {
    
}
function createFirework1(x, y) {
  const colors = ['#ff6600', '#00ccff', '#ffff00', '#ff33cc', '#66ff66', '#ff0000'];
  for (let i = 0; i < 10; i++) {
    const fw = document.createElement("div");
    fw.classList.add("firework");
    const color = colors[Math.floor(Math.random() * colors.length)];
    fw.style.backgroundColor = color;
    fw.style.left = `${x}px`;
    fw.style.top = `${y}px`;
    fw.style.transform = `translate(-50%, -50%) rotate(${36 * i}deg)`;
    document.body.appendChild(fw);
    setTimeout(() => fw.remove(), 1200);
  }
}

document.addEventListener("DOMContentLoaded", () => {
  setInterval(() => {
    const x = Math.random() * window.innerWidth;
    const y = Math.random() * window.innerHeight * 0.6;
    createFirework(x, y);
  }, 2000); // Adjust timing as needed
});

function navigateToHome() {
  showLoading();
  setTimeout(function() {
    window.location.href = "home.html"; // Replace with the actual home page URL
  }, 2000); // 3000 milliseconds = 3 seconds
}

function navigateToLogout() {
  showLoading();
  setTimeout(function() {
    window.location.href = "index.html"; // Replace with the actual logout page URL
  }, 2000); // 3000 milliseconds = 3 seconds
}

function showLoading() {
  var loadingOverlay = document.getElementById("loadingOverlay");
  if (loadingOverlay) {
    loadingOverlay.style.display = "flex"; // Show the loading overlay
  }
}
