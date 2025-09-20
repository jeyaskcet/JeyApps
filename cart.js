protectPage("cart", ["home"], true);

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

  // ✅ Free delivery constant
  const FREE_DELIVERY_LIMIT = 2000;

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

  // ✅ Update summary block
  function updateSummary(subtotal, platformFee, deliveryFee, discount) {
    subtotalElem.textContent = `₹${subtotal.toFixed(2)}`;

    if (subtotal >= FREE_DELIVERY_LIMIT) {
  // Show icons near labels, strike out amounts on right
  platformFeeElem.parentElement.querySelector("span:first-child").innerHTML = 
    `Platform Fee: <img src="icons/free-platformfee.png" alt="FREE" class="free-icon" />`;
  platformFeeElem.innerHTML = `<s style="color:#22c55e">₹10.00</s>`;

  deliveryChargeElem.parentElement.querySelector("span:first-child").innerHTML = 
    `Delivery Charge: <img src="icons/free-delivery.png" alt="FREE" class="free-icon" />`;
  deliveryChargeElem.innerHTML = `<s style="color:#22c55e">₹100.00</s>`;
} else {
  // Reset to normal labels and values
  platformFeeElem.parentElement.querySelector("span:first-child").textContent = "Platform Fee:";
  deliveryChargeElem.parentElement.querySelector("span:first-child").textContent = "Delivery Charge:";

  platformFeeElem.textContent = `₹${platformFee.toFixed(2)}`;
  deliveryChargeElem.textContent = `₹${deliveryFee.toFixed(2)}`;
}

totalElem.textContent = `₹${(subtotal + platformFee + deliveryFee - discount).toFixed(2)}`;

    // Discount line
    if (discount > 0 && couponApplied) {
  discountLine.style.display = 'flex';
  discountLine.innerHTML = `
    <span>
      Discount (${couponApplied}):
      <button id="remove-coupon-btn" class="remove-coupon-btn">
        <img src="icons/delete.png" alt="DeleteCoupon" class="delete-coupon" />
      </button>
    </span>
    <span>-₹${discount.toFixed(2)}</span>
  `;


      document.getElementById("remove-coupon-btn").addEventListener("click", () => {
        showCustomAlert(
          "Are you sure?",
          "Do you really want to delete your applied coupon?",
          "Confirm",
          () => {
            MyFramework.log("Coupon removed");
            discount = 0;
            couponApplied = "";
            localStorage.removeItem("appliedCoupon");
            updateCouponButton();
            renderCart();
          }
        );
      });
    } else {
      discountLine.style.display = 'none';
    }
  }

  function renderCart() {
  MyFramework.log("Rendering cart...");
  cartItemsContainer.innerHTML = '';

  const cart = JSON.parse(localStorage.getItem('cart') || '{}');
  const selectedProducts = JSON.parse(localStorage.getItem('selectedProducts') || '[]');

  // ✅ Check if cart is empty
  if (Object.keys(cart).length === 0 || selectedProducts.length === 0) {
    // Hide totals
    subtotalElem.textContent = '₹0.00';
    platformFeeElem.textContent = '₹0.00';
    deliveryChargeElem.textContent = '₹0.00';
    totalElem.textContent = '₹0.00';
    discountLine.style.display = 'none';

    // Show empty cart image
    const emptyCartElem = document.getElementById("empty-cart");
    if (emptyCartElem) emptyCartElem.classList.remove("hidden");

    // Hide summary section if exists
    if (summarySection) summarySection.style.display = 'none';

    MyFramework.log("Cart is empty. Empty cart image displayed.");
    return; // Stop further processing
  }

  // ✅ Cart has items, hide empty image
  const emptyCartElem = document.getElementById("empty-cart");
  if (emptyCartElem) emptyCartElem.classList.add("hidden");

  // Continue with normal cart rendering
  let subtotal = 0;
  let platformFee = 10;
  let deliveryFee = 100;

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

   // ✅ Free delivery & fee + banner
const banner = document.getElementById("free-delivery-banner");
if (subtotal >= FREE_DELIVERY_LIMIT) {
  platformFee = 0;
  deliveryFee = 0;
  if (banner) banner.classList.remove("hidden");
} else {
  if (banner) banner.classList.add("hidden");
}

    // ✅ Coupon recalculation
    discount = 0;
    if (couponApplied) {
      fetch('offers.json')
        .then(res => res.json())
        .then(offers => {
          const offer = offers.find(o => o.code.toUpperCase() === couponApplied);
          if (offer && subtotal >= offer.minPurchase) {
            let calcDiscount = (offer.discountPercent / 100) * subtotal;
            discount = offer.maxDiscount !== undefined
              ? Math.min(calcDiscount, offer.maxDiscount)
              : calcDiscount;
          } else {
            MyFramework.log("Coupon auto removed (subtotal too low or invalid)");
            couponApplied = "";
            localStorage.removeItem("appliedCoupon");
          }
          updateSummary(subtotal, platformFee, deliveryFee, discount);
        })
        .catch(() => {
          MyFramework.log("ERROR fetching offers.json");
          updateSummary(subtotal, platformFee, deliveryFee, 0);
        });
    } else {
      updateSummary(subtotal, platformFee, deliveryFee, 0);
    }

    updateCouponButton();
    attachQuantityListeners();
  }

  // Attach increase/decrease buttons
  function attachQuantityListeners() {
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

  if (applyCouponBtn) {  
  applyCouponBtn.addEventListener('click', () => {
    const cart = JSON.parse(localStorage.getItem('cart') || '{}');
    const selectedProducts = JSON.parse(localStorage.getItem('selectedProducts') || '[]');

    if (Object.keys(cart).length === 0 || selectedProducts.length === 0) {
      showCustomAlert(
        "Cart is empty",
        "You cannot apply a coupon because your cart is empty. Please add products first.",
        "OK"
      );
      return; // stop execution
    }

    // Cart has items, open coupon modal
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
    // 1️⃣ Validate Cart
    const cartObj = JSON.parse(localStorage.getItem('cart') || '{}');
    const selectedProducts = JSON.parse(localStorage.getItem('selectedProducts') || '[]');
    if (Object.keys(cartObj).length === 0 || selectedProducts.length === 0) {
      showCustomAlert("Cart is empty. Please add products before proceeding.");
      return;
    }

    // 2️⃣ Validate Profile
    const profile = JSON.parse(localStorage.getItem('profile') || '{}');
    if (!profile.name || !profile.name.trim()) {
      showCustomAlert("Please enter your Name in Profile before proceeding.");
      return;
    }

    if (!profile.mobile || !/^\d{10}$/.test(profile.mobile)) {
      showCustomAlert("Please enter a valid 10-digit Mobile Number in Profile.");
      return;
    }

    // 3️⃣ Validate Delivery Address
    const addresses = JSON.parse(localStorage.getItem('addresses') || '[]');
    const activeIndex = parseInt(localStorage.getItem('activeAddress')) || 0;
    const activeAddress = addresses[activeIndex];

    if (!activeAddress) {
      showCustomAlert("No delivery address selected. Please add and select a delivery address.");
      return;
    }

    const requiredFields = ['door', 'street', 'city', 'district', 'state', 'pincode'];
    for (let field of requiredFields) {
      if (!activeAddress[field] || !activeAddress[field].trim()) {
        showCustomAlert(`Please fill in the ${field.charAt(0).toUpperCase() + field.slice(1)} in your delivery address.`);
        return;
      }
    }

    if (!/^\d{6}$/.test(activeAddress.pincode)) {
      showCustomAlert("Pincode must be exactly 6 digits.");
      return;
    }
    // ✅ All validations passed, save checkout summary
    const summaryData = {
      coupon: `${couponApplied}`,
      subtotal: subtotalElem.innerHTML,
      platform: platformFeeElem.innerHTML,
      delivery: deliveryChargeElem.innerHTML,
      discount: discount > 0 ? `-₹${discount.toFixed(2)}` : "₹0.00",
      total: totalElem.innerHTML
    };
    localStorage.setItem("checkoutSummary", JSON.stringify(summaryData));

// Navigate to summary page
showLoading();
    setTimeout(() => window.location.href = "summary.html", 2000);
    
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