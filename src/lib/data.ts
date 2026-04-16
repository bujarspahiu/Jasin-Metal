export const HERO_SLIDES = [
  {
    image: 'https://d64gsuwffb70l.cloudfront.net/69e151eeabc82c9459d80766_1776374558191_216aaa27.jpg',
    eyebrow: { en: 'PRECISION MANUFACTURING', sq: 'PRODHIM PRECIZ' },
    title: { en: 'Stainless Steel Excellence, Engineered for Industry', sq: 'Përsosmëri në Inox, e Projektuar për Industrinë' },
    subtitle: { en: 'Premium inox solutions for professional kitchens and industrial environments.', sq: 'Zgjidhje premium inox për kuzhina profesionale dhe ambiente industriale.' },
  },
  {
    image: 'https://d64gsuwffb70l.cloudfront.net/69e151eeabc82c9459d80766_1776374591945_4f7b16de.png',
    eyebrow: { en: 'CUSTOM FABRICATION', sq: 'PRODHIM ME POROSI' },
    title: { en: 'Built to Specification. Made to Last.', sq: 'Ndërtuar sipas Specifikimit. Bërë për të Zgjatur.' },
    subtitle: { en: 'From concept to installation — fully bespoke stainless steel engineering.', sq: 'Nga koncepti në instalim — inxhinieri inox tërësisht e personalizuar.' },
  },
  {
    image: 'https://d64gsuwffb70l.cloudfront.net/69e151eeabc82c9459d80766_1776374621180_5ca612e1.png',
    eyebrow: { en: 'HOTEL & RESTAURANT', sq: 'HOTEL & RESTORANT' },
    title: { en: 'Commercial Kitchens, Turnkey Solutions', sq: 'Kuzhina Komerciale, Zgjidhje Kyç në Dorë' },
    subtitle: { en: 'Complete professional kitchen installations for hotels, restaurants, and hospitality.', sq: 'Instalime të plota për hotele, restorante dhe mikpritje.' },
  },
  {
    image: 'https://d64gsuwffb70l.cloudfront.net/69e151eeabc82c9459d80766_1776374643291_f7942c1c.png',
    eyebrow: { en: 'BAKERY & BUTCHER', sq: 'FURRA & MISHTORE' },
    title: { en: 'Specialized Equipment for Every Trade', sq: 'Pajisje të Specializuara për Çdo Profesion' },
    subtitle: { en: 'Purpose-built workstations for bakeries, butchers, and food production.', sq: 'Stacione pune për furra, mishtore dhe prodhim ushqimi.' },
  },
];

export const CATEGORIES = [
  { id: 'cutlery', name: { en: 'Cutlery', sq: 'Takëm' }, count: 48, image: 'https://d64gsuwffb70l.cloudfront.net/69e151eeabc82c9459d80766_1776374675311_fab23642.png' },
  { id: 'serving', name: { en: 'Plates & Serving', sq: 'Pjata & Shërbim' }, count: 64, image: 'https://d64gsuwffb70l.cloudfront.net/69e151eeabc82c9459d80766_1776374717911_ed51f807.png' },
  { id: 'shelves', name: { en: 'Stainless Steel Shelves', sq: 'Rafte Inox' }, count: 32, image: 'https://d64gsuwffb70l.cloudfront.net/69e151eeabc82c9459d80766_1776374750605_e7165cd6.jpg' },
  { id: 'equipment', name: { en: 'Industrial Kitchen Equipment', sq: 'Pajisje Industriale' }, count: 86, image: 'https://d64gsuwffb70l.cloudfront.net/69e151eeabc82c9459d80766_1776374809973_aea00dc2.png' },
  { id: 'bakery', name: { en: 'Bakery Solutions', sq: 'Zgjidhje për Furra' }, count: 24, image: 'https://d64gsuwffb70l.cloudfront.net/69e151eeabc82c9459d80766_1776374857707_e075497f.png' },
  { id: 'butcher', name: { en: 'Butcher Solutions', sq: 'Zgjidhje për Mishtore' }, count: 18, image: 'https://d64gsuwffb70l.cloudfront.net/69e151eeabc82c9459d80766_1776374875434_66280328.jpg' },
  { id: 'restaurant', name: { en: 'Restaurant Solutions', sq: 'Zgjidhje për Restorante' }, count: 52, image: 'https://d64gsuwffb70l.cloudfront.net/69e151eeabc82c9459d80766_1776374946646_74fa48d3.jpg' },
  { id: 'hotel', name: { en: 'Hotel Solutions', sq: 'Zgjidhje për Hotele' }, count: 38, image: 'https://d64gsuwffb70l.cloudfront.net/69e151eeabc82c9459d80766_1776374963758_44c9cf44.jpg' },
  { id: 'sinks', name: { en: 'Sinks & Work Tables', sq: 'Lavamanë & Tavolina' }, count: 42, image: 'https://d64gsuwffb70l.cloudfront.net/69e151eeabc82c9459d80766_1776374769787_ff687c9c.png' },
  { id: 'custom', name: { en: 'Custom Inox Production', sq: 'Prodhim Inox me Porosi' }, count: 0, image: 'https://d64gsuwffb70l.cloudfront.net/69e151eeabc82c9459d80766_1776375004777_8d2fdf53.jpg' },
];

