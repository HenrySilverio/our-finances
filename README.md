# 💑 Our Finances – Design System with MongoDB Integration

A modern, accessible, and minimalist **design system** for financial planning apps built specifically for couples.  
Crafted using **Next.js**, **TypeScript**, **TailwindCSS**, and integrated with **MongoDB**.

![Our Finances Logo](public/logo.png)

---

## 📖 Overview

**Our Finances** is designed to help couples manage their shared and individual finances with clarity and harmony. It provides:

- 🎨 **Minimalist Design** – Clean, elegant UI for all users  
- ♿ **Accessible Components** – WCAG-compliant and keyboard navigable  
- 📱 **Responsive Layouts** – Works beautifully on mobile, tablet, and desktop  
- 🌈 **Visual Harmony** – A soft, welcoming color palette  
- 🧠 **Smart UX** – User-first interactions and flows  
- 🧩 **MongoDB Integration** – Reliable NoSQL data storage  
- 📊 **Monthly Reports** – Insightful analysis and tips

---

## 🎨 Color Palette

| Role              | Color         | Hex Code     |
|-------------------|---------------|--------------|
| Base Light        | Off-white     | `#f5f2d0`    |
| Base Dark         | Dark Blue     | `#000080`    |
| Accent - Success  | Green         | `#2e7d32`    |
| Accent - Danger   | Red           | `#c62828`    |
| Accent - Warning  | Yellow        | `#f9a825`    |
| Accent - Info     | Light Blue    | `#0277bd`    |
| Chart Colors      | 6 total       | Google color scheme |

---

## 🧩 Components

### 🧱 Basic UI

- 🧭 `Header` – Responsive navigation bar  
- 💰 `Dashboard` – Financial overview with charts and cards  
- 📝 `Forms` – Income and expense input  
- 🚨 `Alerts` – Success, error, warning, and info messages  
- 🎯 `Goal Modal` – Set and track shared goals  
- 🔀 `Expense Splitter` – Share costs between partners  

### 🗄️ MongoDB Integration

- 🗓️ `BillingClosingConfig` – Set credit card cycle dates  
- 📅 `MonthlyReport` – Analyze spending, trends & suggestions

---

## ⚙️ Technologies

| Tech         | Description                                      |
|--------------|--------------------------------------------------|
| 🔷 Next.js   | React framework with SSR support                 |
| 🟦 TypeScript| Strong typing for better dev experience          |
| 🎨 Tailwind | Utility-first CSS for fast styling               |
| ⚛️ React     | Component-based UI library                       |
| 🍃 MongoDB   | NoSQL database for flexible storage              |
| 🧠 Mongoose  | Elegant MongoDB object modeling                  |

---

## 📁 Project Structure

our-finances/
├── public/                  # Static assets
├── src/
│   ├── pages/               # App and document structure
│   ├── components/          # Reusable visual components
│   ├── interfaces/          # TypeScript interface definitions
│   ├── models/              # MongoDB Mongoose models
│   ├── lib/                 # Utility and helper files
│   ├── styles/              # Tailwind/global CSS
│   └── theme/               # Custom theme setup (colors, etc)
├── tailwind.config.js       # Tailwind configuration
└── package.json             # Dependencies and scripts

---

## 🚀 Getting Started

```bash
# Clone the project
git clone https://github.com/your-username/our-finances.git
cd our-finances

# Install dependencies
npm install

# Create .env.local and add your MongoDB connection string
echo "MONGODB_URI=your_mongodb_connection_string" > .env.local

# Start the dev server
npm run dev


⸻

🧪 Sample Component Usage

import { Button } from '../components/Button.component';
import { Header } from '../components/Header.component';

<Header 
  title="Our Finances"
  navItems={[
    { label: 'Dashboard', href: '/dashboard' },
    { label: 'Transactions', href: '/transactions' },
    { label: 'Goals', href: '/goals' },
  ]}
  userName="John & Jane"
/>

<Button variant="primary">Get Started</Button>


⸻

🧠 Monthly Report Automation

Use Vercel Cron Jobs or cloud schedulers to automate report generation.
Example using pages/api/cron/monthly-report.ts:

if (req.headers.authorization !== `Bearer ${process.env.CRON_SECRET_KEY}`) {
  return res.status(401).json({ error: 'Unauthorized' });
}


⸻

♿ Accessibility
	•	✅ Color contrast compliance (AA/AAA)
	•	✅ ARIA labels on all interactive components
	•	✅ Full keyboard navigability
	•	✅ Semantic HTML for screen readers

⸻

📱 Responsiveness

Device	Width
📱 Mobile	320px – 639px
📱 Tablet	640px – 1023px
💻 Desktop	1024px +


⸻

🤝 Contributing

We welcome contributions from the community!
Please open an issue or submit a pull request 💬

⸻

📄 License

This project is licensed under the MIT License.
See the LICENSE file for more details.

⸻

💡 Designed for couples. Built for clarity. Powered by open source.