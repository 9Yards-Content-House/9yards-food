export const pageMetadata = {
  // HOME PAGE (/)
  home: {
    title: "9Yards Food | Authentic Ugandan Cuisine Delivery in Kampala | Order Now",
    description: "9Yards Food - Order authentic Ugandan food delivery in Kampala. Fresh matooke, posho, fish, chicken & more. 100% natural ingredients, 30-45 min delivery. Celebrity approved. Order via WhatsApp or pay online.",
    keywords: "9Yards Food, 9yards food, 9 yards food, 9yards, Ugandan food delivery, Kampala food delivery, authentic Ugandan cuisine, matooke delivery, posho, fish combo, chicken delivery, food delivery Kampala, natural juice Uganda",
    ogTitle: "9Yards Food - Authentic Ugandan Cuisine Delivered Fresh to Your Door",
    ogDescription: "9Yards Food delivers from our kitchen to your table in 30-45 minutes. 100% natural ingredients, no preservatives. Trusted by Spice Diana & top influencers.",
    ogImage: "/images/og-home.jpg", // Hero image with food
    canonicalUrl: "https://food.9yards.co.ug/",
    schema: {
      "@context": "https://schema.org",
      "@type": "Restaurant",
      "@id": "https://food.9yards.co.ug/#restaurant",
      "name": "9Yards Food",
      "alternateName": ["9 Yards Food", "9yards", "Nine Yards Food"],
      "image": "https://food.9yards.co.ug/images/logo/9Yards-Food-White-Logo-colored.png",
      "servesCuisine": "Ugandan",
      "priceRange": "UGX 15,000 - 50,000",
      "address": {
        "@type": "PostalAddress",
        "addressLocality": "Kampala",
        "addressCountry": "UG"
      },
      "telephone": "+256708453744", // Updated to match existing SEO.tsx telephone
      "url": "https://food.9yards.co.ug"
    }
  },

  // MENU PAGE (/menu)
  menu: {
    title: "Our Menu | Authentic Ugandan Food Combos, Juices & Desserts | 9Yards Food",
    description: "Browse our complete menu of authentic Ugandan food combos. Choose from matooke, rice, posho + fish, chicken, meat, g-nuts sauce. Add 100% natural juices. Build your perfect combo from UGX 15,000.",
    keywords: "Ugandan food menu, matooke combo, fish and posho, chicken and rice, g-nuts sauce, natural juice Uganda, food menu Kampala, authentic Ugandan dishes, boiled or fried options",
    ogTitle: "9Yards Food Menu - Build Your Perfect Ugandan Combo",
    ogDescription: "Fresh matooke, posho, rice, cassava + your choice of fish, chicken, or meat. Every combo includes a free side dish. 100% natural ingredients.",
    ogImage: "/images/og-menu.jpg", // Multiple dishes layout
    canonicalUrl: "https://food.9yards.co.ug/menu",
    schema: {
      "@context": "https://schema.org",
      "@type": "Menu",
      "@id": "https://food.9yards.co.ug/menu#menu",
      "name": "9Yards Food Menu",
      "description": "Authentic Ugandan cuisine - build your perfect combo meal",
      "inLanguage": "en",
      "hasMenuSection": [
        {
          "@type": "MenuSection",
          "name": "Main Dishes",
          "description": "Choose your base - matooke, rice, posho, or cassava",
          "hasMenuItem": [
            {
              "@type": "MenuItem",
              "name": "Matooke",
              "description": "Steamed green banana, a Ugandan staple",
              "suitableForDiet": "https://schema.org/VeganDiet"
            },
            {
              "@type": "MenuItem",
              "name": "Rice",
              "description": "Fluffy white rice"
            },
            {
              "@type": "MenuItem",
              "name": "Posho",
              "description": "Traditional Ugandan maize meal"
            },
            {
              "@type": "MenuItem",
              "name": "Cassava",
              "description": "Boiled or fried cassava"
            }
          ]
        },
        {
          "@type": "MenuSection",
          "name": "Sauces & Proteins",
          "description": "Add your protein and sauce",
          "hasMenuItem": [
            {
              "@type": "MenuItem",
              "name": "Tilapia Fish",
              "description": "Fresh Nile Tilapia, fried or steamed",
              "offers": {
                "@type": "Offer",
                "price": "15000",
                "priceCurrency": "UGX"
              }
            },
            {
              "@type": "MenuItem",
              "name": "Chicken",
              "description": "Tender chicken pieces in sauce",
              "offers": {
                "@type": "Offer",
                "price": "18000",
                "priceCurrency": "UGX"
              }
            },
            {
              "@type": "MenuItem",
              "name": "G-Nuts Sauce",
              "description": "Traditional groundnut sauce",
              "suitableForDiet": "https://schema.org/VeganDiet"
            }
          ]
        },
        {
          "@type": "MenuSection",
          "name": "Natural Juices",
          "description": "100% natural fresh juices",
          "hasMenuItem": [
            {
              "@type": "MenuItem",
              "name": "Passion Fruit Juice",
              "description": "Fresh squeezed passion fruit",
              "offers": {
                "@type": "Offer",
                "price": "5000",
                "priceCurrency": "UGX"
              }
            },
            {
              "@type": "MenuItem",
              "name": "Mango Juice",
              "description": "Fresh mango juice",
              "offers": {
                "@type": "Offer",
                "price": "5000",
                "priceCurrency": "UGX"
              }
            }
          ]
        }
      ]
    }
  },

  // CART PAGE (/cart)
  cart: {
    title: "Your Cart | Review Your Order | 9Yards Food",
    description: "Review your order, apply promo codes, and proceed to checkout. Free delivery on orders above UGX 50,000. Order via WhatsApp or pay online with Mobile Money.",
    keywords: "food cart, order review, promo code Uganda, free delivery Kampala, checkout, WhatsApp order, mobile money payment",
    ogTitle: "Complete Your Order - 9Yards Food",
    ogDescription: "Review your authentic Ugandan meal. Apply promo codes and enjoy free delivery on orders above UGX 50,000.",
    noIndex: true // Cart pages shouldn't be indexed
  },

  // FAVORITES PAGE (/favorites)
  favorites: {
    title: "My Favorites | Saved Items | 9Yards Food",
    description: "Quick access to your favorite Ugandan food combos and dishes. Save time by reordering your go-to meals with one click.",
    keywords: "saved orders, favorite meals, quick reorder, repeat order, favorite Ugandan food",
    ogTitle: "Your Favorite Meals - 9Yards Food",
    noIndex: true // Personal pages shouldn't be indexed
  },

  // DEALS PAGE (/deals)
  deals: {
    title: "Deals & Promo Codes | Special Offers on Ugandan Food | 9Yards Food",
    description: "Save on authentic Ugandan food with exclusive promo codes. Get 10% off first orders (FIRST10), weekend specials (WEEKEND15), free delivery on UGX 50,000+. Limited time offers!",
    keywords: "food promo codes Uganda, Kampala food deals, discount codes, weekend special, first order discount, free delivery offer, food promotions Kampala, FIRST10, WEEKEND15",
    ogTitle: "Exclusive Deals & Promo Codes - 9Yards Food",
    ogDescription: "Serving you more for less. Get 10% off your first order, weekend specials, and free delivery on orders above UGX 50,000. Grab the latest promo codes!",
    ogImage: "/images/og-deals.jpg",
    canonicalUrl: "https://food.9yards.co.ug/deals",
    schema: {
      "@context": "https://schema.org",
      "@type": "Offer",
      "name": "9Yards Food Promotions",
      "description": "Exclusive deals and promo codes for authentic Ugandan food delivery"
    }
  },

  // CONTACT PAGE (/contact)
  contact: {
    title: "Contact Us | Order Support & Inquiries | 9Yards Food Kampala",
    description: "Get in touch with 9Yards Food. Call +256708453744, WhatsApp us, or email info@9yards.co.ug. Order support, bulk orders, catering inquiries. Available daily 10am-10pm.",
    keywords: "contact 9Yards Food, food delivery support Kampala, WhatsApp order Uganda, bulk food orders Kampala, catering services Uganda, 9Yards phone number, customer service",
    ogTitle: "Contact 9Yards Food - We're Here to Help",
    ogDescription: "Have questions? Need support? Call +256708453744, WhatsApp, or email us. We're available daily 10am-10pm for orders and inquiries.",
    canonicalUrl: "https://food.9yards.co.ug/contact",
    schema: {
      "@context": "https://schema.org",
      "@type": "ContactPage",
      "name": "Contact 9Yards Food"
    }
  },

  // HOW IT WORKS PAGE (/how-it-works)
  howItWorks: {
    title: "How It Works | Easy 3-Step Food Ordering | 9Yards Food Delivery",
    description: "Order authentic Ugandan food in 3 easy steps: Choose your combo, customize your meal, order via WhatsApp or pay online. 30-45 minute delivery to your doorstep in Kampala.",
    keywords: "how to order food online Uganda, WhatsApp food order, mobile money payment Uganda, food delivery process, order Ugandan food, easy food ordering Kampala",
    ogTitle: "How 9Yards Food Delivery Works - Simple 3-Step Process",
    ogDescription: "Choose your food → Customize your combo → Order via WhatsApp or pay online. Fresh authentic Ugandan cuisine delivered in 30-45 minutes.",
    ogImage: "/images/og-how-it-works.jpg",
    canonicalUrl: "https://food.9yards.co.ug/how-it-works",
    schema: {
      "@context": "https://schema.org",
      "@type": "HowTo",
      "name": "How to Order from 9Yards Food",
      "step": [
        {
          "@type": "HowToStep",
          "name": "Choose Your Food",
          "text": "Select your main dishes and sauce from our authentic Ugandan menu"
        },
        {
          "@type": "HowToStep",
          "name": "Customize Your Meal",
          "text": "Pick your preparation style, add juices and desserts"
        },
        {
          "@type": "HowToStep",
          "name": "Complete Your Order",
          "text": "Order via WhatsApp or pay online with Mobile Money"
        }
      ]
    }
  },

  // PRIVACY POLICY PAGE (/privacy)
  privacy: {
    title: "Privacy Policy | How We Protect Your Data | 9Yards Food",
    description: "Read 9Yards Food's privacy policy. Learn how we collect, use, and protect your personal information when you order food online. Updated December 2024.",
    keywords: "privacy policy Uganda, data protection, customer information security, online ordering privacy",
    ogTitle: "9Yards Food Privacy Policy",
    noIndex: false, // Keep indexed for trust/transparency
    canonicalUrl: "https://food.9yards.co.ug/privacy"
  },

  // TERMS OF SERVICE PAGE (/terms)
  terms: {
    title: "Terms & Conditions | Service Agreement | 9Yards Food",
    description: "9Yards Food terms of service. Review our ordering policies, delivery terms, payment conditions, and refund policy. Updated December 2024.",
    keywords: "terms and conditions Uganda, service terms, ordering policy, delivery terms, refund policy food delivery",
    ogTitle: "9Yards Food Terms & Conditions",
    noIndex: false,
    canonicalUrl: "https://food.9yards.co.ug/terms"
  },

  // ORDER CONFIRMATION PAGE (/order-confirmation)
  orderConfirmation: {
    title: "Order Confirmed! | Thank You | 9Yards Food",
    description: "Your order has been confirmed. Track your delivery and get updates via WhatsApp. Estimated delivery: 30-45 minutes.",
    keywords: "order confirmation, food delivery tracking, order status Uganda",
    noIndex: true // Confirmation pages shouldn't be indexed
  },

  // ORDER HISTORY PAGE (/order-history)
  orderHistory: {
    title: "Order History | My Past Orders | 9Yards Food",
    description: "View your past orders from 9Yards Food. Quickly reorder your favorite Ugandan meal combos with one click.",
    keywords: "order history, past orders, reorder food, order tracking Uganda",
    noIndex: true // Personal pages shouldn't be indexed
  },

  // 404 NOT FOUND PAGE (*)
  notFound: {
    title: "Page Not Found | 9Yards Food",
    description: "The page you're looking for doesn't exist. Return to our menu to order authentic Ugandan food delivery in Kampala.",
    noIndex: true // 404 pages shouldn't be indexed
  }
};

