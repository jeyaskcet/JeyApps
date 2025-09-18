document.addEventListener("DOMContentLoaded", () => {
  MyFramework.log("Summary page loaded");

  /* ==========================
     Load Profile
  ========================== */
  const profile = JSON.parse(localStorage.getItem("profile")) || {};
  document.getElementById("summary-name").textContent = profile.name || "-";
  document.getElementById("summary-mobile").textContent = profile.mobile || "-";
  document.getElementById("summary-email").textContent = profile.email || "-";
  MyFramework.log("Profile loaded", profile);

  /* ==========================
     Load Address
  ========================== */
  const addresses = JSON.parse(localStorage.getItem("addresses")) || [];
  const activeIndex = localStorage.getItem("activeAddress") || 0;
  const activeAddress = addresses[activeIndex];
  if (activeAddress) {
    document.getElementById("summary-address").textContent =
      `${activeAddress.door}, ${activeAddress.street}, ${activeAddress.city}, ` +
      `${activeAddress.district}, ${activeAddress.state} - ${activeAddress.pincode}`;
    MyFramework.log("Active address loaded", activeAddress);
  } else {
    document.getElementById("summary-address").textContent = "No address selected.";
    MyFramework.log("No active address found");
  }

  /* ==========================
     Load Cart
  ========================== */
  const cart = JSON.parse(localStorage.getItem("cart")) || {};
  const selectedProducts = JSON.parse(localStorage.getItem("selectedProducts")) || [];
  const summaryCartItems = document.getElementById("summary-cart-items");

  let subtotal = 0;
  const platformFee = 10;
  const deliveryCharge = 100;
  let discount = 0;
  let couponCode = "";

  // ✅ Get applied coupon if any
  const appliedCoupon = JSON.parse(localStorage.getItem("appliedCoupon"));
  if (appliedCoupon) {
    discount = appliedCoupon.discount || 0;
    couponCode = appliedCoupon.code || "";
    MyFramework.log("Applied coupon restored in summary", appliedCoupon);
  }

  Object.keys(cart).forEach((id, index) => {
    const product = selectedProducts.find(p => p.id === id);
    if (product) {
      const lineTotal = product.price * cart[id];
      subtotal += lineTotal;

      const itemDiv = document.createElement("div");
      itemDiv.classList.add("summary-item");
      itemDiv.innerHTML = `
        <p>${index + 1}. ${product.name} (x${cart[id]})</p>
        <p>₹${lineTotal.toFixed(2)}</p>
      `;
      summaryCartItems.appendChild(itemDiv);
    }
  });
  MyFramework.log("Cart loaded", { cart, subtotal });

  // Totals
  document.getElementById("summary-subtotal").textContent = `₹${subtotal.toFixed(2)}`;
  document.getElementById("summary-platform").textContent = `₹${platformFee.toFixed(2)}`;
  document.getElementById("summary-delivery").textContent = `₹${deliveryCharge.toFixed(2)}`;
  document.getElementById("summary-total").textContent =
    `₹${(subtotal + platformFee + deliveryCharge - discount).toFixed(2)}`;

  if (discount > 0) {
    document.getElementById("summary-discount").textContent =
      `-₹${discount.toFixed(2)} (${couponCode})`;
    document.getElementById("summary-discount-line").style.display = "block";
  }

  /* ==========================
     References
  ========================== */
  const summaryContainer = document.getElementById("summary-container");
  const orderConfirmation = document.getElementById("order-confirmation");

  const qrBtn = document.getElementById("qr-btn");
  const termsBtn = document.getElementById("terms-btn");
  const backHomeBtn = document.getElementById("back-home-btn");

  /* ==========================
     QR Modal
  ========================== */
  qrBtn?.addEventListener("click", () => {
    const modal = document.querySelector(".qr-modal");
    if (modal) {
      modal.style.display = "flex";
      MyFramework.log("QR modal opened");
    }
  });

  /* ==========================
     Terms Modal
  ========================== */
  termsBtn?.addEventListener("click", () => {
    const modal = document.querySelector(".terms-modal");
    if (modal) {
      modal.style.display = "flex";
      MyFramework.log("Terms modal opened");
    }
  });

  /* ==========================
     Swipe to Confirm
  ========================== */
  const swipeContainer = document.getElementById("swipe-container");
  const swipeTrack = document.getElementById("swipe-track");
  const swipeThumb = document.getElementById("swipe-thumb");
  const swipeText = document.getElementById("swipe-text");
  const swipeIcon = document.getElementById("swipe-icon");

  const trackWidth = swipeContainer.offsetWidth;
  const thumbWidth = swipeThumb.offsetWidth;

  let isDragging = false;
  let startX = 0;

  function startDrag(x) {
    if (swipeTrack.classList.contains("success")) return;
    isDragging = true;
    startX = x;
  }

  function moveDrag(x) {
    if (!isDragging) return;
    let moveX = x - startX;
    let newLeft = Math.min(Math.max(0, moveX), trackWidth - thumbWidth);
    swipeThumb.style.left = newLeft + "px";

    let progress = newLeft / (trackWidth - thumbWidth);
    swipeText.style.opacity = 1 - progress * 1.2;
  }

  function endDrag() {
    if (!isDragging) return;
    isDragging = false;

    if (parseInt(swipeThumb.style.left) >= trackWidth - thumbWidth - 10) {
      swipeThumb.style.left = (trackWidth - thumbWidth) + "px";
      swipeTrack.classList.add("success");
      swipeText.textContent = "Thanks for ordering!";
      swipeText.style.opacity = 1;
      swipeIcon.src = "icons/tick.gif";
      MyFramework.log("Order confirmed by swipe!");

      // ✅ Save order
      const orderId = "JCR" + Math.floor(100000 + Math.random() * 900000);
      const orderDetails = {
        id: orderId,
        name: document.getElementById("summary-name").textContent,
        mobile: document.getElementById("summary-mobile").textContent,
        email: document.getElementById("summary-email").textContent,
        address: document.getElementById("summary-address").textContent,
        subtotal: document.getElementById("summary-subtotal").textContent,
        platform: document.getElementById("summary-platform").textContent,
        delivery: document.getElementById("summary-delivery").textContent,
        discount: discount > 0 ? `-₹${discount.toFixed(2)} (${couponCode})` : "₹0.00",
        total: document.getElementById("summary-total").textContent,
        items: document.getElementById("summary-cart-items").innerHTML,
        date: new Date().toISOString(),
      };

      let orders = JSON.parse(localStorage.getItem("orders")) || [];
      orders.push(orderDetails);
      localStorage.setItem("orders", JSON.stringify(orders));
      MyFramework.log("Order saved", orderDetails);

      // ✅ Clear localStorage (commented for testing)
      // localStorage.removeItem("cart");
      // localStorage.removeItem("selectedProducts");
      // localStorage.removeItem("appliedCoupon");

      // Show confirmation + confetti
      summaryContainer.classList.add("hidden");
      orderConfirmation.classList.remove("hidden");
      document.getElementById("order-id").textContent = orderId;
      burstConfetti();
      MyFramework.log("Order confirmation displayed with confetti");
    } else {
      swipeThumb.style.left = "0px";
      swipeText.style.opacity = 1;
      swipeIcon.src = "icons/swipe.gif";
    }
  }

  swipeThumb.addEventListener("mousedown", (e) => startDrag(e.clientX));
  document.addEventListener("mousemove", (e) => moveDrag(e.clientX));
  document.addEventListener("mouseup", endDrag);

  swipeThumb.addEventListener("touchstart", (e) => startDrag(e.touches[0].clientX));
  document.addEventListener("touchmove", (e) => moveDrag(e.touches[0].clientX));
  document.addEventListener("touchend", endDrag);

  /* ==========================
     Confetti Effect
  ========================== */
  const canvas = document.getElementById("confettiCanvas");
  const ctx = canvas.getContext("2d");
  let W, H;

  function resize() {
    W = window.innerWidth;
    H = window.innerHeight;
    canvas.width = W;
    canvas.height = H;
  }
  resize();
  window.addEventListener("resize", resize);

  const shapes = ["rect", "circle", "triangle", "star"];

  function starPoints(cx, cy, spikes, outerRadius, innerRadius) {
    let step = Math.PI / spikes;
    let path = [];
    let angle = Math.PI / 2 * 3;
    let x, y;
    for (let i = 0; i < spikes; i++) {
      x = cx + Math.cos(angle) * outerRadius;
      y = cy + Math.sin(angle) * outerRadius;
      path.push([x, y]);
      angle += step;

      x = cx + Math.cos(angle) * innerRadius;
      y = cy + Math.sin(angle) * innerRadius;
      path.push([x, y]);
      angle += step;
    }
    return path;
  }

  class ConfettiParticle {
    constructor() {
      this.x = Math.random() * W;
      this.y = H + 20;
      this.size = 7 + Math.random() * 8;
      this.shape = shapes[Math.floor(Math.random() * shapes.length)];
      this.color = `hsl(${Math.random() * 360}, 100%, 60%)`;
      this.speedX = (Math.random() - 0.5) * 5;
      this.speedY = -(5 + Math.random() * 8);
      this.gravity = 0.15;
      this.rotation = Math.random() * 360;
      this.rotationSpeed = (Math.random() - 0.5) * 10;
      this.opacity = 1;
      this.opacitySpeed = 0.02 + Math.random() * 0.01;
    }

    draw() {
      ctx.save();
      ctx.translate(this.x, this.y);
      ctx.rotate((this.rotation * Math.PI) / 180);
      ctx.globalAlpha = this.opacity;
      ctx.fillStyle = this.color;
      ctx.strokeStyle = this.color;

      switch (this.shape) {
        case "rect":
          ctx.fillRect(-this.size / 2, -this.size / 2, this.size, this.size);
          break;
        case "circle":
          ctx.beginPath();
          ctx.arc(0, 0, this.size / 2, 0, 2 * Math.PI);
          ctx.fill();
          break;
        case "triangle":
          ctx.beginPath();
          ctx.moveTo(0, -this.size / 2);
          ctx.lineTo(this.size / 2, this.size / 2);
          ctx.lineTo(-this.size / 2, this.size / 2);
          ctx.closePath();
          ctx.fill();
          break;
        case "star":
          ctx.beginPath();
          const points = starPoints(0, 0, 5, this.size / 2, this.size / 4);
          ctx.moveTo(points[0][0], points[0][1]);
          for (let i = 1; i < points.length; i++) {
            ctx.lineTo(points[i][0], points[i][1]);
          }
          ctx.closePath();
          ctx.fill();
          ctx.stroke();
          break;
      }
      ctx.restore();
    }

    update() {
      this.x += this.speedX;
      this.y += this.speedY;
      this.speedY += this.gravity;
      this.rotation += this.rotationSpeed;
      this.opacity -= this.opacitySpeed;

      if (this.opacity <= 0 || this.y > H + 20) {
        this.x = Math.random() * W;
        this.y = H + 20;
        this.speedY = -(5 + Math.random() * 8);
        this.speedX = (Math.random() - 0.5) * 5;
        this.opacity = 1;
        this.rotation = Math.random() * 360;
        this.rotationSpeed = (Math.random() - 0.5) * 10;
        this.color = `hsl(${Math.random() * 360}, 100%, 60%)`;
      }
    }
  }

  let confettiParticles = [];
  let running = false;

  function initParticles(count = 150) {
    confettiParticles = [];
    for (let i = 0; i < count; i++) {
      confettiParticles.push(new ConfettiParticle());
    }
  }

  function animate() {
    ctx.clearRect(0, 0, W, H);
    confettiParticles.forEach((p) => {
      p.update();
      p.draw();
    });
    if (running) requestAnimationFrame(animate);
  }

  function burstConfetti() {
    if (running) return;
    running = true;
    initParticles(150);
    animate();

    setTimeout(() => {
      running = false;
      ctx.clearRect(0, 0, W, H);
    }, 5000);
  }

  /* ==========================
     Back to Home
  ========================== */
  backHomeBtn?.addEventListener("click", () => {
    MyFramework.log("Navigating back to home");
    window.location.href = "home.html";
  });
});