export type Product = {
  id: string;
  name: { en: string; sq: string };
  category: string;
  price: number | null; // null = request quote
  image: string;
  spec: { en: string; sq: string };
  material: string;
  dimensions: string;
  sku: string;
  stock: number;
  featured?: boolean;
  bestSeller?: boolean;
  newArrival?: boolean;
  type: 'direct' | 'quote' | 'custom';
};

export const PRODUCTS: Product[] = [
  { id: 'p1', name: { en: 'Professional Dinner Fork', sq: 'Pirun Profesional' }, category: 'cutlery', price: 4.90, image: 'https://d64gsuwffb70l.cloudfront.net/69e151eeabc82c9459d80766_1776374675311_fab23642.png', spec: { en: 'AISI 304 · Satin Finish · 205mm', sq: 'AISI 304 · Satin · 205mm' }, material: 'AISI 304', dimensions: '205 × 25 × 3mm', sku: 'CUT-FRK-001', stock: 480, featured: true, bestSeller: true, type: 'direct' },
  { id: 'p2', name: { en: 'Table Spoon 18/10', sq: 'Lugë Tavoline 18/10' }, category: 'cutlery', price: 4.50, image: 'https://d64gsuwffb70l.cloudfront.net/69e151eeabc82c9459d80766_1776374697234_568eab65.png', spec: { en: 'AISI 304 · Mirror Polish · 200mm', sq: 'AISI 304 · Pasqyrë · 200mm' }, material: 'AISI 304', dimensions: '200 × 42 × 3mm', sku: 'CUT-SPN-001', stock: 520, featured: true, bestSeller: true, type: 'direct' },
  { id: 'p3', name: { en: 'Round Serving Plate 28cm', sq: 'Pjatë Shërbimi Rrumbullake 28cm' }, category: 'serving', price: 18.90, image: 'https://d64gsuwffb70l.cloudfront.net/69e151eeabc82c9459d80766_1776374717911_ed51f807.png', spec: { en: 'Brushed Inox · Ø280mm', sq: 'Inox i Brushuar · Ø280mm' }, material: 'AISI 304', dimensions: 'Ø280 × 20mm', sku: 'SRV-PLT-028', stock: 145, featured: true, newArrival: true, type: 'direct' },
  { id: 'p4', name: { en: 'Rectangular Serving Tray', sq: 'Tabaka Drejtkëndëshe' }, category: 'serving', price: 24.50, image: 'https://d64gsuwffb70l.cloudfront.net/69e151eeabc82c9459d80766_1776374733967_e756004a.jpg', spec: { en: 'Polished Edges · 450×320mm', sq: 'Buza të Lëmuara · 450×320mm' }, material: 'AISI 304', dimensions: '450 × 320 × 25mm', sku: 'SRV-TRY-450', stock: 88, featured: true, type: 'direct' },
  { id: 'p5', name: { en: 'Heavy-Duty 4-Tier Shelving', sq: 'Raft 4 Nivele i Fortë' }, category: 'shelves', price: 389.00, image: 'https://d64gsuwffb70l.cloudfront.net/69e151eeabc82c9459d80766_1776374750605_e7165cd6.jpg', spec: { en: 'Load 200kg/shelf · 1800×400×1800', sq: 'Mbajtje 200kg · 1800×400×1800' }, material: 'AISI 304', dimensions: '1800 × 400 × 1800mm', sku: 'SHL-4T-1800', stock: 24, featured: true, bestSeller: true, type: 'direct' },
  { id: 'p6', name: { en: 'Single Basin Commercial Sink', sq: 'Lavaman Komercial një Vaskë' }, category: 'sinks', price: 529.00, image: 'https://d64gsuwffb70l.cloudfront.net/69e151eeabc82c9459d80766_1776374769787_ff687c9c.png', spec: { en: 'With Drainboard · 1200×600mm', sq: 'Me Pjatë Kullimi · 1200×600mm' }, material: 'AISI 304 · 1.2mm', dimensions: '1200 × 600 × 900mm', sku: 'SNK-1B-1200', stock: 16, featured: true, newArrival: true, type: 'direct' },
  { id: 'p7', name: { en: 'Industrial Work Table', sq: 'Tavolinë Pune Industriale' }, category: 'sinks', price: 449.00, image: 'https://d64gsuwffb70l.cloudfront.net/69e151eeabc82c9459d80766_1776374790151_2f6051e1.png', spec: { en: 'Undershelf · 1500×700×900', sq: 'Me Raft Poshtë · 1500×700×900' }, material: 'AISI 304 · 1.2mm', dimensions: '1500 × 700 × 900mm', sku: 'WTB-1500', stock: 32, featured: true, bestSeller: true, type: 'direct' },
  { id: 'p8', name: { en: 'Mobile Prep Station', sq: 'Stacion Pune i Lëvizshëm' }, category: 'equipment', price: 689.00, image: 'https://d64gsuwffb70l.cloudfront.net/69e151eeabc82c9459d80766_1776374809973_aea00dc2.png', spec: { en: 'Wheeled · Lockable · 1200×600', sq: 'Me Rrota · I Kyçur · 1200×600' }, material: 'AISI 304', dimensions: '1200 × 600 × 900mm', sku: 'PRP-MOB-1200', stock: 12, featured: true, newArrival: true, type: 'direct' },
  { id: 'p9', name: { en: 'Double Basin Sink Station', sq: 'Lavaman me Dy Vaska' }, category: 'sinks', price: 849.00, image: 'https://d64gsuwffb70l.cloudfront.net/69e151eeabc82c9459d80766_1776374835130_17a184f3.jpg', spec: { en: '2 Basins · 1600×700mm', sq: '2 Vaska · 1600×700mm' }, material: 'AISI 304 · 1.5mm', dimensions: '1600 × 700 × 900mm', sku: 'SNK-2B-1600', stock: 9, type: 'direct' },
  { id: 'p10', name: { en: 'Commercial Dough Mixer 40L', sq: 'Mikser Brumi 40L' }, category: 'bakery', price: null, image: 'https://d64gsuwffb70l.cloudfront.net/69e151eeabc82c9459d80766_1776374857707_e075497f.png', spec: { en: '3-speed · Stainless bowl · 40L', sq: '3 shpejtësi · Tas inox · 40L' }, material: 'AISI 304', dimensions: '600 × 780 × 1200mm', sku: 'BKY-MIX-40', stock: 4, featured: true, type: 'quote' },
  { id: 'p11', name: { en: 'Butcher Prep Station with Hooks', sq: 'Tavolinë Mishtarie me Grepa' }, category: 'butcher', price: null, image: 'https://d64gsuwffb70l.cloudfront.net/69e151eeabc82c9459d80766_1776374875434_66280328.jpg', spec: { en: 'Hooks + HDPE top · 2000×800', sq: 'Grepa + HDPE · 2000×800' }, material: 'AISI 304 + HDPE', dimensions: '2000 × 800 × 1900mm', sku: 'BTC-PRP-2000', stock: 3, type: 'quote' },
  { id: 'p12', name: { en: 'Professional Chef Knife 25cm', sq: 'Thikë Kuzhinieri 25cm' }, category: 'cutlery', price: 89.00, image: 'https://d64gsuwffb70l.cloudfront.net/69e151eeabc82c9459d80766_1776374894664_007d9434.png', spec: { en: 'Forged · German steel · 250mm', sq: 'Farkëtuar · Çelik gjerman · 250mm' }, material: 'X50CrMoV15', dimensions: '250mm blade', sku: 'CUT-KNF-250', stock: 64, bestSeller: true, newArrival: true, type: 'direct' },
];

