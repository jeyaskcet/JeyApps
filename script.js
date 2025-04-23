document.addEventListener('DOMContentLoaded', () => {
  const productsList = document.getElementById('products-list');
  const cartBtn = document.getElementById('cart-btn');
  const cartModal = document.querySelector('.cart-modal');
  const goToPaymentBtn = document.getElementById('go-to-payment-btn');
  const paymentPage = document.getElementById('payment-page');
  const backToCartBtn = document.getElementById('back-to-cart-btn');
  const closeCartBtn = document.getElementById('close-cart-btn');
  const cartItemCount = document.getElementById('cart-item-count');

  let cart = {};
  let products = [];

  fetch('products.json')
    .then(res => res.json())
    .then(data => {
      products = data;
MyFramework.log('Products loaded');
renderCategories(); // Add this!
renderProducts();    // Safe now with default param

    })
    .catch(err => {
      console.error("Error loading products.json", err);
      MyFramework.log('Failed to load products');
    });

let categories = ['Category 1', 'Category 2', 'Category 3', 'Category 4', 'Category 5', 'Category 6', 'All'];

function renderCategories() {
  const container = document.getElementById('category-filters');
  container.innerHTML = '';

  categories.forEach(cat => {
    const btn = document.createElement('button');
    btn.textContent = cat;
    btn.className = 'category-btn';
    btn.dataset.category = cat;
    btn.addEventListener('click', () => filterProducts(cat));
    container.appendChild(btn);
  });
}

function filterProducts(category) {
  let filtered = category === 'All' ? products : products.filter(p => p.category === category);
  renderProducts(filtered);
}

  function renderProducts(filtered = products) {
  productsList.innerHTML = '';

  filtered.forEach(product => {
    const card = document.createElement('div');
    card.className = 'product-card';

    const imagesHtml = product.images.map((img, idx) => `
      <img src="${img}" class="carousel-image${idx === 0 ? ' active' : ''}" />
    `).join('');

    const dotsHtml = product.images.map((_, idx) => `
      <span class="carousel-dot${idx === 0 ? ' active' : ''}" data-idx="${idx}"></span>
    `).join('');

    const inCart = cart[product.id];
    const quantity = inCart || 1;
    const totalPrice = (product.price * quantity).toFixed(2);

    card.innerHTML = `
      <div class="carousel" data-id="${product.id}">
        ${imagesHtml}
        <div class="carousel-dots">${dotsHtml}</div>
      </div>
      <h3>${product.name}</h3>
      <div class="product-price">$${product.price}</div>

      ${inCart
        ? `
          <div class="quantity-controls" style="display:flex;">
            <button class="decrease-btn" data-id="${product.id}">-</button>
            <span class="quantity">${quantity}</span>
            <button class="increase-btn" data-id="${product.id}">+</button>
          </div>
          <div class="product-total" style="display:block;">$${totalPrice}</div>
          <button class="add-btn" data-id="${product.id}" style="display:none;">Add +</button>
        `
        : `
          <button class="add-btn" data-id="${product.id}">Add +</button>
          <div class="quantity-controls" style="display:none;">
            <button class="decrease-btn" data-id="${product.id}">-</button>
            <span class="quantity">1</span>
            <button class="increase-btn" data-id="${product.id}">+</button>
          </div>
          <div class="product-total" style="display:none;">$${product.price}</div>
        `
      }
    `;

    if (inCart) {
      card.classList.add('active');
    }

    productsList.appendChild(card);
  });

  bindAddButtons();
  initCarousels();
}


  function bindAddButtons() {
    document.querySelectorAll('.add-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.dataset.id;
        const product = products.find(p => p.id === id);
        if (!product) return;

        cart[id] = 1;

        const card = btn.closest('.product-card');
        const qtyControls = card.querySelector('.quantity-controls');
        const totalElem = card.querySelector('.product-total');

        btn.style.display = 'none';
        qtyControls.style.display = 'flex';
        totalElem.style.display = 'block';
        totalElem.textContent = `$${product.price * cart[id]}`;

        card.classList.add('active');
        MyFramework.log(`Added 1 ${product.name} to cart`);
        updateCartUI();
      });
    });
  }

  productsList.addEventListener('click', (e) => {
    const target = e.target;

    if (target.classList.contains('increase-btn')) {
      const id = target.dataset.id;
      const product = products.find(p => p.id === id);
      if (!product) return;

      cart[id]++;
      const card = target.closest('.product-card');
      card.querySelector('.quantity').textContent = cart[id];
      card.querySelector('.product-total').textContent = `$${(product.price * cart[id]).toFixed(2)}`;
      MyFramework.log(`Increased ${product.name} to ${cart[id]}`);
      updateCartUI();
    }

    if (target.classList.contains('decrease-btn')) {
      const id = target.dataset.id;
      const product = products.find(p => p.id === id);
      if (!product) return;

      cart[id]--;
      const card = target.closest('.product-card');

      if (cart[id] <= 0) {
        delete cart[id];
        card.querySelector('.quantity-controls').style.display = 'none';
        card.querySelector('.product-total').style.display = 'none';
        card.querySelector('.add-btn').style.display = 'block';
        card.classList.remove('active');
        MyFramework.log(`Removed ${product.name} from cart`);
      } else {
        card.querySelector('.quantity').textContent = cart[id];
        card.querySelector('.product-total').textContent = `$${(product.price * cart[id]).toFixed(2)}`;
        MyFramework.log(`Decreased ${product.name} to ${cart[id]}`);
      }

      updateCartUI();
    }
  });

  function updateCartUI() {
    const cartItemsCount = Object.keys(cart).length;
    cartItemCount.textContent = cartItemsCount;

    const cartList = document.querySelector('.cart-item-list');
    const cartTotal = document.querySelector('.cart-total');

    if (cartList && cartTotal) {
      cartList.innerHTML = '';
      let totalAmount = 0;

      Object.keys(cart).forEach(productId => {
        const product = products.find(p => p.id === productId);
        const quantity = cart[productId];

        if (product) {
          const item = document.createElement('div');
          item.className = 'cart-item';
          item.innerHTML = `
            <span>${product.name}</span>
            <span>x${quantity}</span>
            <span>$${(product.price * quantity).toFixed(2)}</span>
          `;
          cartList.appendChild(item);
          totalAmount += product.price * quantity;
        }
      });

      cartTotal.textContent = `Total: $${totalAmount.toFixed(2)}`;
    }
  }

  function initCarousels() {
    document.querySelectorAll('.carousel').forEach(carousel => {
      let currentIndex = 0;
      const images = carousel.querySelectorAll('.carousel-image');
      const dots = carousel.querySelectorAll('.carousel-dot');

      const showImage = (index) => {
        images.forEach(img => img.classList.remove('active'));
        dots.forEach(dot => dot.classList.remove('active'));
        images[index].classList.add('active');
        dots[index].classList.add('active');
      };

      dots.forEach(dot => {
        dot.addEventListener('click', () => {
          currentIndex = parseInt(dot.dataset.idx);
          showImage(currentIndex);
          MyFramework.log(`Switched image on ${carousel.dataset.id} to index ${currentIndex}`);
        });
      });

      let startX;
      carousel.addEventListener('touchstart', e => startX = e.touches[0].clientX);
      carousel.addEventListener('touchend', e => {
        const dx = e.changedTouches[0].clientX - startX;
        if (dx > 30) currentIndex = (currentIndex - 1 + images.length) % images.length;
        else if (dx < -30) currentIndex = (currentIndex + 1) % images.length;
        showImage(currentIndex);
      });
    });
  }

  cartBtn.addEventListener('click', () => {
    cartModal.style.display = 'flex';
    MyFramework.log('Cart opened');
  });

  closeCartBtn.addEventListener('click', () => {
    cartModal.style.display = 'none';
    MyFramework.log('Cart closed');
  });

  goToPaymentBtn.addEventListener('click', () => {
    cartModal.style.display = 'none';
    paymentPage.style.display = 'block';
    MyFramework.log('Navigated to payment page');
  });

  backToCartBtn.addEventListener('click', () => {
    paymentPage.style.display = 'none';
    cartModal.style.display = 'flex';
    MyFramework.log('Back to cart');
  });

  document.getElementById('open-cart-btn')?.addEventListener('click', toggleCartModal);
  document.getElementById('close-cart-btn')?.addEventListener('click', toggleCartModal);

  function toggleCartModal() {
    const modal = document.querySelector('.cart-modal');
    if (modal) {
      modal.style.display = modal.style.display === 'flex' ? 'none' : 'flex';
    }
  }
});
