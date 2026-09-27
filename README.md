# Uncle's Chinese - Smart QR Dining & Kitchen Management System

> Contactless QR dining, live table ordering, KOT Kitchen Display System (KDS), and waiter service call console for Uncle's Chinese Restaurant.

---

## 🌟 Key Features

### 1. 📱 Contactless Customer QR Ordering
- **Categorized Digital Menu**: Veg, Non-Veg, and Egg sections spanning Soups, Starters, Rice, and Noodles.
- **Portion Flexibility**: Choose between Half and Full portions with live recalculations.
- **High-Fidelity Dish Photos**: Photorealistic culinary images mapped accurately to each dish name.
- **Dietary & Taste Markers**: Clear green/yellow/red diet indicators, spicy markers, and Uncle's Special badges.
- **Custom Cooking Instructions**: Add notes (e.g. "less spicy", "extra crispy").
- **Live Cart & Order Tracker**: Step-by-step progress tracking (*Received → Preparing → Ready → Served*).

### 2. 🛎️ Table Service & Call Waiter
- One-tap quick requests:
  - 💧 Request Drinking Water
  - 🍴 Extra Cutlery & Bowls
  - 🧾 Request Final Bill / Check
  - 🙋 Call Captain / Waiter to Table

### 3. 👨‍🍳 Kitchen Display System (KDS)
- Real-time kitchen order tickets (KOT).
- Order filtering (*Active*, *Preparing*, *Ready*, *Delivered*).
- Sound alerts on incoming tickets.
- Instant item status transitions with elapsed preparation timers.

### 4. 🤵 Waiter & Floor Staff Console
- Real-time floor plan and table occupancy status (*Vacant*, *Occupied*, *Calling Waiter*, *Bill Requested*).
- Immediate notifications when customers press table assistance buttons.
- Direct table order placement and ticket management.

### 5. 🏷️ Printable Table QR Acrylic Stands
- Built-in table stand generator for all dining tables.
- Branded printable cards with scannable QR codes linking directly to each table's menu.
- Built-in camera QR scanner supporting real-time video decoding.

---

## 🛠️ Tech Stack

- **Framework**: [React 19](https://react.dev/) + [Vite](https://vitejs.dev/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Animation**: [Motion](https://motion.dev/)
- **QR Engine**: [qrcode](https://www.npmjs.com/package/qrcode) & [jsQR](https://github.com/cozmo/jsQR)

---

## 🚀 Quick Start (Local Development)

### Prerequisites
- Node.js 18+ or 20+
- npm (or yarn / pnpm)

### Install & Run
```bash
# 1. Clone the repository
git clone https://github.com/G1OUL/Restruant.git
cd Restruant

# 2. Install dependencies
npm install

# 3. Start local development server
npm run dev
```

Visit `http://localhost:3000` in your browser.

### Build for Production
```bash
npm run build
```
The compiled, production-ready static assets will be in the `dist/` directory.

---

## 🌐 How to Deploy Live to GitHub & The Web

### Option A: Deploy to GitHub Pages (Automated via GitHub Actions)

This repository includes a pre-configured GitHub Actions workflow in `.github/workflows/deploy.yml`.

1. **Push your code to GitHub**:
   ```bash
   git add .
   git commit -m "feat: complete Uncle's Chinese QR ordering & kitchen system"
   git branch -M main
   git remote add origin https://github.com/G1OUL/Restruant.git
   git push -u origin main
   ```
2. **Enable GitHub Pages in your repository settings**:
   - Go to your repository on GitHub: `https://github.com/G1OUL/Restruant`
   - Click **Settings** → **Pages** (in the left sidebar).
   - Under **Build and deployment** → **Source**, select **GitHub Actions**.
3. **Done!** The workflow will automatically build and publish your site at:
   `https://g1oul.github.io/Restruant/`

---

### Option B: Deploy to Vercel (Recommended 1-Click Zero Config)

1. Go to [vercel.com](https://vercel.com/) and sign in with your GitHub account.
2. Click **"Add New Project"** and select `Restruant` (or your repository name).
3. Framework Preset will automatically detect **Vite**.
4. Click **Deploy**. Your site will be live with free global CDN and SSL in under 1 minute.

---

### Option C: Deploy to Netlify

1. Go to [netlify.com](https://www.netlify.com/) and click **"Add new site"** → **"Import an existing project"**.
2. Connect your GitHub repository `Restruant`.
3. Set Build settings:
   - **Build command**: `npm run build`
   - **Publish directory**: `dist`
4. Click **Deploy Site**.

---

## 📁 Project Structure

```
├── .github/
│   └── workflows/
│       └── deploy.yml          # Automated GitHub Pages CI/CD workflow
├── src/
│   ├── assets/
│   │   └── images/             # Culinary food photography assets
│   ├── components/
│   │   ├── common/             # Reusable UI & FoodImage components
│   │   ├── customer/           # Customer ordering, cart, tracker, filters
│   │   ├── kitchen/            # Live Kitchen Display System (KDS)
│   │   ├── layout/             # Top navbar, role switchers, branding
│   │   ├── qr/                 # Table QR generator & camera scanner
│   │   └── waiter/             # Waiter console & table status tracker
│   ├── context/
│   │   └── RestaurantContext.tsx # Centralized state management
│   ├── data/
│   │   ├── foodAssets.ts       # Image mappings & dish name matcher
│   │   └── restaurantData.ts   # Comprehensive menu & restaurant metadata
│   ├── types/
│   │   └── index.ts            # TypeScript interfaces & types
│   ├── App.tsx
│   ├── index.css
│   └── main.tsx
├── index.html
├── package.json
├── tsconfig.json
└── vite.config.ts
```

---

## 📜 License

Created for Uncle's Chinese Restaurant. All rights reserved.
