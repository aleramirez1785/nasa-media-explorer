# 🚀 NASA Media Explorer

A modern web application for searching, exploring, and visualizing images, videos, and audio from NASA's media library — built with React + Vite under a JAMstack architecture.

![NASA Media Explorer](https://images-assets.nasa.gov/image/PIA12235/PIA12235~thumb.jpg)

---

## ✨ Features

| Feature | Description |
|---|---|
| 🔍 Smart Search | Debounced search bar with auto-suggestions |
| 🖼️ Media Grid | Responsive card grid with lazy-loaded images |
| 🎬 Media Types | Filter by image, video, or audio |
| 📄 Detail Page | Full media viewer with metadata, download links, and keywords |
| ❤️ Favorites | Save items to localStorage, persisted across sessions |
| 🕐 Search History | Recent searches with quick re-run and delete |
| 🌙 Dark Mode | System-aware with manual toggle, persisted |
| 📦 Pagination | Smart page navigation with ellipsis |
| ⚡ Lazy Loading | Images load only when entering the viewport |
| 🔀 Code Splitting | Pages are lazy-loaded for optimal bundle size |
| 💥 Error States | Friendly error messages with retry |
| 🔭 Empty States | Helpful prompts when no results found |
| ♿ Accessible | ARIA labels, keyboard navigation, semantic HTML |

---

## 🛠️ Tech Stack

- **React 19** + **Vite 8** — fast dev server and optimized builds
- **TailwindCSS v4** — utility-first styling with dark mode
- **React Router DOM v7** — client-side routing
- **Axios** — HTTP client with timeout handling
- **Context API** — global state for search, favorites, and theme
- **ESLint + Prettier** — code quality and formatting

---

## 📁 Project Structure

```
src/
├── components/
│   ├── layout/
│   │   ├── Layout.jsx        # App shell with navbar and footer
│   │   └── Navbar.jsx        # Sticky nav with search, favorites, theme toggle
│   ├── ui/
│   │   ├── Badge.jsx         # Media type badge
│   │   ├── Button.jsx        # Reusable button with variants
│   │   ├── EmptyState.jsx    # No results UI
│   │   ├── ErrorMessage.jsx  # Error UI with retry
│   │   └── Spinner.jsx       # Loading spinner
│   ├── LazyImage.jsx         # Intersection Observer-based lazy image
│   ├── MediaCard.jsx         # Search result card
│   ├── Pagination.jsx        # Page navigation
│   ├── ResultsGrid.jsx       # Grid + loading/error/empty states
│   └── SearchBar.jsx         # Debounced search with history dropdown
├── context/
│   ├── FavoritesContext.jsx  # Favorites state + localStorage
│   ├── SearchContext.jsx     # Search state + history
│   └── ThemeContext.jsx      # Dark/light mode
├── hooks/
│   ├── useAssetDetail.js     # Fetch NASA asset manifest
│   ├── useDebounce.js        # Debounce hook
│   ├── useIntersectionObserver.js  # Lazy loading hook
│   └── useNasaSearch.js      # Search execution hook
├── pages/
│   ├── DetailPage.jsx        # Full media detail view
│   ├── FavoritesPage.jsx     # Saved favorites
│   ├── HomePage.jsx          # Hero + search results
│   └── NotFoundPage.jsx      # 404
├── services/
│   └── nasaApi.js            # Axios API client
└── utils/
    └── helpers.js            # Utility functions
```

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm 9+

### Installation

```bash
# Clone the repository
git clone https://github.com/your-username/nasa-media-explorer.git
cd nasa-media-explorer

# Install dependencies
npm install

# Copy environment variables
cp .env.example .env
```

### Environment Variables

```env
VITE_NASA_API_BASE_URL=https://images-api.nasa.gov
```

> The NASA Images API is **free and requires no API key**.

### Development

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### Production Build

```bash
npm run build
npm run preview
```

---

## 🌐 API Reference

This app uses the [NASA Images and Video Library API](https://images.nasa.gov/docs/images.nasa.gov_api_docs.pdf).

| Endpoint | Description |
|---|---|
| `GET /search` | Search media by query, type, date range |
| `GET /asset/{nasa_id}` | Get asset manifest (download URLs) |
| `GET /metadata/{nasa_id}` | Get full metadata |
| `GET /captions/{nasa_id}` | Get video captions |

No authentication required.

---

## 📦 Deployment

### Vercel

```bash
npm install -g vercel
vercel --prod
```

### Netlify

```bash
npm run build
# Deploy the dist/ folder
```

### GitHub Pages

```bash
npm install -D gh-pages
# Add to package.json: "homepage": "https://username.github.io/nasa-media-explorer"
npm run build
npx gh-pages -d dist
```

> For SPA routing on static hosts, configure redirects so all routes serve `index.html`.
> - **Netlify**: add `public/_redirects` with `/* /index.html 200`
> - **Vercel**: add `vercel.json` with rewrites

---

## 🧹 Code Quality

```bash
# Lint
npm run lint

# Format
npx prettier --write src/
```

---

## 📄 License

MIT — feel free to use, modify, and distribute.

---

## 🙏 Credits

- Media data: [NASA Images and Video Library](https://images.nasa.gov)
- Icons: Unicode emoji
- Font: [Inter](https://rsms.me/inter/) via Google Fonts
