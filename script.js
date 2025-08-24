// SANJAY CLOTH CENTRE - COMPLETE ENHANCED E-COMMERCE WEBSITE
// Original Red Theme + Multiple Images + Pricing + Inventory Tracking + Google Sheets + Cloudinary

const CONFIG = {
    // 🔧 IMPORTANT: Update this with your actual Google Sheets CSV URL
    // Example: https://docs.google.com/spreadsheets/d/1ABC123DEF456/export?format=csv
    GOOGLE_SHEETS_URL:
,

    // 📱 WhatsApp Configuration - YOUR NUMBER ALREADY SET
    WHATSAPP_NUMBER: '918972714744', // Your Indian number
    DEFAULT_WHATSAPP_MESSAGE: 'Hi! I\'m interested in this product from Sanjay Cloth Centre:',

    // 📦 Inventory Settings
    LOW_STOCK_THRESHOLD: 5, // Show "Low Stock" when quantity <= this number
    ENABLE_STOCK_TRACKING: true, // Set to false to disable inventory features

    // 💰 Pricing Settings
    CURRENCY_SYMBOL: '₹',
    SHOW_DISCOUNT_PERCENTAGE: true
};

// Global Variables
let products = [];
let currentFilter = 'all';
let currentProduct = null;
let currentPopupImages = [];
let currentPopupImageIndex = 0;

// DOM Elements
const productsGrid = document.getElementById('products-grid');
const productPopup = document.getElementById('product-popup');
const closePopupBtn = document.getElementById('close-popup');
const mobileMenu = document.getElementById('mobile-menu');
const navMenu = document.querySelector('.nav-menu');
const filterBtns = document.querySelectorAll('.filter-btn');

// Initialize Application
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 Starting Sanjay Cloth Centre - Enhanced E-Commerce...');
    initializeApp();
});

async function initializeApp() {
    setupEventListeners();
    await loadProducts();
    setupSmoothScrolling();
    console.log('✅ Website ready with all features: Original Design + Pricing + Inventory + Multi-Image Gallery!');
}

function setupEventListeners() {
    // Mobile menu toggle
    if (mobileMenu && navMenu) {
        mobileMenu.addEventListener('click', () => {
            navMenu.classList.toggle('active');
            mobileMenu.classList.toggle('active');
        });
    }

    // Filter buttons
    filterBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const filter = e.target.dataset.filter;
            setActiveFilter(e.target);
            filterProducts(filter);
        });
    });

    // Popup events
    closePopupBtn?.addEventListener('click', closeProductPopup);
    productPopup?.addEventListener('click', (e) => {
        if (e.target === productPopup) closeProductPopup();
    });

    // Keyboard events
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && productPopup?.classList.contains('active')) {
            closeProductPopup();
        }
    });

    // Navigation smooth scroll
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            navMenu?.classList.remove('active');
            mobileMenu?.classList.remove('active');
        });
    });
}

function setupSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });
}

async function loadProducts() {
    try {
        console.log('📊 Loading products from Google Sheets with inventory tracking...');

        if (CONFIG.GOOGLE_SHEETS_URL.includes('YOUR_SHEET_ID')) {
            console.warn('⚠️ Google Sheets not configured. Loading enhanced sample data...');
            loadSampleProducts();
            return;
        }

        showLoadingState();

        const response = await fetch(CONFIG.GOOGLE_SHEETS_URL);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

        const csvText = await response.text();
        products = parseCSV(csvText);

        if (products.length === 0) throw new Error('No products found');

        console.log(`✅ Loaded ${products.length} products with pricing and inventory data`);
        displayProducts(products);

    } catch (error) {
        console.error('❌ Error loading products:', error);
        showErrorMessage('Unable to load products from Google Sheets. Using enhanced sample data.');
        loadSampleProducts();
    }
}

