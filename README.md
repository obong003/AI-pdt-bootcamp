# NutriTrack - Vanilla Calorie & Macro Tracker

A modern, responsive daily calorie and nutrition tracking web application built entirely with **vanilla HTML, CSS, and JavaScript**.

Zero external dependencies, zero CSS frameworks, no CSS variables, and no backend required — all data is persistently stored in the browser using `localStorage`.

---

## ✨ Features

- **Daily Calorie Dashboard**:
  - Live calculation of consumed vs. remaining calories.
  - Visual progress bar with alert indicator when exceeding daily calorie goal.
- **Macronutrient Tracking**:
  - Breakdown and individual progress meters for **Protein**, **Carbs**, and **Fat**.
- **Categorized Food Logging**:
  - Log entries into **Breakfast**, **Lunch**, **Dinner**, and **Snacks**.
  - Subtotal calorie calculations for each meal category.
  - In-place item editing (✏️) and deletion (🗑️).
- **Quick-Add Presets**:
  - One-click shortcuts for common food items (Boiled Egg, Banana, Chicken Breast, Brown Rice, Greek Yogurt, Protein Shake).
- **Interactive Water Tracker**:
  - 8-cup visual tracker saved on a per-day basis.
- **Date Navigation**:
  - Track nutrition across time with previous/next day controls, calendar date selector, and a quick "Today" shortcut.
- **7-Day Trend Analytics**:
  - Native HTML5 `<canvas>` 2D bar chart showing caloric intake trends over the last 7 days against target thresholds.
- **Settings & Data Management**:
  - Customizable goals for daily calories and macros.
  - Complete JSON backup **Export** and **Import** functionality.
  - Reset / Wipe data option.

---

## 🛠️ Technology Stack

- **HTML5**: Semantic document structure and native Canvas API.
- **CSS3**: Pure vanilla CSS (clean flexbox and grid layouts, custom card styling, modal overlays; **no CSS variables** or preprocessors).
- **JavaScript**: Pure vanilla ES6+ with DOM manipulation and browser `localStorage` persistence.

---

## 🚀 Getting Started

No build step, Node.js, or server configuration is required.

1. Clone or download this repository:
   ```bash
   git clone https://github.com/obong003/AI-pdt-bootcamp.git
   ```
2. Open `index.html` directly in any web browser:
   - On Windows: double-click `index.html` or run:
     ```powershell
     Start-Process index.html
     ```
   - On macOS:
     ```bash
     open index.html
     ```
   - On Linux:
     ```bash
     xdg-open index.html
     ```

---

## 📄 License

MIT License. Free to use and modify for personal and educational projects.