export const PROJECTS = [
  { id: 'pr1', image: 'https://d64gsuwffb70l.cloudfront.net/69e151eeabc82c9459d80766_1776374911525_af4ebf5a.jpg', title: { en: 'Artisan Bakery · Tirana', sq: 'Furrë Artizanale · Tiranë' }, category: 'bakery' },
  { id: 'pr2', image: 'https://d64gsuwffb70l.cloudfront.net/69e151eeabc82c9459d80766_1776374927513_ff4e3637.jpg', title: { en: 'Butcher Workspace · Durrës', sq: 'Mishtore · Durrës' }, category: 'butcher' },
  { id: 'pr3', image: 'https://d64gsuwffb70l.cloudfront.net/69e151eeabc82c9459d80766_1776374946646_74fa48d3.jpg', title: { en: 'Restaurant Line · Prishtina', sq: 'Kuzhinë Restoranti · Prishtinë' }, category: 'restaurant' },
  { id: 'pr4', image: 'https://d64gsuwffb70l.cloudfront.net/69e151eeabc82c9459d80766_1776374963758_44c9cf44.jpg', title: { en: 'Hotel Back-of-House · Saranda', sq: 'Kuzhinë Hoteli · Sarandë' }, category: 'hotel' },
  { id: 'pr5', image: 'https://d64gsuwffb70l.cloudfront.net/69e151eeabc82c9459d80766_1776374985331_86734fe5.jpg', title: { en: 'Warehouse Shelving · Shkodër', sq: 'Rafte Magazine · Shkodër' }, category: 'shelves' },
  { id: 'pr6', image: 'https://d64gsuwffb70l.cloudfront.net/69e151eeabc82c9459d80766_1776375004777_8d2fdf53.jpg', title: { en: 'Custom Workstations · Vlorë', sq: 'Stacione me Porosi · Vlorë' }, category: 'custom' },
];