function parseCSV(csvText) {
    const lines = csvText.trim().split('\n');
    if (lines.length < 2) throw new Error('Invalid CSV format');

    const headers = lines[0].split(',').map(h => h.trim().replace(/"/g, ''));
    const products = [];

    for (let i = 1; i < lines.length; i++) {
        const values = parseCSVLine(lines[i]);

        if (values.length >= headers.length) {
            const product = {};
            headers.forEach((header, index) => {
                product[header] = values[index] || '';
            });

            // Process colors and multiple images per color
            if (product['Colors Available']) {
                product.colors = product['Colors Available']
                    .split(';')
                    .map(c => c.trim())
                    .filter(c => c.length > 0);
            } else {
                product.colors = [];
            }

            if (product['Image URLs']) {
                // Format: color1img1|color1img2;color2img1;color3img1|color3img2
                product.imageGroups = product['Image URLs']
                    .split(';')
                    .map(group => group.split('|').map(url => url.trim()).filter(url => url.length > 0));
            } else {
                product.imageGroups = [];
            }

            // Enhanced pricing and inventory processing
            product.originalPrice = parseFloat(product['Original Price']) || 0;
            product.sellingPrice = parseFloat(product['Selling Price']) || parseFloat(product['Base Price']) || 0;
            product.stockQuantity = parseInt(product['Stock Quantity']) || 0;

            // Calculate discount
            if (product.originalPrice > product.sellingPrice && product.originalPrice > 0) {
                product.discountPercentage = Math.round(((product.originalPrice - product.sellingPrice) / product.originalPrice) * 100);
            } else {
                product.discountPercentage = 0;
            }

            // Determine stock status
            product.stockStatus = getStockStatus(product.stockQuantity);

            // Only add valid products
            if (product['Product ID'] && product['Product Name']) {
                products.push(product);
            }
        }
    }

    return products;
}

function parseCSVLine(line) {
    const result = [];
    let current = '';
    let inQuotes = false;

    for (let i = 0; i < line.length; i++) {
        const char = line[i];
        if (char === '"') {
            inQuotes = !inQuotes;
        } else if (char === ',' && !inQuotes) {
            result.push(current.trim());
            current = '';
        } else {
            current += char;
        }
    }
    result.push(current.trim());
    return result;
}

function getStockStatus(quantity) {
    if (!CONFIG.ENABLE_STOCK_TRACKING) return 'in-stock';

    if (quantity <= 0) return 'out-of-stock';
    if (quantity <= CONFIG.LOW_STOCK_THRESHOLD) return 'low-stock';
    return 'in-stock';
}

function getStockStatusText(status, quantity) {
    if (!CONFIG.ENABLE_STOCK_TRACKING) return '';

    switch (status) {
        case 'out-of-stock':
            return 'Out of Stock';
        case 'low-stock':
            return `Only ${quantity} Left!`;
        case 'in-stock':
            return quantity > 10 ? 'In Stock' : `${quantity} Available`;
        default:
            return 'In Stock';
    }
}

function loadSampleProducts() {
    // Enhanced sample products with pricing and inventory
    products = [
        {
            'Product ID': '001',
            'Product Name': 'Premium Cotton Shirt',
            'Category': 'men',
            'Description': 'High-quality cotton shirt perfect for formal and casual occasions. Premium finishing with comfortable fit.',
            'Colors Available': 'White;Blue;Black',
            'Image URLs': 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=500|https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=400&h=500&fit=crop;https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=500&tint=0000ff;https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=500&tint=333333|https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=400&h=500&fit=crop&tint=333333',
            'Original Price': '1799',
            'Selling Price': '1299',
            'Stock Quantity': '15',
            colors: ['White', 'Blue', 'Black'],
            imageGroups: [
                ['https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=500', 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=400&h=500&fit=crop'],
                ['https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=500&tint=0000ff'],
                ['https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=500&tint=333333', 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=400&h=500&fit=crop&tint=333333']
            ],
            originalPrice: 1799,
            sellingPrice: 1299,
            stockQuantity: 15,
            discountPercentage: 28,
            stockStatus: 'in-stock'
        },
        {
            'Product ID': '002',
            'Product Name': 'Designer Kurti',
            'Category': 'women',
            'Description': 'Beautiful traditional kurti with contemporary design elements. Perfect for festivals and special occasions.',
            'Colors Available': 'Red;Green;Pink',
            'Image URLs': 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=500&tint=ff0000;https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=500&tint=008000|https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=400&h=500&fit=crop&tint=008000;https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=500&tint=ff69b4',
            'Original Price': '1299',
            'Selling Price': '899',
            'Stock Quantity': '3',
            colors: ['Red', 'Green', 'Pink'],
            imageGroups: [
                ['https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=500&tint=ff0000'],
                ['https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=500&tint=008000', 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=400&h=500&fit=crop&tint=008000'],
                ['https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=500&tint=ff69b4']
            ],
            originalPrice: 1299,
            sellingPrice: 899,
            stockQuantity: 3,
            discountPercentage: 31,
            stockStatus: 'low-stock'
        },
        {
            'Product ID': '003',
            'Product Name': 'Kids Summer T-Shirt',
            'Category': 'kids',
            'Description': 'Comfortable and colorful t-shirt for children. Made with soft, breathable fabric perfect for active kids.',
            'Colors Available': 'Yellow;Orange;Purple',
            'Image URLs': 'https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?w=500&tint=ffff00;https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?w=500&tint=ff8c00|https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?w=400&h=500&fit=crop&tint=ff8c00;https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?w=500&tint=800080',
            'Original Price': '699',
            'Selling Price': '499',
            'Stock Quantity': '8',
            colors: ['Yellow', 'Orange', 'Purple'],
            imageGroups: [
                ['https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?w=500&tint=ffff00'],
                ['https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?w=500&tint=ff8c00', 'https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?w=400&h=500&fit=crop&tint=ff8c00'],
                ['https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?w=500&tint=800080']
            ],
            originalPrice: 699,
            sellingPrice: 499,
            stockQuantity: 8,
            discountPercentage: 29,
            stockStatus: 'in-stock'
        },
        {
            'Product ID': '004',
            'Product Name': 'Luxury Formal Dress',
            'Category': 'women',
            'Description': 'Elegant formal dress for special occasions. Premium fabric with sophisticated design.',
            'Colors Available': 'Black;Navy',
            'Image URLs': 'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=500;https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=500&tint=000080',
            'Original Price': '2999',
            'Selling Price': '2499',
            'Stock Quantity': '0',
            colors: ['Black', 'Navy'],
            imageGroups: [
                ['https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=500'],
                ['https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=500&tint=000080']
            ],
            originalPrice: 2999,
            sellingPrice: 2499,
            stockQuantity: 0,
            discountPercentage: 17,
            stockStatus: 'out-of-stock'
        }
    ];

    console.log('📦 Enhanced sample products loaded with pricing and inventory');
    displayProducts(products);
}

function displayProducts(productsToShow) {
    if (!productsGrid) return;

    if (productsToShow.length === 0) {
        productsGrid.innerHTML = '<div class="loading-message"><p>No products found matching current filters.</p></div>';
        return;
    }

    productsGrid.innerHTML = productsToShow.map(product => createProductCard(product)).join('');
    setupProductCardListeners();
}

function createProductCard(product) {
    const firstImageGroup = product.imageGroups && product.imageGroups[0] ? product.imageGroups[0] : [];
    const firstImageUrl = firstImageGroup.length > 0 ? firstImageGroup[0] : 'https://via.placeholder.com/300x280?text=No+Image';
    const colors = product.colors || [];
    const hasMultipleImages = firstImageGroup.length > 1;

    const stockBadgeClass = CONFIG.ENABLE_STOCK_TRACKING ? product.stockStatus : 'in-stock';
    const stockBadgeText = CONFIG.ENABLE_STOCK_TRACKING ? getStockStatusText(product.stockStatus, product.stockQuantity) : '';
    const isOutOfStock = CONFIG.ENABLE_STOCK_TRACKING && product.stockStatus === 'out-of-stock';

    const showOriginalPrice = product.originalPrice > product.sellingPrice && product.originalPrice > 0;
    const discountText = CONFIG.SHOW_DISCOUNT_PERCENTAGE && product.discountPercentage > 0 ? `${product.discountPercentage}% OFF` : '';

    return `
        <div class="product-card" data-product-id="${product['Product ID']}" data-category="${product.Category}">
            <div class="product-image-container">
                <img class="product-image" src="${firstImageUrl}" alt="${product['Product Name']}" loading="lazy">

                ${CONFIG.ENABLE_STOCK_TRACKING ? `<div class="stock-badge ${stockBadgeClass}">${stockBadgeText}</div>` : ''}
                ${discountText ? `<div class="discount-badge">${discountText}</div>` : ''}

                ${hasMultipleImages ? createImageNavigation(firstImageGroup) : ''}
            </div>

            <div class="product-info">
                <div class="product-category">${product.Category.toUpperCase()}</div>
                <h3 class="product-name">${product['Product Name']}</h3>

                <div class="price-container">
                    ${showOriginalPrice ? `<span class="original-price">${CONFIG.CURRENCY_SYMBOL}${product.originalPrice}</span>` : ''}
                    <span class="selling-price">${CONFIG.CURRENCY_SYMBOL}${product.sellingPrice}</span>
                    ${product.discountPercentage > 0 ? `<span class="discount-percentage">${product.discountPercentage}% OFF</span>` : ''}
                </div>

                ${CONFIG.ENABLE_STOCK_TRACKING ? `
                    <div class="stock-info">
                        <span class="stock-status ${product.stockStatus}">${getStockStatusText(product.stockStatus, product.stockQuantity)}</span>
                    </div>
                ` : ''}

                <p class="product-description">${product.Description}</p>

                ${colors.length > 0 ? `
                    <div class="color-options">
                        ${colors.map((color, index) => `
                            <div class="color-option" 
                                 data-color="${color.toLowerCase()}" 
                                 data-product-id="${product['Product ID']}"
                                 data-color-index="${index}"
                                 title="${color}">
                            </div>
                        `).join('')}
                    </div>
                ` : ''}

                <button class="whatsapp-btn" ${isOutOfStock ? 'disabled' : ''}>
                    <i class="fab fa-whatsapp"></i>
                    ${isOutOfStock ? 'Out of Stock' : 'Inquire on WhatsApp'}
                </button>
            </div>
        </div>
    `;
}

function createImageNavigation(images) {
    if (images.length <= 1) return '';

    return `
        <div class="image-nav">
            <div class="image-arrows">
                <button class="arrow prev-arrow" data-direction="prev">‹</button>
                <button class="arrow next-arrow" data-direction="next">›</button>
            </div>
            <div class="nav-dots">
                ${images.map((_, index) => 
                    `<span class="nav-dot ${index === 0 ? 'active' : ''}" data-index="${index}"></span>`
                ).join('')}
            </div>
        </div>
    `;
}

function setupProductCardListeners() {
    // Click anywhere on product card to open popup
    document.querySelectorAll('.product-card').forEach(card => {
        card.addEventListener('click', (e) => {
            if (!e.target.matches('.color-option, .whatsapp-btn, .whatsapp-btn i, .arrow, .nav-dot')) {
                openProductPopup(card.dataset.productId);
            }
        });
    });

    // Color selection
    document.querySelectorAll('.color-option').forEach(colorBtn => {
        colorBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            handleColorSelection(colorBtn);
        });
    });

    // WhatsApp buttons
    document.querySelectorAll('.whatsapp-btn:not([disabled])').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const productId = btn.closest('.product-card').dataset.productId;
            openWhatsApp(productId);
        });
    });

    // Image navigation
    setupImageNavigationListeners();
}

