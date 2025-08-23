# 🛍️ Sanjay Cloth Centre - E-Commerce Website

A modern, responsive e-commerce website built with HTML, CSS, and JavaScript, featuring Google Sheets integration for product catalog management and Cloudinary for image hosting.

## ✨ Features

- 📱 **Fully Responsive Design** - Works perfectly on all devices
- 🛒 **Product Catalog** - Dynamic product loading from Google Sheets
- 🎨 **Color Variants** - Interactive color selection with image switching
- 💬 **WhatsApp Integration** - Direct product inquiries via WhatsApp
- 🖼️ **Image Optimization** - Cloudinary integration for fast image loading
- 🔍 **Product Filtering** - Filter by categories (Men, Women, Kids)
- 📦 **Product Popup** - Detailed product view with enhanced UX
- 🎯 **Click Anywhere** - Click anywhere on product card to view details
- 🌟 **Modern UI/UX** - Clean, professional design with smooth animations

## 🚀 Demo

Visit the live demo: [Your Website URL Here]

## 📁 Project Structure

```
sanjay-cloth-centre/
├── index.html          # Main HTML file
├── styles.css          # CSS styles and responsive design
├── script.js           # JavaScript functionality
├── SETUP_GUIDE.md      # Detailed setup instructions
├── sample_catalog.csv  # Sample data template
└── README.md           # This file
```

## 🛠️ Technologies Used

- **HTML5** - Semantic markup and structure
- **CSS3** - Modern styling with Flexbox and Grid
- **JavaScript (ES6+)** - Interactive functionality
- **Google Sheets API** - Product catalog management
- **Cloudinary** - Image hosting and optimization
- **Font Awesome** - Icons
- **Google Fonts** - Typography (Poppins)

## 📊 Google Sheets Integration

The website uses Google Sheets as a content management system for products:

### Required Columns:
- **Product ID** - Unique identifier
- **Product Name** - Display name
- **Category** - men/women/kids/accessories
- **Base Price** - Price in INR
- **Description** - Product description
- **Colors Available** - Semicolon-separated (Red;Blue;Green)
- **Image URLs** - Semicolon-separated Cloudinary URLs

### Benefits:
- ✅ **No Database Required** - Use Google Sheets as your database
- ✅ **Easy Updates** - Update products without touching code
- ✅ **Free Forever** - No hosting costs for data
- ✅ **Collaborative** - Multiple people can manage inventory

## 🖼️ Cloudinary Integration

### Free Tier Includes:
- 20,000 monthly transformations
- 10GB managed storage
- 20GB viewing bandwidth
- 300,000 total images/videos

### Features Used:
- Automatic image optimization
- Responsive image delivery
- URL-based transformations
- CDN delivery for fast loading

## 🎯 Key Features Explained

### 1. **Color-Based Image Switching**
- Click on any color option to see the product in that color
- Images and colors are synchronized via Google Sheets
- Smooth transitions with CSS animations

### 2. **Enhanced Product Interaction**
- Click anywhere on a product card to open detailed view
- Quick WhatsApp inquiry from product cards
- Mobile-optimized popup with swipe gestures

### 3. **WhatsApp Integration**
- Pre-filled messages with product details
- Direct contact without forms
- Mobile-optimized for better conversion

### 4. **Responsive Design**
- Mobile-first approach
- Optimized for touch interactions
- Fast loading on all devices

## 🚀 Quick Setup

1. **Clone or Download** this repository
2. **Upload files** to your GitHub repository
3. **Deploy to Vercel** (free hosting)
4. **Set up Google Sheets** following SETUP_GUIDE.md
5. **Configure Cloudinary** for images
6. **Update configuration** in script.js

## 📋 Configuration

Edit these values in `script.js`:

```javascript
const CONFIG = {
    GOOGLE_SHEETS_URL: 'your_published_sheets_csv_url',
    WHATSAPP_NUMBER: 'your_whatsapp_number',
    DEFAULT_WHATSAPP_MESSAGE: 'your_custom_message'
};
```

## 🎨 Customization

### Colors and Branding
- Edit CSS variables in `styles.css`
- Update logo and brand name in `index.html`
- Modify color scheme to match your brand

### Layout and Design
- Responsive grid system for products
- Customizable filter categories
- Easily modifiable UI components

## 📱 Browser Support

- ✅ Chrome (Latest)
- ✅ Firefox (Latest)
- ✅ Safari (Latest)
- ✅ Edge (Latest)
- ✅ Mobile browsers (iOS Safari, Chrome Mobile)

## 🔧 Development

### Prerequisites
- Basic understanding of HTML, CSS, JavaScript
- Google account for Sheets
- Cloudinary account for images
- GitHub account for hosting

### Local Development
1. Clone the repository
2. Open `index.html` in a web browser
3. Use Live Server extension for better development experience

## 📈 Performance Features

- **Lazy Loading** - Images load only when needed
- **Optimized Images** - Cloudinary auto-optimization
- **Minimal Dependencies** - Pure JavaScript, no frameworks
- **Cached Requests** - Smart data caching
- **Progressive Enhancement** - Works without JavaScript

## 🛡️ Security Features

- **No Backend Required** - Reduced attack surface
- **HTTPS Only** - Secure data transmission
- **Input Validation** - Client-side data validation
- **Safe URL Generation** - Protected WhatsApp integration

## 📞 Support and Documentation

- **SETUP_GUIDE.md** - Complete setup instructions
- **sample_catalog.csv** - Template for Google Sheets
- **Comments in Code** - Well-documented codebase
- **Error Handling** - Graceful error messages

## 🎯 Use Cases

Perfect for:
- Small to medium clothing businesses
- Local boutiques and fashion stores
- Family businesses transitioning online
- Entrepreneurs starting fashion e-commerce
- Anyone needing a catalog website with WhatsApp integration

## 🌟 Future Enhancements

Potential additions:
- Shopping cart functionality
- Payment gateway integration
- Customer reviews system
- Inventory management
- Analytics integration
- Multi-language support

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📞 Contact

For support or questions:
- Create an issue in this repository
- Contact via WhatsApp integration on the demo site

---

**Made with ❤️ for Sanjay Cloth Centre**

*Empowering local businesses to go digital with modern, fast, and free e-commerce solutions.*