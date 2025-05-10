document.addEventListener('DOMContentLoaded', () => {
  const cartItemsContainer = document.getElementById('cart-items-container');
  const subtotalElem = document.getElementById('subtotal');
  const platformFeeElem = document.getElementById('platform-fee');
  const deliveryChargeElem = document.getElementById('delivery-charge');
  const totalElem = document.getElementById('total');
  const discountLine = document.getElementById('discount-line');
  const goToHomepageBtn = document.getElementById('go-to-homepage-btn');
  
  // Get the cart from localStorage (or an empty object if no cart exists)
  let cart = JSON.parse(localStorage.getItem('cart')) || {};

  // Define elements for coupon functionality
  const applyCouponBtn = document.getElementById('apply-coupon-btn');
  const couponModal = document.getElementById('coupon-modal');
  const submitCouponBtn = document.getElementById('submit-coupon-btn');
  const discountAmountElem = document.getElementById('discount-amount');
  const modalContent = document.getElementById('coupon-modal-content');

  // Coupon variables
  let discount = 0;
  let couponApplied = "";

  // If the cart is empty, show an empty cart message with a "Go to Homepage" button
  if (Object.keys(cart).length === 0) {
    cartItemsContainer.innerHTML = '';
    
    // Create the empty cart message
    const emptyCartMessage = document.createElement('div');
    emptyCartMessage.classList.add('empty-cart-message');
    
    emptyCartMessage.innerHTML = `
      <img src="path/to/your/empty-cart-image.png" alt="Empty Cart" class="empty-cart-image">
      <p>Your cart is currently empty. Please add some products from the homepage!</p>
      <button id="go-to-homepage-btn" class="go-to-homepage-btn">Go to Homepage</button>
    `;
    
    cartItemsContainer.appendChild(emptyCartMessage);
    
    // Add click event to redirect user to the homepage
    goToHomepageBtn.addEventListener('click', () => {
      window.location.href = '/';  // This will redirect to the homepage
    });

    // Hide subtotal, fees, and total since there's no cart
    subtotalElem.textContent = '$0.00';
    platformFeeElem.textContent = '$0.00';
    deliveryChargeElem.textContent = '$0.00';
    totalElem.textContent = '$0.00';
    discountLine.style.display = 'none';
    return;
  }

  // Function to render the cart items
  function renderCart() {
    cartItemsContainer.innerHTML = ''; // Clear previous items
    let subtotal = 0;

    Object.keys(cart).forEach(productId => {
      const product = products.find(p => p.id === productId);
      const quantity = cart[productId];
      
      if (product) {
        const item = document.createElement('div');
        item.classList.add('cart-item');
        item.innerHTML = `
          <div class="cart-item-details">
            <img src="${product.images[0]}" alt="${product.name}" class="cart-item-image">
            <span class="cart-item-name">${product.name}</span>
          </div>
          <span class="cart-item-quantity">x${quantity}</span>
          <span class="cart-item-price">$${(product.price * quantity).toFixed(2)}</span>
        `;
        cartItemsContainer.appendChild(item);

        subtotal += product.price * quantity; // Add to subtotal
      }
    });

    // Update total values
    subtotalElem.textContent = `$${subtotal.toFixed(2)}`;
    platformFeeElem.textContent = '$5.00'; // Example fixed platform fee, can be dynamic
    deliveryChargeElem.textContent = '$2.50'; // Example delivery charge, can be dynamic
    totalElem.textContent = `$${(subtotal + 5 + 2.5).toFixed(2)}`; // Subtotal + platform fee + delivery charge

    // Show discount line (you can make this dynamic based on some condition)
    discountLine.style.display = 'block';
  }

  // Call renderCart if there are items in the cart
  renderCart();

  // Handle coupon modal
  if (applyCouponBtn) {
    applyCouponBtn.addEventListener('click', () => {
      couponModal.style.display = 'flex'; // Show the coupon modal
    });

    // Close modal when clicking outside content
    if (couponModal) {
      couponModal.addEventListener('click', (e) => {
        if (e.target === couponModal) {
          couponModal.style.display = 'none';
        }
      });
    }

    // Handle coupon submission
    if (submitCouponBtn) {
      submitCouponBtn.addEventListener('click', () => {
        const code = document.getElementById('coupon-code').value.trim().toUpperCase();
        discount = 0;
        couponApplied = "";

        if (code === 'FREEDELIVERY') {
          discount = 2.50; // Assuming delivery charge is $2.50
          couponApplied = "Delivery charge waived";
        } else if (code === 'FREEPLATFORM') {
          discount = 5.00; // Assuming platform fee is $5.00
          couponApplied = "Platform fee waived";
        } else {
          alert("Invalid coupon");
          return;
        }

        discountAmountElem.textContent = `-$${discount.toFixed(2)}`;
        renderCart();

        // Visual feedback
        if (modalContent) {
          modalContent.classList.add('success');
          setTimeout(() => {
            couponModal.style.display = 'none';
            modalContent.classList.remove('success');
          }, 1200);
        }

        alert(couponApplied);
      });
    }
  }
});