function setupImageNavigationListeners() {
    document.querySelectorAll('.product-card').forEach(card => {
        const productId = card.dataset.productId;
        const product = products.find(p => p['Product ID'] === productId);

        if (!product || !product.imageGroups || !product.imageGroups[0] || product.imageGroups[0].length <= 1) return;

        const images = product.imageGroups[0];
        let currentIndex = 0;

        const productImage = card.querySelector('.product-image');
        const dots = card.querySelectorAll('.nav-dot');
        const arrows = card.querySelectorAll('.arrow');

        // Dot navigation
        dots.forEach((dot, index) => {
            dot.addEventListener('click', (e) => {
                e.stopPropagation();
                showImage(index);
            });
        });

        // Arrow navigation
        arrows.forEach(arrow => {
            arrow.addEventListener('click', (e) => {
                e.stopPropagation();
                const direction = arrow.dataset.direction;

                if (direction === 'next') {
                    currentIndex = (currentIndex + 1) % images.length;
                } else {
                    currentIndex = (currentIndex - 1 + images.length) % images.length;
                }

                showImage(currentIndex);
            });
        });

        function showImage(index) {
            if (images[index]) {
                productImage.src = images[index];
                dots.forEach((dot, i) => dot.classList.toggle('active', i === index));
                currentIndex = index;
            }
        }
    });
}

