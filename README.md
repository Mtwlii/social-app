# 🌐 Social App

A modern social media application built with React 19 and Vite, featuring post creation, image uploads, authentication, and a clean responsive UI.

**🔗 Live Demo:** [socialhub-blond-delta.vercel.app](https://socialhub-blond-delta.vercel.app)

---

## ✨ Features

- 🔐 User authentication (Register / Login)
- 📝 Create posts with text and image support
- 🖼️ Image preview and crop before uploading
- 🔔 Toast notifications via Sonner
- 🌙 Dark mode support
- 📱 Fully responsive design
- ⚡ Fast data fetching with TanStack Query

---

## 🛠️ Tech Stack

| Category | Technology |
|---|---|
| Framework | React 19 + Vite |
| Routing | React Router DOM v7 |
| Styling | Tailwind CSS v4 |
| UI Components | HeroUI + Flowbite |
| Data Fetching | TanStack React Query v5 |
| Forms | React Hook Form + Zod |
| HTTP Client | Axios |
| Animations | Framer Motion |
| Icons | React Icons |
| Notifications | Sonner |

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/Mtwlii/social-app.git

# Navigate to the project directory
cd social-app

# Install dependencies
npm install

# Start the development server
npm run dev
```

The app will be running at `http://localhost:5173`

---

## 📜 Available Scripts

```bash
npm run dev       # Start development server
npm run build     # Build for production
npm run preview   # Preview production build
npm run lint      # Run ESLint
```

---

## 📁 Project Structure

```
social-app/
├── public/
├── src/
│   ├── components/     # Reusable UI components
│   ├── pages/          # Page components
│   ├── context/        # React context providers
│   ├── hooks/          # Custom hooks
│   └── main.jsx        # App entry point
├── index.html
├── vite.config.js
└── package.json
```

---

## 🌍 Deployment

This project is deployed on **Vercel**. To deploy your own instance:

```bash
npm run build
```

Then connect your GitHub repo to [Vercel](https://vercel.com) for automatic deployments.

---

## 👤 Author

**Mtwlii**
- GitHub: [@Mtwlii](https://github.com/Mtwlii)
