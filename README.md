# TaskFlow — PWA Task Manager

A lightweight, offline-capable task manager built with **HTML, CSS, and vanilla JavaScript**.  
This is a **Progressive Web App (PWA)** — it can be installed on desktop and mobile, and works without internet.

![TaskFlow Preview](preview.png)

---

## ✦ Features

- ✅ Add, complete, and delete tasks
- 🎯 Priority levels: High, Normal, Low
- 🔍 Filter: All / Active / Completed
- 💾 Persists data using `localStorage` (no backend needed)
- 📲 Installable on mobile and desktop (PWA)
- 🔌 Works **offline** via Service Worker caching
- 📱 Fully responsive — mobile bottom nav, desktop sidebar

---

## 🛠 Tech Stack

| Technology | Purpose |
|---|---|
| HTML5 | Markup & structure |
| CSS3 | Styling, responsive layout, animations |
| Vanilla JavaScript | Logic, DOM manipulation, PWA setup |
| Service Worker | Offline caching |
| Web App Manifest | Installability |
| localStorage | Client-side data persistence |

---

## 📁 Project Structure

```
pwa-task-manager/
├── index.html       # App shell & structure
├── style.css        # All styles (responsive + animations)
├── app.js           # App logic + PWA install prompt
├── sw.js            # Service Worker (offline caching)
├── manifest.json    # PWA manifest (name, icons, colors)
├── icons/
│   ├── icon-192.png
│   └── icon-512.png
└── README.md
```

---

## 🚀 How to Run Locally

1. **Clone the repo:**
   ```bash
   git clone https://github.com/YOUR_USERNAME/pwa-task-manager.git
   cd pwa-task-manager
   ```

2. **Serve it locally** (Service Workers require a server, not `file://`):
   ```bash
   # Option A – VS Code Live Server extension (recommended)
   # Option B – Python
   python -m http.server 8080
   # Option C – Node.js
   npx serve .
   ```

3. **Open:** `http://localhost:8080`

> ⚠️ Service Workers and PWA install prompts require **HTTPS** in production  
> (GitHub Pages provides HTTPS automatically ✓)

---

## 🌐 Deploy to GitHub Pages (Free Hosting)

1. Push this repo to GitHub
2. Go to **Settings → Pages**
3. Source: `Deploy from a branch` → `main` → `/ (root)`
4. Your app will be live at: `https://YOUR_USERNAME.github.io/pwa-task-manager`

---

## 📲 How PWA Works (3 Core Ingredients)

### 1. `manifest.json`
Tells the browser the app name, icons, theme color, and how to display it when installed.

### 2. `sw.js` (Service Worker)
A background script that:
- **Caches** app files on first visit
- **Serves cached files** when offline (Cache-First strategy)
- Cleans up old caches on updates

### 3. HTTPS
Required for Service Workers in production. GitHub Pages provides this for free.

---

## 🧠 Key Concepts Learned

- PWA architecture (manifest + service worker)
- Cache-first offline strategy
- `localStorage` for client-side persistence  
- Responsive design with CSS variables
- PWA `beforeinstallprompt` event
- Mobile-first layout with sidebar + bottom nav

---

## 📄 License

MIT — free to use and modify.