function handleColorSelection(colorBtn) {
    const productId = colorBtn.dataset.productId;
    const colorIndex = parseInt(colorBtn.dataset.colorIndex);
    const product = products.find(p => p['Product ID'] === productId);

    if (product && product.imageGroups && product.imageGroups[colorIndex]) {
        const colorImages = product.imageGroups[colorIndex];

        if (colorImages.length > 0) {
            const productCard = colorBtn.closest('.product-card');
            const productImage = productCard.querySelector('.product-image');
            productImage.src = colorImages[0];

            // Update active color
            productCard.querySelectorAll('.color-option').forEach(option => option.classList.remove('active'));
            colorBtn.classList.add('active');

            // Update navigation for new color images
            updateImageNavigation(productCard, colorImages);
        }
    }
}

function updateImageNavigation(productCard, images) {
    const imageNav = productCard.querySelector('.image-nav');

    if (images.length <= 1) {
        if (imageNav) imageNav.style.display = 'none';
        return;
    }

    if (!imageNav) {
        const imageContainer = productCard.querySelector('.product-image-container');
        imageContainer.insertAdjacentHTML('beforeend', createImageNavigation(images));
        setupImageNavigationListeners();
    } else {
        imageNav.style.display = 'flex';
        const dotsContainer = imageNav.querySelector('.nav-dots');
        dotsContainer.innerHTML = images.map((_, index) => 
            `<span class="nav-dot ${index === 0 ? 'active' : ''}" data-index="${index}"></span>`
        ).join('');
    }
}