// SPEAKABLE SCHEMA - For voice search (Google Assistant, Alexa)
export const speakableSchema = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  "speakable": {
    "@type": "SpeakableSpecification",
    "cssSelector": ["h1", "h2", ".hero-description", ".menu-description"]
  },
  "name": "9Yards Food - Authentic Ugandan Cuisine Delivery",
  "description": "Order authentic Ugandan food delivery in Kampala. Fresh matooke, posho, fish, chicken and more. 100% natural ingredients. 30 to 45 minute delivery.",
  "url": "https://food.9yards.co.ug"
};

// FAQ SCHEMA - For use on About, How It Works, or dedicated FAQ page
export const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "What areas do you deliver to in Kampala?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "We deliver to Kampala Central, Nakawa, Kololo, Muyenga, Ntinda, Bukoto, Kisaasi, Naguru, Bugolobi, and surrounding areas. Delivery fees range from UGX 5,000 to UGX 10,000 depending on location."
      }
    },
    {
      "@type": "Question",
      "name": "How long does delivery take?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Standard delivery takes 30-45 minutes. During peak hours (12-2pm, 6-8pm), delivery may take 45-60 minutes. We'll always keep you updated via WhatsApp."
      }
    },
    {
      "@type": "Question",
      "name": "What payment methods do you accept?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "We accept Mobile Money (MTN, Airtel), Cash on Delivery, and online card payments via Flutterwave."
      }
    },
    {
      "@type": "Question",
      "name": "Is the food freshly prepared?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Yes! All meals are freshly prepared with 100% natural ingredients. We use no preservatives or artificial additives. Food is cooked to order and delivered hot."
      }
    },
    {
      "@type": "Question",
      "name": "Do you offer free delivery?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Yes! Orders above UGX 50,000 qualify for free delivery within our standard delivery zones. Use promo code FREESHIP for free delivery on any order."
      }
    },
    {
      "@type": "Question",
      "name": "Can I customize my order?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Absolutely! You can choose your main dish (matooke, rice, posho, cassava), protein (fish, chicken, beef), sauce (g-nuts, vegetables), and preparation style (boiled, fried, steamed)."
      }
    }
  ]
};

