# Market Lane — Virtual Supermarket

An interactive 3D supermarket frontend built with React, Vite, Three.js, and React Three Fiber.

## First milestone

- Explore a procedural supermarket interior with shelves, stocked aisles, produce displays, signs, checkout counters, tiled floors, and lighting.
- Drag or swipe to look around; scroll or pinch to move closer. The on-screen directional pad nudges the view.
- Browse product categories, search the catalogue, save favourites, open product details, and manage a basket.
- Layout adapts for mobile screens.

This milestone is a frontend prototype. Checkout is a placeholder; there is no backend, database, account system, payment processing, or admin dashboard yet.

## Run locally

```sh
npm install
npm run dev
```

## Production

```sh
npm install
npm run build
npm start
```

The Node server serves the built `dist/` files and listens on Render's `PORT` environment variable (or port 10000 locally).