function setActiveFilter(activeBtn) {
    filterBtns.forEach(btn => btn.classList.remove('active'));
    activeBtn.classList.add('active');
}

function filterProducts(filter) {
    currentFilter = filter;
    let filteredProducts = filter === 'all' ? products : 
        products.filter(p => p.Category.toLowerCase() === filter.toLowerCase());

    displayProducts(filteredProducts);
    productsGrid.classList.add('fade-in');
    setTimeout(() => productsGrid.classList.remove('fade-in'), 500);
}

function openProductPopup(productId) {
    const product = products.find(p => p['Product ID'] === productId);
    if (!product) return;

    currentProduct = product;
    currentPopupImages = product.imageGroups && product.imageGroups[0] ? product.imageGroups[0] : [];
    currentPopupImageIndex = 0;

    // Populate popup content
    const firstImage = currentPopupImages.length > 0 ? currentPopupImages[0] : 'https://via.placeholder.com/450x450?text=No+Image';
    document.getElementById('popup-product-image').src = firstImage;
    document.getElementById('popup-product-name').textContent = product['Product Name'];
    document.getElementById('popup-product-category').textContent = product.Category.toUpperCase();

    // Enhanced pricing display
    const showOriginalPrice = product.originalPrice > product.sellingPrice && product.originalPrice > 0;
    const originalPriceEl = document.getElementById('popup-original-price');
    const sellingPriceEl = document.getElementById('popup-selling-price');
    const discountEl = document.getElementById('popup-discount');

    if (showOriginalPrice) {
        originalPriceEl.textContent = `${CONFIG.CURRENCY_SYMBOL}${product.originalPrice}`;
        originalPriceEl.style.display = 'inline';
    } else {
        originalPriceEl.style.display = 'none';
    }

    sellingPriceEl.textContent = product.sellingPrice;

    if (product.discountPercentage > 0) {
        discountEl.textContent = `${product.discountPercentage}% OFF`;
        discountEl.style.display = 'inline';
    } else {
        discountEl.style.display = 'none';
    }

    // Stock information
    if (CONFIG.ENABLE_STOCK_TRACKING) {
        const stockStatusEl = document.getElementById('popup-stock-status');
        const stockQuantityEl = document.getElementById('popup-stock-quantity');

        stockStatusEl.textContent = getStockStatusText(product.stockStatus, product.stockQuantity);
        stockStatusEl.className = `stock-status ${product.stockStatus}`;

        if (product.stockQuantity > 0) {
            stockQuantityEl.textContent = `${product.stockQuantity} units available`;
        } else {
            stockQuantityEl.textContent = 'Currently out of stock';
        }

        document.getElementById('popup-stock-info').style.display = 'block';
    } else {
        document.getElementById('popup-stock-info').style.display = 'none';
    }

    document.getElementById('popup-product-description').textContent = product.Description;

    setupPopupColorOptions(product);
    setupPopupImageNavigation();

    // WhatsApp button
    const whatsappBtn = document.getElementById('popup-whatsapp');
    const isOutOfStock = CONFIG.ENABLE_STOCK_TRACKING && product.stockStatus === 'out-of-stock';

    if (isOutOfStock) {
        whatsappBtn.disabled = true;
        whatsappBtn.innerHTML = '<i class="fas fa-times"></i> Out of Stock';
    } else {
        whatsappBtn.disabled = false;
        whatsappBtn.innerHTML = '<i class="fab fa-whatsapp"></i> Inquire on WhatsApp';
        whatsappBtn.onclick = () => openWhatsApp(productId, true);
    }

    // Show popup
    productPopup.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function setupPopupColorOptions(product) {
    const colorOptionsContainer = document.getElementById('popup-color-options');
    const colorsSection = document.getElementById('popup-colors');

    if (product.colors && product.colors.length > 0) {
        colorOptionsContainer.innerHTML = product.colors.map((color, index) => `
            <div class="color-option popup-color" 
                 data-color="${color.toLowerCase()}" 
                 data-color-index="${index}"
                 title="${color}">
            </div>
        `).join('');

        document.querySelectorAll('.popup-color').forEach(colorBtn => {
            colorBtn.addEventListener('click', () => handlePopupColorSelection(colorBtn));
        });

        colorsSection.style.display = 'block';
        const firstColor = document.querySelector('.popup-color');
        if (firstColor) firstColor.classList.add('active');
    } else {
        colorsSection.style.display = 'none';
    }
}

function handlePopupColorSelection(colorBtn) {
    const colorIndex = parseInt(colorBtn.dataset.colorIndex);

    if (currentProduct && currentProduct.imageGroups && currentProduct.imageGroups[colorIndex]) {
        currentPopupImages = currentProduct.imageGroups[colorIndex];
        currentPopupImageIndex = 0;

        if (currentPopupImages.length > 0) {
            document.getElementById('popup-product-image').src = currentPopupImages[0];
        }

        document.querySelectorAll('.popup-color').forEach(option => option.classList.remove('active'));
        colorBtn.classList.add('active');

        setupPopupImageNavigation();
    }
}

function setupPopupImageNavigation() {
    const imageNav = document.getElementById('popup-image-nav');
    const dotsContainer = document.getElementById('popup-nav-dots');

    if (currentPopupImages.length <= 1) {
        imageNav.style.display = 'none';
        return;
    }

    imageNav.style.display = 'flex';
    dotsContainer.innerHTML = currentPopupImages.map((_, index) => 
        `<span class="nav-dot ${index === 0 ? 'active' : ''}" data-index="${index}"></span>`
    ).join('');

    const dots = dotsContainer.querySelectorAll('.nav-dot');
    const arrows = imageNav.querySelectorAll('.arrow');

    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => showPopupImage(index));
    });

    arrows.forEach(arrow => {
        arrow.addEventListener('click', () => {
            const direction = arrow.dataset.direction;
            if (direction === 'next') {
                currentPopupImageIndex = (currentPopupImageIndex + 1) % currentPopupImages.length;
            } else {
                currentPopupImageIndex = (currentPopupImageIndex - 1 + currentPopupImages.length) % currentPopupImages.length;
            }
            showPopupImage(currentPopupImageIndex);
        });
    });
}

