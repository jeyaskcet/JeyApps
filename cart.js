document.addEventListener('DOMContentLoaded', () => {
  MyFramework.log("DOM fully loaded and parsed");

  const cartItemsContainer = document.getElementById('cart-items');
  const deleteCartBtn = document.getElementById('delete-cart-btn');
  const subtotalElem = document.getElementById('subtotal');
  const platformFeeElem = document.getElementById('platform-fee');
  const deliveryChargeElem = document.getElementById('delivery-charge');
  const totalElem = document.getElementById('total');
  const discountLine = document.getElementById('discount-line');
  const discountAmountElem = document.getElementById('discount-amount');
  const applyCouponBtn = document.getElementById('footer-applycoupon-btn');
  const couponModal = document.getElementById('coupon-modal');
  const submitCouponBtn = document.getElementById('submit-coupon-btn');
  const summarySection = document.getElementById('summary-section');
  const previousBtn = document.getElementById('footer-previous-btn'); 
  const nextBtn = document.getElementById('footer-next-btn');

  let cart = JSON.parse(localStorage.getItem('cart')) || {};
  MyFramework.log("Cart loaded from localStorage:", cart);

  // Coupon state
  let discount = 0;
  let couponApplied = "";

  // Restore saved coupon if exists
  const savedCoupon = JSON.parse(localStorage.getItem('appliedCoupon'));
  if (savedCoupon) {
    discount = savedCoupon.discount;
    couponApplied = savedCoupon.code;
    MyFramework.log("Restored saved coupon:", savedCoupon);
  }

  function calculateCartTotal() {
    let total = 0;
    const cart = JSON.parse(localStorage.getItem('cart') || '{}');
    const selectedProducts = JSON.parse(localStorage.getItem('selectedProducts') || '[]');

    Object.keys(cart).forEach(productId => {
      const product = selectedProducts.find(p => p.id === productId);
      if (product) {
        total += product.price * cart[productId];
      }
    });

    return total;
  }

  // Helper: update Apply Coupon button UI
  function updateCouponButton() {
    const img = applyCouponBtn.querySelector("img");
    const span = applyCouponBtn.querySelector("span");

    if (couponApplied) {
      span.textContent = "Change Coupon";
      img.src = "icons/couponapplied.png"; // ✅ green tick icon
    } else {
      span.textContent = "Apply Coupon";
      img.src = "icons/applycoupon.png";
    }
  }

  // Render Cart
  function renderCart() {
    MyFramework.log("Rendering cart...");
    cartItemsContainer.innerHTML = '';
    let subtotal = 0;
    let platformFee = 10;
    let deliveryFee = 100;

    const selectedProducts = JSON.parse(localStorage.getItem('selectedProducts')) || [];
    const productIds = Object.keys(cart);

    productIds.forEach((productId, index) => {
      const product = selectedProducts.find(p => p.id === productId);
      const quantity = cart[productId];

      if (product) {
        const item = document.createElement('div');
        item.classList.add('cart-item');
        item.innerHTML = `
          <div class="cart-item-top">
            <div class="cart-serial">${index + 1}.</div>
            <div class="cart-item-name">${product.name}</div>
          </div>
          <div class="cart-item-bottom">
            <div class="cart-quantity-price">
              <div class="cart-quantity-controls">
                <button class="decrease-btn" data-id="${product.id}">-</button>
                <span class="cart-item-quantity">${quantity}</span>
                <button class="increase-btn" data-id="${product.id}">+</button>
              </div>
              <div class="cart-item-price">₹${(product.price * quantity).toFixed(2)}</div>
            </div>
          </div>
        `;
        cartItemsContainer.appendChild(item);
        subtotal += product.price * quantity;
      }
    });

    subtotalElem.textContent = `₹${subtotal.toFixed(2)}`;
    platformFeeElem.textContent = `₹${platformFee.toFixed(2)}`;
    deliveryChargeElem.textContent = `₹${deliveryFee.toFixed(2)}`;
    totalElem.textContent = `₹${(subtotal + platformFee + deliveryFee - discount).toFixed(2)}`;

    if (discount > 0 && couponApplied) {
      discountLine.style.display = 'flex';
      discountLine.innerHTML = `
        <span>Discount (${couponApplied}):</span>
        <span>
          -₹${discount.toFixed(2)} 
          <button id="remove-coupon-btn" class="remove-coupon-btn">❌</button>
        </span>
      `;

      // Delete coupon logic
      document.getElementById("remove-coupon-btn").addEventListener("click", () => {
        MyFramework.log("Coupon removed");
        discount = 0;
        couponApplied = "";
        localStorage.removeItem("appliedCoupon");
        updateCouponButton();
        renderCart();
      });
    } else {
      discountLine.style.display = 'none';
    }

    updateCouponButton();

    // Quantity buttons
    document.querySelectorAll('.increase-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const id = e.target.dataset.id;
        cart[id] = (cart[id] || 0) + 1;
        localStorage.setItem('cart', JSON.stringify(cart));
        renderCart();
      });
    });

    document.querySelectorAll('.decrease-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const id = e.target.dataset.id;
        if (cart[id] > 1) {
          cart[id] -= 1;
        } else {
          delete cart[id];
          const selectedProducts = JSON.parse(localStorage.getItem('selectedProducts')) || [];
          const updatedProducts = selectedProducts.filter(p => p.id !== id);
          localStorage.setItem('selectedProducts', JSON.stringify(updatedProducts));
        }
        localStorage.setItem('cart', JSON.stringify(cart));
        renderCart();
      });
    });
  }

  renderCart();

  // Coupon modal handling
  if (applyCouponBtn) {  
    applyCouponBtn.addEventListener('click', () => {
      couponModal.style.display = 'flex';
    });

    const closeCouponBtn = document.getElementById('close-coupon-btn');
    if (closeCouponBtn) {
      closeCouponBtn.addEventListener('click', () => {
        couponModal.style.display = 'none';
      });
    }

    submitCouponBtn.addEventListener('click', () => {
      const code = document.getElementById('coupon-code').value.trim().toUpperCase();
      const cartTotal = parseFloat(calculateCartTotal());
      const successMessageElem = document.getElementById('coupon-success');

      discount = 0;
      couponApplied = "";
      successMessageElem.classList.add('hidden');
      successMessageElem.textContent = "";

      fetch('offers.json')
        .then(res => res.json())
        .then(offers => {
          const offer = offers.find(o => o.code.toUpperCase() === code);
          if (!offer) {
            showCustomAlert("Invalid coupon code.");
            return;
          }

          if (cartTotal < offer.minPurchase) {
            showCustomAlert(`Minimum purchase of ₹${offer.minPurchase} required.`);
            return;
          }

          let calculatedDiscount = (offer.discountPercent / 100) * cartTotal;
          discount = offer.maxDiscount !== undefined
            ? Math.min(calculatedDiscount, offer.maxDiscount)
            : calculatedDiscount;

          couponApplied = offer.code.toUpperCase();
          localStorage.setItem("appliedCoupon", JSON.stringify({ code: couponApplied, discount }));

          successMessageElem.textContent = `You saved ₹${discount.toFixed(2)}!`;
          successMessageElem.classList.remove('hidden');

          renderCart();

          setTimeout(() => {
            couponModal.style.display = 'none';
            successMessageElem.classList.add('hidden');
          }, 1500);
        })
        .catch(() => {
          showCustomAlert("Failed to validate coupon. Please try again.");
        });
    });
  }

  // Navigation buttons
  if (previousBtn) {
    previousBtn.addEventListener('click', () => {
      window.location.href = 'home.html';
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      window.location.href = 'summary.html';
    });
  }

  // Delete cart
  if (deleteCartBtn) {
    deleteCartBtn.addEventListener('click', () => {
      showCustomAlert(
        "Are you sure?",
        "Do you really want to delete your cart?",
        "Confirm",
        () => {
          localStorage.removeItem('cart');
          localStorage.removeItem('selectedProducts');
          localStorage.removeItem('appliedCoupon');

          cartItemsContainer.innerHTML = ``;
          document.getElementById("empty-cart").classList.remove("hidden");

          subtotalElem.textContent = '₹0.00';
          platformFeeElem.textContent = '₹0.00';
          deliveryChargeElem.textContent = '₹0.00';
          totalElem.textContent = '₹0.00';
          discountAmountElem.textContent = '-₹0.00';
          discountLine.style.display = 'none';

          if (summarySection) summarySection.style.display = 'none';

          MyFramework.log("Cart cleared and UI reset");
        },
        true
      );
    });
  }
});