export const TRANSLATIONS = {
  en: {
    nav: { home: 'Home', shop: 'Shop', categories: 'Categories', projects: 'Projects', custom: 'Custom Manufacturing', about: 'About', contact: 'Contact', admin: 'Admin' },
    hero: { shopNow: 'Shop Now', requestQuote: 'Request Custom Quote' },
    common: { addToCart: 'Add to Cart', requestQuote: 'Request Quote', viewAll: 'View All', viewProduct: 'View Product', wishlist: 'Wishlist', cart: 'Cart', search: 'Search products...', price: 'Price', from: 'from', inStock: 'In Stock', lowStock: 'Low Stock', outOfStock: 'Out of Stock', sku: 'SKU', material: 'Material', dimensions: 'Dimensions', quantity: 'Quantity', total: 'Total', subtotal: 'Subtotal', checkout: 'Checkout', continueShopping: 'Continue Shopping', empty: 'Your cart is empty', remove: 'Remove', newArrival: 'NEW', bestSeller: 'BEST SELLER', featured: 'FEATURED' },
    sections: { featuredCategories: 'Featured Categories', browseByCategory: 'Browse by Category', bestSellers: 'Best Sellers', newArrivals: 'New Arrivals', featuredProducts: 'Featured Products', ourProjects: 'Recent Projects', customTitle: 'Custom Manufacturing', customDesc: 'From concept to installation — bespoke stainless steel solutions engineered to your exact specifications. Bakeries, butchers, restaurants, hotels.', requestOffer: 'Request Custom Offer', contactUs: 'Contact Us', trustTitle: 'Engineered for Excellence', introTitle: 'Precision Inox Manufacturing Since 2008', introDesc: 'We engineer and manufacture premium stainless steel solutions — from individual cutlery to turnkey professional kitchens. Every weld, every edge, every surface finished to industrial specification.' },
    trust: { quality: 'Premium Inox Quality', qualityDesc: 'AISI 304 & 316 grade steel', custom: 'Custom Manufacturing', customDesc: 'Bespoke to exact specification', fast: 'Fast Production', fastDesc: 'Lead times from 7 days', install: 'Professional Installation', installDesc: 'Certified on-site teams', support: 'Reliable Support', supportDesc: '24/7 technical assistance' },
    footer: { tagline: 'Stainless steel excellence for professional kitchens and industry.', quickLinks: 'Quick Links', contactInfo: 'Contact', newsletter: 'Newsletter', newsletterDesc: 'Industry insights and new arrivals.', subscribe: 'Subscribe', yourEmail: 'Your email', rights: 'All rights reserved.' },
    header: { signIn: 'Sign In', signUp: 'Sign Up', myAccount: 'My Account', orders: 'Orders', settings: 'Settings', adminPanel: 'Admin Panel', signOut: 'Sign Out', backToStore: 'Back to Store' },
    admin: {
      nav: { dashboard: 'Dashboard', products: 'Products', orders: 'Orders', quoteRequests: 'Quote Requests', usersRoles: 'Users & Roles', settings: 'Settings' },
      panel: { adminPanel: 'Admin Panel', signedInAs: 'Signed In As', adminUser: 'Admin User', superAdmin: 'Super Admin', logout: 'Logout', backToStore: 'Back to Store', kitchenMfg: 'Jasin Metal' },
      dashboard: { title: 'Dashboard', welcome: "Welcome back. Here's what's happening today.", last30Days: 'Last 30 days', last7Days: 'Last 7 days', today: 'Today', custom: 'Custom', revenueOverview: 'Revenue Overview', recentOrders: 'Recent Orders', topSellingProducts: 'Top Selling Products', viewAll: 'View all', lowStockAlert: 'Low Stock Alert', lowStockMsg: '3 products are running low: Butcher Prep Station (3 units), Commercial Mixer 40L (4 units), Double Basin Sink (9 units).' },
      stats: { todaySales: 'Today Sales', thisWeek: 'This Week', thisMonth: 'This Month', pendingOrders: 'Pending Orders', new: '4 new' },
      products: { title: 'Products', addProduct: 'Add Product', searchProducts: 'Search products...', allCategories: 'All Categories', product: 'Product', sku: 'SKU', category: 'Category', price: 'Price', stock: 'Stock', status: 'Status', active: 'Active' },
      orders: { title: 'Orders', order: 'Order', customer: 'Customer', date: 'Date', total: 'Total', status: 'Status', all: 'All', new: 'New', paid: 'Paid', processing: 'Processing', inProduction: 'In Production', ready: 'Ready', shipped: 'Shipped', delivered: 'Delivered', cancelled: 'Cancelled' },
      quotes: { title: 'Quote Requests', id: 'ID', client: 'Client', business: 'Business', project: 'Project', date: 'Date', status: 'Status', new: 'New', inReview: 'In Review', offerSent: 'Offer Sent', converted: 'Converted', rejected: 'Rejected' },
      users: { title: 'Users & Roles', addUser: 'Add User', user: 'User', email: 'Email', role: 'Role', status: 'Status', permissions: 'Permissions: Products, Orders, Quotes, Analytics', active: 'Active', suspended: 'Suspended' },
      settings: { title: 'Settings', company: 'Company', shipping: 'Shipping & Tax', payments: 'Payments', homepage: 'Homepage', seoSocial: 'SEO & Social', companyName: 'Company Name', email: 'Email', phone: 'Phone', whatsapp: 'WhatsApp', address: 'Address', languages: 'Languages', freeShippingThreshold: 'Free Shipping Threshold', standardShippingRate: 'Standard Shipping Rate', vat: 'VAT %', deliveryZones: 'Delivery Zones', metaTitle: 'Meta Title', metaDescription: 'Meta Description', saveChanges: 'Save Changes', addLanguage: '+ Add', featuredProducts: '8 products selected', homepageSlider: 'Homepage Slider Images', featuredCategoriesLabel: 'Featured Categories', featuredProductsLabel: 'Featured Products' },
    },
  },
  sq: {
    nav: { home: 'Ballina', shop: 'Dyqani', categories: 'Kategoritë', projects: 'Projektet', custom: 'Prodhim me Porosi', about: 'Rreth Nesh', contact: 'Kontakt', admin: 'Admin' },
    hero: { shopNow: 'Bli Tani', requestQuote: 'Kërko Ofertë me Porosi' },
    common: { addToCart: 'Shto në Shportë', requestQuote: 'Kërko Ofertë', viewAll: 'Shiko të Gjitha', viewProduct: 'Shiko Produktin', wishlist: 'Të Preferuarat', cart: 'Shporta', search: 'Kërko produkte...', price: 'Çmimi', from: 'nga', inStock: 'Në Stok', lowStock: 'Stok i Ulët', outOfStock: 'Jashtë Stoku', sku: 'Kodi', material: 'Materiali', dimensions: 'Përmasat', quantity: 'Sasia', total: 'Totali', subtotal: 'Nëntotali', checkout: 'Paguaj', continueShopping: 'Vazhdo Blerjet', empty: 'Shporta juaj është bosh', remove: 'Hiq', newArrival: 'I RI', bestSeller: 'MË I SHITUR', featured: 'I ZGJEDHUR' },
    sections: { featuredCategories: 'Kategoritë e Zgjedhura', browseByCategory: 'Shfleto sipas Kategorisë', bestSellers: 'Më të Shiturat', newArrivals: 'Të Sapoardhura', featuredProducts: 'Produktet e Zgjedhura', ourProjects: 'Projekte të Fundit', customTitle: 'Prodhim me Porosi', customDesc: 'Nga koncepti në instalim — zgjidhje inox të prodhuara sipas specifikimeve tuaja. Furra, mishtore, restorante, hotele.', requestOffer: 'Kërko Ofertë', contactUs: 'Na Kontaktoni', trustTitle: 'Projektuar për Përsosmëri', introTitle: 'Prodhim Preciz Inox që nga 2008', introDesc: 'Projektojmë dhe prodhojmë zgjidhje inox premium — nga takëm individual deri në kuzhina profesionale kyç në dorë. Çdo saldim, çdo buzë, çdo sipërfaqe e përfunduar sipas specifikimit industrial.' },
    trust: { quality: 'Cilësi Premium Inox', qualityDesc: 'Çelik AISI 304 & 316', custom: 'Prodhim me Porosi', customDesc: 'Sipas specifikimit tuaj', fast: 'Prodhim i Shpejtë', fastDesc: 'Afate nga 7 ditë', install: 'Instalim Profesional', installDesc: 'Ekipe të certifikuara', support: 'Mbështetje e Besueshme', supportDesc: 'Asistencë 24/7' },
    footer: { tagline: 'Përsosmëri inox për kuzhina profesionale dhe industri.', quickLinks: 'Lidhje të Shpejta', contactInfo: 'Kontakt', newsletter: 'Newsletter', newsletterDesc: 'Risi dhe produkte të reja.', subscribe: 'Abonohu', yourEmail: 'Email-i juaj', rights: 'Të gjitha të drejtat e rezervuara.' },
    header: { signIn: 'Hyr', signUp: 'Regjistrohu', myAccount: 'Llogaria Ime', orders: 'Porositë', settings: 'Cilësimet', adminPanel: 'Paneli Admin', signOut: 'Dil', backToStore: 'Kthehu në Dyqan' },
    admin: {
      nav: { dashboard: 'Paneli', products: 'Produktet', orders: 'Porositë', quoteRequests: 'Kërkesat për Ofertë', usersRoles: 'Përdoruesit & Rolet', settings: 'Cilësimet' },
      panel: { adminPanel: 'PANELI ADMIN', signedInAs: 'I KYÇUR SI', adminUser: 'Përdoruesi Admin', superAdmin: 'Super Admin', logout: 'Dil', backToStore: 'KTHEHU NË DYQAN', kitchenMfg: 'Jasin Metal' },
      dashboard: { title: 'Paneli', welcome: 'Mirësevini. Ja çfarë po ndodh sot.', last30Days: '30 ditët e fundit', last7Days: '7 ditët e fundit', today: 'Sot', custom: 'Me porosi', revenueOverview: 'Pasqyra e të Ardhurave', recentOrders: 'Porositë e Fundit', topSellingProducts: 'Produktet Më të Shitura', viewAll: 'Shiko të gjitha', lowStockAlert: 'Sinjal Stoku të Ulët', lowStockMsg: '3 produkte janë në nivel të ulët: Tavolinë Mishtarie (3 njësi), Mikser Brumi 40L (4 njësi), Lavaman me Dy Vaska (9 njësi).' },
      stats: { todaySales: 'Shitjet Sot', thisWeek: 'Kjo Javë', thisMonth: 'Ky Muaj', pendingOrders: 'Porosi në Pritje', new: '4 të reja' },
      products: { title: 'Produktet', addProduct: 'Shto Produkt', searchProducts: 'Kërko produkte...', allCategories: 'Të gjitha Kategoritë', product: 'Produkti', sku: 'Kodi', category: 'Kategoria', price: 'Çmimi', stock: 'Stoku', status: 'Statusi', active: 'Aktiv' },
      orders: { title: 'Porositë', order: 'Porosia', customer: 'Klienti', date: 'Data', total: 'Totali', status: 'Statusi', all: 'Të gjitha', new: 'Të reja', paid: 'Paguar', processing: 'Në Procesim', inProduction: 'Në Prodhim', ready: 'Gati', shipped: 'Dërguar', delivered: 'Dorëzuar', cancelled: 'Anuluar' },
      quotes: { title: 'Kërkesat për Ofertë', id: 'ID', client: 'Klienti', business: 'Biznesi', project: 'Projekti', date: 'Data', status: 'Statusi', new: 'E Re', inReview: 'Në Shqyrtim', offerSent: 'Oferta Dërguar', converted: 'Konvertuar', rejected: 'Refuzuar' },
      users: { title: 'Përdoruesit & Rolet', addUser: 'Shto Përdorues', user: 'Përdoruesi', email: 'Email', role: 'Roli', status: 'Statusi', permissions: 'Lejet: Produktet, Porositë, Ofertat, Analitika', active: 'Aktiv', suspended: 'Pezulluar' },
      settings: { title: 'Cilësimet', company: 'Kompania', shipping: 'Transporti & TVSH', payments: 'Pagesat', homepage: 'Faqja Kryesore', seoSocial: 'SEO & Social', companyName: 'Emri i Kompanisë', email: 'Email', phone: 'Telefoni', whatsapp: 'WhatsApp', address: 'Adresa', languages: 'Gjuhët', freeShippingThreshold: 'Pragu i Transportit Falas', standardShippingRate: 'Tarifa Standarde e Transportit', vat: 'TVSH %', deliveryZones: 'Zonat e Dorëzimit', metaTitle: 'Titulli Meta', metaDescription: 'Përshkrimi Meta', saveChanges: 'Ruaj Ndryshimet', addLanguage: '+ Shto', featuredProducts: '8 produkte të zgjedhura', homepageSlider: 'Imazhet e Sliderit', featuredCategoriesLabel: 'Kategoritë e Zgjedhura', featuredProductsLabel: 'Produktet e Zgjedhura' },
    },
  },
};

export type Lang = 'en' | 'sq';
