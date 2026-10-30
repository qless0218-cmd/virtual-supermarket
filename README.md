# Market Lane — Virtual Supermarket

A walkable 3D supermarket shopping experience built with React, Three.js, React Three Fiber and Vite. The reference image guides the aisle composition; the store itself is rendered as a live 3D scene.

## Current milestone

- Explore a 3D grocery store with shelves, products, produce, chilled cases, aisle signs, ceiling lights, floor tiles and a shopping trolley.
- Use the Start walking button and WASD/arrow keys; move the mouse to look around. Touch users can use the on-screen direction pad.
- Select products in the 3D scene or browse categories, search, view details, save favourites and manage the live basket.
- Responsive desktop and mobile shopping controls.

Checkout is a placeholder; there is no backend, database, account system, payment processing, or admin dashboard yet.

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
