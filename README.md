# 9Yards Food

Authentic Ugandan food delivery web application for 9Yards Food - bringing delicious, homemade Ugandan cuisine to doorsteps across Kampala.

## 🍽️ Features

- **Online Menu** - Browse our full menu of authentic Ugandan dishes
- **Smart Cart** - Add items, customize orders, apply promo codes
- **Delivery Coverage** - Real-time delivery zone validation across Kampala
- **Order Tracking** - View order history and status
- **Progressive Web App** - Install on mobile for app-like experience
- **WhatsApp Integration** - Quick order support via WhatsApp

## 🛠️ Tech Stack

- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **UI Components**: Radix UI + shadcn/ui
- **Animations**: Framer Motion
- **Routing**: React Router v6
- **State**: React Context + localStorage persistence

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- npm or pnpm

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## 📁 Project Structure

```
src/
├── components/     # Reusable UI components
│   ├── home/       # Homepage sections
│   ├── layout/     # Header, Footer, Navigation
│   ├── menu/       # Menu-related components
│   └── ui/         # Base UI components (shadcn)
├── context/        # React Context providers
├── data/           # Menu data, SEO metadata
├── hooks/          # Custom React hooks
├── lib/            # Utilities and constants
└── pages/          # Page components
```

## 🌐 Deployment

This project is configured for deployment on **Netlify**.

```bash
# Build command
npm run build

# Publish directory
dist/
```

The `netlify.toml` includes:
- Security headers (X-Frame-Options, CSP, etc.)
- Asset caching for optimal performance
- SPA redirect handling

## 📱 PWA Support

The app is installable as a Progressive Web App on supported devices.

## 📄 License

Private - All rights reserved © 9Yards Food