function showPopupImage(index) {
    if (currentPopupImages[index]) {
        document.getElementById('popup-product-image').src = currentPopupImages[index];
        const dots = document.querySelectorAll('#popup-nav-dots .nav-dot');
        dots.forEach((dot, i) => dot.classList.toggle('active', i === index));
        currentPopupImageIndex = index;
    }
}

function closeProductPopup() {
    productPopup.classList.remove('active');
    document.body.style.overflow = 'auto';
    currentProduct = null;
    currentPopupImages = [];
    currentPopupImageIndex = 0;
}

function openWhatsApp(productId, fromPopup = false) {
    const product = products.find(p => p['Product ID'] === productId);
    if (!product) return;

    const isOutOfStock = CONFIG.ENABLE_STOCK_TRACKING && product.stockStatus === 'out-of-stock';
    const stockInfo = CONFIG.ENABLE_STOCK_TRACKING ? `\n📦 Stock: ${getStockStatusText(product.stockStatus, product.stockQuantity)}` : '';
    const pricingInfo = product.originalPrice > product.sellingPrice ? 
        `\n💰 Price: ${CONFIG.CURRENCY_SYMBOL}${product.sellingPrice} (${product.discountPercentage}% OFF from ${CONFIG.CURRENCY_SYMBOL}${product.originalPrice})` :
        `\n💰 Price: ${CONFIG.CURRENCY_SYMBOL}${product.sellingPrice}`;

    let message = `${CONFIG.DEFAULT_WHATSAPP_MESSAGE}\n\n` +
                 `📦 Product: ${product['Product Name']}\n` +
                 `📂 Category: ${product.Category}${pricingInfo}${stockInfo}\n\n`;

    if (isOutOfStock) {
        message += 'Please notify me when this item is back in stock. Also, please share details about:';
    } else {
        message += 'Please share more details about:';
    }

    message += '\n• Available sizes\n• Delivery options\n• Material details';

    const whatsappUrl = `https://wa.me/${CONFIG.WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');

    if (fromPopup) {
        setTimeout(closeProductPopup, 500);
    }
}

function showLoadingState() {
    if (productsGrid) {
        productsGrid.innerHTML = `
            <div class="loading-message">
                <div class="loading-spinner"></div>
                <p>Loading enhanced product catalog...</p>
                <p><small>Setting up pricing and inventory tracking...</small></p>
            </div>
        `;
    }
}

function showErrorMessage(message) {
    if (productsGrid) {
        productsGrid.innerHTML = `
            <div class="loading-message">
                <p style="color: #e74c3c; font-weight: 600;">${message}</p>
                <p><small>Check browser console (F12) for technical details.</small></p>
            </div>
        `;
    }
}

// Export for debugging and potential extensions
window.SanjayClothCentre = {
    CONFIG,
    products,
    loadProducts,
    displayProducts,
    openProductPopup,
    closeProductPopup,
    filterProducts,
    getStockStatus,
    getStockStatusText
};

console.log('🎉 Sanjay Cloth Centre - Fully Enhanced E-Commerce Ready!');
console.log('🔧 Features: Original Red Theme + Pricing + Inventory + Multi-Image + Google Sheets + Cloudinary');
console.log('📱 WhatsApp: ' + CONFIG.WHATSAPP_NUMBER);
console.log('📝 Don\'t forget to update CONFIG with your Google Sheets URL for full functionality');