// GLOBAL METADATA (Applied to all pages)
export const globalMetadata = {
  siteName: "9Yards Food",
  twitterCard: "summary_large_image",
  twitterSite: "@9yardsfood", // Update with actual handle
  themeColor: "#212282", // 9Yards blue
  viewport: "width=device-width, initial-scale=1, maximum-scale=5",
  locale: "en_UG",
  alternateName: "9Yards Food Delivery Uganda",
  
  // Verification for Search Console
  verification: {
    google: "QDT0bvNomFsJHjx50qFwFZJc0MgLW_ULO3JolmgDxds", 
  },
  
  // Marketing & Analytics
  marketing: {
    googleAnalyticsId: "G-1V70QJ2GCY",
  },

  // WebSite Schema for Brand Search & Sitelinks
  websiteSchema: {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": "https://food.9yards.co.ug/#website",
    "url": "https://food.9yards.co.ug",
    "name": "9Yards Food",
    "alternateName": ["9 Yards Food", "9yards", "Nine Yards Food", "9Yards Food Delivery"],
    "description": "Authentic Ugandan cuisine delivery service in Kampala",
    "publisher": {
      "@id": "https://food.9yards.co.ug/#organization"
    },
    "inLanguage": "en",
    "potentialAction": {
      "@type": "SearchAction",
      "target": {
        "@type": "EntryPoint",
        "urlTemplate": "https://food.9yards.co.ug/menu?search={search_term_string}"
      },
      "query-input": "required name=search_term_string"
    }
  },
  
  // Structured Data - Organization (Enhanced LocalBusiness)
  organizationSchema: {
    "@context": "https://schema.org",
    "@type": ["FoodEstablishment", "LocalBusiness"],
    "@id": "https://food.9yards.co.ug/#organization",
    "name": "9Yards Food",
    "alternateName": ["9 Yards Food", "9yards", "Nine Yards Food", "9Yards Food Delivery", "9Yards Food Uganda"],
    "url": "https://food.9yards.co.ug",
    "logo": {
      "@type": "ImageObject",
      "@id": "https://food.9yards.co.ug/#logo",
      "url": "https://food.9yards.co.ug/images/logo/9Yards-Food-White-Logo-colored.png",
      "contentUrl": "https://food.9yards.co.ug/images/logo/9Yards-Food-White-Logo-colored.png",
      "caption": "9Yards Food Logo",
      "width": 512,
      "height": 512
    },
    "image": [
      "https://food.9yards.co.ug/images/logo/9Yards-Food-White-Logo-colored.png",
      "https://food.9yards.co.ug/images/og-home.jpg",
      "https://food.9yards.co.ug/images/backgrounds/Matooke-Food-9yards-food.webp"
    ],
    "description": "Authentic Ugandan cuisine delivery service in Kampala. Fresh matooke, posho, fish, chicken & more with 100% natural ingredients.",
    "slogan": "From our kitchen to your table",
    "servesCuisine": ["Ugandan", "African", "East African"],
    "priceRange": "UGX 15,000 - 50,000",
    "telephone": "+256708453744",
    "email": "info@9yards.co.ug",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "Kampala",
      "addressLocality": "Kampala",
      "addressRegion": "Central Region",
      "postalCode": "",
      "addressCountry": "UG"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": "0.3476",
      "longitude": "32.5825"
    },
    "areaServed": {
      "@type": "City",
      "name": "Kampala",
      "sameAs": "https://en.wikipedia.org/wiki/Kampala"
    },
    "serviceArea": {
      "@type": "GeoCircle",
      "geoMidpoint": {
        "@type": "GeoCoordinates",
        "latitude": "0.3476",
        "longitude": "32.5825"
      },
      "geoRadius": "15000"
    },
    "paymentAccepted": ["Mobile Money", "Cash on Delivery", "MTN Mobile Money", "Airtel Money"],
    "currenciesAccepted": "UGX",
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.8",
      "reviewCount": "127",
      "bestRating": "5",
      "worstRating": "1"
    },
    "review": [
      {
        "@type": "Review",
        "author": { "@type": "Person", "name": "Sarah K." },
        "reviewRating": { "@type": "Rating", "ratingValue": "5" },
        "reviewBody": "Best Ugandan food in Kampala! The matooke combo is amazing."
      }
    ],
    "sameAs": [
      "https://www.instagram.com/9yards_food/",
      "https://www.tiktok.com/@9yardsfood",
      "https://9yards.co.ug",
      "https://wa.me/256708453744"
    ],
    "openingHoursSpecification": [
      {
        "@type": "OpeningHoursSpecification",
        "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
        "opens": "10:00",
        "closes": "22:00"
      }
    ],
    "acceptsReservations": false,
    "hasMenu": {
      "@type": "Menu",
      "@id": "https://food.9yards.co.ug/menu",
      "name": "9Yards Food Menu",
      "url": "https://food.9yards.co.ug/menu",
      "hasMenuSection": [
        {
          "@type": "MenuSection",
          "name": "Combo Meals",
          "description": "Build your own combo with main dishes, sauces, and sides"
        },
        {
          "@type": "MenuSection",
          "name": "Natural Juices",
          "description": "100% natural fresh juices"
        },
        {
          "@type": "MenuSection",
          "name": "Desserts",
          "description": "Sweet treats to complete your meal"
        }
      ]
    },
    "potentialAction": {
      "@type": "OrderAction",
      "target": {
        "@type": "EntryPoint",
        "urlTemplate": "https://food.9yards.co.ug/menu",
        "actionPlatform": ["http://schema.org/DesktopWebPlatform", "http://schema.org/MobileWebPlatform"]
      },
      "deliveryMethod": "http://purl.org/goodrelations/v1#DeliveryModeOwnFleet"
    },
    "knowsAbout": ["Ugandan cuisine", "Matooke", "Posho", "Rolex", "African food"],
    "foundingDate": "2023",
    "numberOfEmployees": {
      "@type": "QuantitativeValue",
      "minValue": 5,
      "maxValue": 20
    }
  },

  // Additional tags for AI crawlers
  aiMetadata: {
    "robots": "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1",
    "googlebot": "index, follow",
    "bingbot": "index, follow",
    "author": "9Yards Food",
    "generator": "React",
    // Open Graph for AI training
    "og:site_name": "9Yards Food",
    "og:type": "website",
    "og:locale": "en_UG",
    // Additional for ChatGPT, Claude, Grok
    "citation_publisher": "9Yards Food",
    "citation_online_date": "2024/12/15"
  }
};
