# Market Lane — Virtual Supermarket

A grocery browsing frontend built with React and Vite. The store view uses the supermarket reference image supplied for this project. Product categories, search, product details, favourites, and the basket are interactive.

## Current milestone

- Display the supplied supermarket aisle image as the store backdrop.
- Browse product categories, search the catalogue, save favourites, open product details, and manage a basket.
- Adapt the shopping controls for desktop and mobile screens.

The store view is a still image, not a walkable 3D scene. Checkout is a placeholder; there is no backend, database, account system, payment processing, or admin dashboard yet.

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
