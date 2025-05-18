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
  const goToHomepageBtn = document.getElementById('go-to-homepage-btn');
  const applyCouponBtn = document.getElementById('footer-applycoupon-btn');
  const couponModal = document.getElementById('coupon-modal');
  const submitCouponBtn = document.getElementById('submit-coupon-btn');
  const modalContent = document.getElementById('coupon-modal-content');
  const summarySection = document.getElementById('summary-section');
  const dynamicGoToHomepageBtn = document.getElementById('go-to-homepage-btn');
  const previousBtn = document.getElementById('footer-previous-btn'); 
  const nextBtn = document.getElementById('footer-next-btn');

  let cart = JSON.parse(localStorage.getItem('cart')) || {};
  MyFramework.log("Cart loaded from localStorage:", cart);

  function calculateCartTotal() {
    MyFramework.log("Calculating cart total...");
    let total = 0;
    const cart = JSON.parse(localStorage.getItem('cart') || '{}');
    const selectedProducts = JSON.parse(localStorage.getItem('selectedProducts') || '[]');

    Object.keys(cart).forEach(productId => {
      const product = selectedProducts.find(p => p.id === productId);
      if (product) {
        total += product.price * cart[productId];
      }
    });

    MyFramework.log("Cart total calculated:", total);
    return total;
  }

  let discount = 0;
  let couponApplied = "";

  if (Object.keys(cart).length === 0) {
    MyFramework.log("Cart is empty. Showing empty cart message.");
    cartItemsContainer.innerHTML = '';

    const emptyCartMessage = document.createElement('div');
    emptyCartMessage.classList.add('empty-cart-message');

    emptyCartMessage.innerHTML = ``;
      document.getElementById("empty-cart").classList.remove("hidden");

    cartItemsContainer.appendChild(emptyCartMessage);

    subtotalElem.textContent = '₹0.00';
    platformFeeElem.textContent = '₹0.00';
    deliveryChargeElem.textContent = '₹0.00';
    totalElem.textContent = '₹0.00';
    discountLine.style.display = 'none';
    
    if (summarySection) { 
summarySection.style.display = 'none';
} else {
  if (summarySection) summarySection.style.display = 'block';
}

    return;
    
    if (dynamicGoToHomepageBtn) {
      dynamicGoToHomepageBtn.addEventListener('click', () => {
        MyFramework.log("User clicked Go to Homepage from empty cart state");
        window.location.href = 'home.html';
      });
    }
  }

if (previousBtn) {
    previousBtn.addEventListener('click', () => {
      window.location.href = 'home.html';
    });
  }
  
  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      window.location.href = 'next.html';
    });
  }


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
    discountAmountElem.textContent = `-₹${discount.toFixed(2)}`;
    discountLine.style.display = discount > 0 ? 'block' : 'none';

    MyFramework.log("Cart UI updated with new values");

    document.querySelectorAll('.increase-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const id = e.target.dataset.id;
        cart[id] = (cart[id] || 0) + 1;
        localStorage.setItem('cart', JSON.stringify(cart));
        MyFramework.log(`Increased quantity for product ID: ${id}`);
        renderCart();
      });
    });

    document.querySelectorAll('.decrease-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const id = e.target.dataset.id;
        if (cart[id] > 1) {
          cart[id] -= 1;
          MyFramework.log(`Decreased quantity for product ID: ${id}`);
        } else {
          delete cart[id];
          const updatedProducts = selectedProducts.filter(p => p.id !== id);
          localStorage.setItem('SelectedProducts', JSON.stringify(updatedProducts));
          MyFramework.log(`Removed product ID: ${id} from cart and SelectedProducts`);
        }
        localStorage.setItem('cart', JSON.stringify(cart));
        renderCart();
      });
    });
  }

  renderCart();

  if (applyCouponBtn) {  
    applyCouponBtn.addEventListener('click', () => {
      couponModal.style.display = 'flex';
      MyFramework.log("Coupon modal opened");
    });

    if (couponModal) {
      couponModal.addEventListener('click', (e) => {
        if (e.target === couponModal) {
          couponModal.style.display = 'none';
          MyFramework.log("Coupon modal closed by clicking outside");
        }
      });
     }

    const closeCouponBtn = document.getElementById('close-coupon-btn');
    if (closeCouponBtn) {
      closeCouponBtn.addEventListener('click', () => {
        couponModal.style.display = 'none';
        MyFramework.log("Coupon modal closed via close button");
      });
    }

    submitCouponBtn.addEventListener('click', () => {
      const code = document.getElementById('coupon-code').value.trim().toUpperCase();
      const cartTotal = parseFloat(calculateCartTotal());
      const successMessageElem = document.getElementById('coupon-success');

      MyFramework.log(`Submitting coupon code: ${code}`);

      discount = 0;
      couponApplied = "";
      successMessageElem.classList.add('hidden');
      successMessageElem.textContent = "";

      fetch('offers.json')
        .then(res => res.json())
        .then(offers => {
          const offer = offers.find(o => o.code.toUpperCase() === code);
          if (!offer) {
            MyFramework.log("Invalid coupon code submitted");
            showCustomAlert("Invalid coupon code.");
            return;
          }

          if (cartTotal < offer.minPurchase) {
            MyFramework.log(`Coupon code requires minimum ₹${offer.minPurchase}, but only ₹${cartTotal} in cart`);
            showCustomAlert(`Minimum purchase of ₹${offer.minPurchase} required.`);
            return;
          }

          let calculatedDiscount = (offer.discountPercent / 100) * cartTotal;
          discount = offer.maxDiscount !== undefined
            ? Math.min(calculatedDiscount, offer.maxDiscount)
            : calculatedDiscount;

          MyFramework.log(`Coupon applied successfully. Discount: ₹${discount.toFixed(2)}`);
          discountAmountElem.textContent = `-₹${discount.toFixed(2)}`;
          couponApplied = offer.description;
          renderCart();

          successMessageElem.textContent = `You saved ₹${discount.toFixed(2)}!`;
          successMessageElem.classList.remove('hidden');

          setTimeout(() => {
            couponModal.style.display = 'none';
            successMessageElem.classList.add('hidden');
          }, 1500);
        })
        .catch(error => {
          MyFramework.log("Error fetching coupon offers:", error);
          showCustomAlert("Failed to validate coupon. Please try again.");
        });
    });
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

  if (deleteCartBtn) {
    deleteCartBtn.addEventListener('click', () => {
      MyFramework.log("User clicked Delete Cart button");

      showCustomAlert(
        "Are you sure?",
        "Do you really want to delete your cart?",
        "Confirm",
        () => {
          MyFramework.log("User confirmed cart deletion");

          localStorage.removeItem('cart');
          localStorage.removeItem('selectedProducts');
          MyFramework.log("Cart and selectedProducts removed from localStorage");

cartItemsContainer.innerHTML = ``;

document.getElementById("empty-cart").classList.remove("hidden");

          subtotalElem.textContent = '₹0.00';
          platformFeeElem.textContent = '₹0.00';
          deliveryChargeElem.textContent = '₹0.00';
          totalElem.textContent = '$0.00';
          discountAmountElem.textContent = '-₹0.00';
          discountLine.style.display = 'none';
          if (summarySection) { 
summarySection.style.display = 'none';
} else {
  if (summarySection) summarySection.style.display = 'block';
}

          MyFramework.log("UI reset to empty cart state");

          
        },
        true,
        () => {
          MyFramework.log("User cancelled cart deletion");
        }
      );
    });
  }
});

