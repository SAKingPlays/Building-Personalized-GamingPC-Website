document.addEventListener('DOMContentLoaded', () => {
    // Mobile Menu Toggle
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');
    const closeMenuBtn = document.getElementById('close-menu');
    const overlay = document.getElementById('overlay');

    mobileMenuBtn.addEventListener('click', () => {
        mobileMenu.classList.add('active');
        overlay.classList.add('active');
    });

    closeMenuBtn.addEventListener('click', () => {
        mobileMenu.classList.remove('active');
        overlay.classList.remove('active');
    });

    // Cart Modal Toggle
    const cartBtnHero = document.getElementById('cart-btn-hero');
    const cartModal = document.getElementById('cart-modal');
    const closeCartBtn = document.getElementById('close-cart');

    const openCart = () => {
        cartModal.classList.add('active');
        overlay.classList.add('active');
    };

    cartBtnHero.addEventListener('click', openCart);

    closeCartBtn.addEventListener('click', () => {
        cartModal.classList.remove('active');
        overlay.classList.remove('active');
    });

    // Auth Modals
    const loginBtn = document.getElementById('login-btn');
    const registerBtn = document.getElementById('register-btn');
    const mobileLogin = document.getElementById('mobile-login');
    const mobileRegister = document.getElementById('mobile-register');
    const loginModal = document.getElementById('login-modal');
    const registerModal = document.getElementById('register-modal');
    const closeLogin = document.getElementById('close-login');
    const closeRegister = document.getElementById('close-register');
    const switchToRegister = document.getElementById('switch-to-register');
    const switchToLogin = document.getElementById('switch-to-login');

    const openLogin = () => {
        loginModal.classList.add('active');
        overlay.classList.add('active');
    };

    const openRegister = () => {
        registerModal.classList.add('active');
        overlay.classList.add('active');
    };

    const closeAuth = () => {
        loginModal.classList.remove('active');
        registerModal.classList.remove('active');
        overlay.classList.remove('active');
    };

    loginBtn.addEventListener('click', openLogin);
    registerBtn.addEventListener('click', openRegister);
    mobileLogin.addEventListener('click', () => {
        mobileMenu.classList.remove('active');
        openLogin();
    });
    mobileRegister.addEventListener('click', () => {
        mobileMenu.classList.remove('active');
        openRegister();
    });

    closeLogin.addEventListener('click', closeAuth);
    closeRegister.addEventListener('click', closeAuth);

    switchToRegister.addEventListener('click', (e) => {
        e.preventDefault();
        closeAuth();
        openRegister();
    });

    switchToLogin.addEventListener('click', (e) => {
        e.preventDefault();
        closeAuth();
        openLogin();
    });

    // Overlay close
    overlay.addEventListener('click', () => {
        mobileMenu.classList.remove('active');
        cartModal.classList.remove('active');
        closeAuth();
        overlay.classList.remove('active');
    });

    // Cart Functionality
    let cart = [];
    const cartItemsContainer = document.getElementById('cart-items');
    const cartTotalPrice = document.getElementById('cart-total-price');
    const cartCount = document.querySelectorAll('.cart-count');

    function updateCart() {
        cartItemsContainer.innerHTML = '';
        if (cart.length === 0) {
            cartItemsContainer.innerHTML = '<div class="empty-cart-message">Your cart is empty</div>';
        } else {
            cart.forEach((item, index) => {
                const cartItem = document.createElement('div');
                cartItem.classList.add('cart-item');
                cartItem.innerHTML = `
                    <div class="cart-item-image">
                        <img src="https://placeholder-image-service.onrender.com/image/60x60?prompt=${encodeURIComponent(item.name)}&id=cart-item-${item.id}" alt="${item.name}">
                    </div>
                    <div class="cart-item-details">
                        <div class="cart-item-name">${item.name}</div>
                        <div class="cart-item-price">₨${item.price.toFixed(2)}</div>
                        <button class="cart-item-remove" data-index="${index}">Remove</button>
                    </div>
                `;
                cartItemsContainer.appendChild(cartItem);
            });
        }

        const total = cart.reduce((sum, item) => sum + item.price, 0);
        cartTotalPrice.textContent = `₨${total.toFixed(2)}`;
        cartCount.forEach(count => count.textContent = cart.length);

        // Add event listeners to remove buttons
        document.querySelectorAll('.cart-item-remove').forEach(button => {
            button.addEventListener('click', () => {
                const index = parseInt(button.dataset.index);
                cart.splice(index, 1);
                updateCart();
            });
        });
    }

    // Add to Cart Functionality
    document.querySelectorAll('.add-to-cart').forEach(button => {
        button.addEventListener('click', () => {
            const id = button.dataset.id;
            const name = button.dataset.name;
            const price = parseFloat(button.dataset.price);
            cart.push({ id, name, price });
            updateCart();
            alert(`${name} added to cart!`);
        });
    });

    // PC Builder Functionality
    const summaryItems = document.querySelectorAll('.summary-item');
    const totalPriceElement = document.querySelector('.total-price span:last-child');
    const compatibilityCheck = document.querySelector('.compatibility-check');
    let selectedComponents = {};

    function updateSummary() {
        let total = 0;
        summaryItems.forEach(item => {
            const category = item.dataset.category;
            const selected = selectedComponents[category] || { name: 'Not selected', price: 0 };
            item.querySelector('span:last-child').textContent = selected.name;
            total += selected.price;
        });

        totalPriceElement.textContent = `₨${total.toLocaleString('en-US')}`;

        // Basic compatibility check (placeholder logic)
        const hasRequiredComponents = ['CPU', 'GPU', 'Motherboard', 'RAM'].every(cat => selectedComponents[cat]);
        compatibilityCheck.textContent = hasRequiredComponents
            ? 'Compatibility: All good! ✅'
            : 'Compatibility: Please select all required components ⚠️';
        compatibilityCheck.style.color = hasRequiredComponents ? 'var(--success)' : '#ff4444';
    }

    document.querySelectorAll('.component-option').forEach(option => {
        option.addEventListener('click', () => {
            const category = option.dataset.category;
            const name = option.querySelector('.component-name').textContent;
            let priceStr = option.querySelector('.component-price').textContent.replace('₨', '').replace(/,/g, '');
            const price = parseFloat(priceStr);

            // Remove 'selected' from siblings
            option.closest('.component-options').querySelectorAll('.component-option').forEach(opt => {
                opt.classList.remove('selected');
            });
            option.classList.add('selected');

            // Update selected components
            selectedComponents[category] = { name, price };
            updateSummary();
        });
    });

    // Build and Save Build Buttons
    const buildBtn = document.querySelector('.btn-build');
    const saveBuildBtn = document.querySelector('.btn-save-build');

    buildBtn.addEventListener('click', () => {
        const hasRequiredComponents = ['CPU', 'GPU', 'Motherboard', 'RAM'].every(cat => selectedComponents[cat]);
        if (hasRequiredComponents) {
            alert('Build completed! Ready to proceed to checkout.');
        } else {
            alert('Please select all required components (CPU, GPU, Motherboard, RAM) to complete your build.');
        }
    });

    saveBuildBtn.addEventListener('click', () => {
        if (Object.keys(selectedComponents).length > 0) {
            alert('Build saved successfully!');
        } else {
            alert('Please select at least one component to save your build.');
        }
    });

    // Initialize cart and summary
    updateCart();
    updateSummary();
});