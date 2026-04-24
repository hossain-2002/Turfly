# 🌿 Turfly

A premium sports turf booking platform designed to help users find and book their favorite grounds with ease. This project is built on a modern **Midnight Pro** theme with fresh **Dew-Drop** branding.

## ✨ Key Features:
- **Dynamic Booking System**: Easily select sports and dates to book turfs in seconds.
- **Admin & Manager Portals**: Powerful dashboards to manage and monitor bookings efficiently.
- **Fully Responsive**: A seamless user experience across both mobile and desktop devices.

## 🛠️ Tech Stack:
- **Frontend**: React.js, TypeScript, Tailwind CSS.
- **Icons**: Lucide React.
- **Animations**: Framer Motion.

## 🧭 Project Structure (Feature-Based)
Use this map to quickly find the right module.

```text
src/
	app/
		providers/         # App-level provider composition
		routes/            # AppRoutes, ProtectedRoute, RouteLoader
	features/
		auth/
			pages/           # Login, Register
		bookings/
			pages/           # Checkout, MyBookings
			services/        # Booking business rules
		dashboard/
			pages/           # AdminDashboard, ManagerDashboard
		home/
			pages/           # Home
			components/      # Home-specific UI blocks
		support/
			pages/           # Support
		theme/
			services/        # Theme initialization/application
		turfs/
			pages/           # TurfList, TurfDetail
			components/      # Turf map components
	components/          # Shared/common reusable components
	context/             # Auth, Data, Toast providers
	hooks/               # Shared custom hooks
	layouts/             # Page layout wrappers
	services/            # External/service clients (e.g., firebase)
	types/               # Domain type definitions + barrel exports
	utils/               # Shared utilities
```

### Routing Notes
- Route definitions live in `src/app/routes/AppRoutes.tsx`.
- Route-level lazy loading is enabled for page modules.
- Auth gating is handled by `ProtectedRoute`.

## 🚀 How to Run Locally:
1. **Clone the repository** to your local machine.
2. Open the terminal and run `npm install` to install all dependencies.
3. Start the project by running the `npm run dev` command.

---
**Crafted with ❤️ by SHISHIR AND SADI**
